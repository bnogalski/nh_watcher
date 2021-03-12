const express = require('express');
const fs = require('fs/promises');
const path = require('path');

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

app.use((req,res,next) => {
  res.sendFile(path.join(__dirname, './index.html'));
})

app.listen(process.env.PORT || 8080);