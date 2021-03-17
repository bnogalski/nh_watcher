const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

const io = require('./utils/socket');
const statusRoutes = require('./routes/status');
const jobs = require('./jobs/jobs')

const app = express();

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

const User = require('./models/users');
const NiceHashApi = require('./models/NiceHash/NiceHashApi');
const utils = require('./utils/utils');

mongoose
	.connect(
		`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.gx6v9.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`
	)
	.then((result) => {
		const server = app.listen(process.env.PORT || 8080);
		io.init(server).on('connection', (socket) => {
			User.find({email: 'test@test.com'}).then(users => {
				user =users[0];
				if(user){
					console.log(user);
					user.webSocketId= socket.id;
					return user.save();
				}
			})
		});
	})
	.catch((err) => {
		console.log(err);
	});

jobs.startJobs();



///func for testing stuff
setInterval(async () => {
	const userCount = await User.find().countDocuments();
	if (!userCount) {
		console.log('creating new user');
		const user = new User({
			email: 'test@test.com',
			password: '123456',
		});
		const newUser = await user.save();
		const privateKey = utils.keyEncrypt(newUser.email, process.env.NICEHASH_PRIVATE);
		niceHashApi = new NiceHashApi({
			publicKey: process.env.NICEHASH_PUBLIC,
			privateKey: privateKey,
			organizationId: process.env.NICEHASH_ORG_ID,
			owner: newUser._id
		})
		const newNiceHashApi = await niceHashApi.save(); 
		newUser.NiceHashApi = newNiceHashApi;
		await newUser.save();
	}
}, 1000);
