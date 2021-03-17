const { Api } = require('../utils/NHApi/Api');
const User = require('../models/users');
const io = require('../utils/socket');

exports.gatherData = async () => {
	const nhapi = new Api(process.env.NICEHASH_BASE);
	setInterval(async () => {
		try {
			const users = await User.find().populate('NiceHashApi');
			users.forEach(async (user) => {
				const response = await nhapi.requestPrivate(
					'/main/api/v2/mining/rigs2',
					{
						publicKey: user.NiceHashApi.publicKey,
						privateKey: user.NiceHashApi.privateKey,
						method: 'GET',
						organizationId: user.NiceHashApi.organizationId,
					}
				);
        // console.log(response);
				await io.getIO().to(user.webSocketId).emit('RIGS', response.data);
			});
		} catch (error) {
			console.log(error);
		}
	}, 1000);
};
