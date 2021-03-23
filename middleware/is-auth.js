const jwt = require('jsonwebtoken');

const isAuth = (authHeader) => {
	if (!authHeader) {
		const error = new Error('not authenticated.');
		error.statusCode = 401;
		throw error;
	}
	const token = authHeader.split(' ')[1];
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.SECRET_JWT);
	} catch (err) {
		err.statusCode = 500;
		throw err;
	}
	if (!decodedToken) {
		const error = new Error('not authenticated');
		error.statusCode = 401;
		throw error;
	}

	return decodedToken.userId;
};

exports.isAuthExpress = (req, res, next) => {
	req.userId = isAuth(req.get('Authorization'));
	next();
};

exports.isAuthWebtoken = (socket, next) => {
	try {
		socket.userId = isAuth(socket.handshake.auth.token);
	} catch (error) {
		console.log(error);
		next(error);
	}
	next();
};
