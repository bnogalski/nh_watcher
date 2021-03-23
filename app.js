const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const io = require('./utils/socket');
const statusRoutes = require('./routes/status');
const authRoutes = require('./routes/auth');
const jobs = require('./jobs/jobs');
const User = require('./models/users');
const NiceHashApi = require('./models/NiceHash/NiceHashApi');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.gx6v9.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, PATCH, DELETE'
	);
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use('/status', statusRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
	console.log(error);
	res
		.status(error.statusCode)
		.json({ message: error.message, data: error.data });
});

const { isAuthWebtoken } = require('./middleware/is-auth');

mongoose
	.connect(MONGODB_URI)
	.then((result) => {
		const server = app.listen(process.env.PORT || 8080);
		const nsp = io.init(server);

		nsp.use(isAuthWebtoken);

		nsp.on('connection', (socket) => {
			const id = socket.userId;
			User.findById(id)
				.then((user) => {
					if (user) {
						user.webSocketId = socket.id;
						return user.save();
					}
					throw new Error('user not found');
				})
				.catch((err) => {
					console.log(err);
				});
		});
	})
	.catch((err) => {
		console.log(err);
	});

jobs.startJobs();
