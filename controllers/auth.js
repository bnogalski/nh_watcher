const io = require('../utils/socket');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/users');
const utils = require('../utils/utils');

exports.login = async (req, res, next) => {
	/// here goes validation check

	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			const error = new Error('A user doest not exist');
			error.statusCode = 401;
			throw error;
		}

		// if(!bcrypt.compare(req.body.password, ))
		if (req.body.password !== user.password) {
			const error = new Error('wrong password');
			error.statusCode = 401;
			throw error;
		}

		const token = await jwt.sign(
			{ email: user.email, userId: user._id.toString() },
			process.env.SECRET_JWT,
			{ expiresIn: '1h' }
		);
    const expiresIn = 3600000;
		res.status(200).json({ token: token, userId: user._id.toString(), expiresIn: expiresIn });
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500;
		}
		next(error);
	}
};

exports.signup = (req, res, next) => {};
