const CryptoJs = require('crypto-js');

exports.keyEncrypt = (salt, message) => {
	const secret = CryptoJs.HmacSHA256(process.env.SECRET, salt);
	return CryptoJs.Rabbit.encrypt(message, secret);
};

exports.keyDecrypt = async (salt, encryptedMessage) => {

	promise = new Promise((resolve, reject) => {
		try {
      const secret = CryptoJs.HmacSHA256(process.env.SECRET, salt);
			const bytes = CryptoJs.Rabbit.decrypt(encryptedMessage, secret);
			message = bytes.toString(CryptoJs.enc.Utf8);
			resolve(message);
		} catch (error) {
			reject(error.message);
		}
	});

  return promise;
};
