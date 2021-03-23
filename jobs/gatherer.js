const { Api } = require('../utils/NHApi/Api');
const User = require('../models/users');
const io = require('../utils/socket');
const utils = require('../utils/utils');
const dataHandler = require('./dataHandlers/dataHandlers');

const gatherer = async (nhapi) => {
	try {
		const users = await User.find().populate('niceHashApi');
		// users.forEach(async (user) => {
		for (const user of users) {
			const privateKey = await utils.keyDecrypt(
				user.email,
				user.niceHashApi.privateKey
			);
			const response = await nhapi.requestPrivate('/main/api/v2/mining/rigs2', {
				publicKey: user.niceHashApi.publicKey,
				privateKey: privateKey,
				method: 'GET',
				organizationId: user.niceHashApi.organizationId,
			});
			const data = await dataHandler.updateRigs(
				user.niceHashData._id,
				response.data
			);
			await io.getIO().emit('RIGS', data);
		}
	} catch (error) {
		console.log(error);
	}
	setTimeout(gatherer, 3000, nhapi);
};

exports.gatherData = async () => {
	const nhapi = new Api(process.env.NICEHASH_BASE);

	setTimeout(gatherer, 1000, nhapi);
};
