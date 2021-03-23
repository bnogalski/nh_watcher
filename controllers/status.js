const io = require('../utils/socket');
const { Api } = require('../utils/NHApi/Api');
const User = require('../models/users');
const utils = require('../utils/utils');

exports.getRigs = (req, res, next) => {
	res.status(200).json({
		date: new Date().toString(),
	});
};

exports.control = async (req,res,next) => {
  const nhapi = new Api(process.env.NICEHASH_BASE);
  const rigId = req.body.rigId;
  const devId = req.body.devId;
  const cmd = req.body.command;

	try {
		const user = await User.findOne().populate('niceHashApi');
    const privateKey = await utils.keyDecrypt(
      user.email,
      user.niceHashApi.privateKey
    );

		const response = await nhapi.requestPrivate(
			'/main/api/v2/mining/rigs/status2',
			{
				publicKey: user.niceHashApi.publicKey,
				privateKey: privateKey,
				method: 'POST',
				organizationId: user.niceHashApi.organizationId,        
        body:{
          rigId: rigId,
          deviceId: devId, 
          action: cmd
        }
			}
		);

		console.log(response.data);
		res.status(200).json({
			message: 'stopped rig: ' + response.data,
		});
	} catch (error) {
		console.log(error);
		res.status(500);
	}
}

exports.stopRig = async (req, res, next) => {
	const nhapi = new Api(process.env.NICEHASH_BASE);
	try {
		const user = await User.findOne().populate('niceHashApi');
    console.log(user);
    const privateKey = await utils.keyDecrypt(
      user.email,
      user.niceHashApi.privateKey
    );

		const response = await nhapi.requestPrivate(
			'/main/api/v2/mining/rigs/status2',
			{
				publicKey: user.niceHashApi.publicKey,
				privateKey: privateKey,
				method: 'POST',
				organizationId: user.niceHashApi.organizationId,        
        body:{
          rigId: req.params.rigId,
          action: "STOP"
        }
			}
		);

		console.log(response.data);
		res.status(200).json({
			message: 'stopped rig: ' + response.data,
		});
	} catch (error) {
		console.log(error);
		res.status(500);
	}
};

exports.startRig = async (req, res, next) => {
  console.log(req.body);

	const nhapi = new Api(process.env.NICEHASH_BASE);
	try {
		const user = await User.findOne().populate('niceHashApi');
    const privateKey = await utils.keyDecrypt(
      user.email,
      user.niceHashApi.privateKey
    );

		const response = await nhapi.requestPrivate(
			'/main/api/v2/mining/rigs/status2',
			{
				publicKey: user.niceHashApi.publicKey,
				privateKey: privateKey,
				method: 'POST',
				organizationId: user.niceHashApi.organizationId,
        body:{
          rigId: req.params.rigId,
          action: "START"
        }
			}
		);

		console.log(response.data);
		res.status(200).json({
			message: 'stopped rig: ' + response.data,
		});
	} catch (error) {
		console.log(error);
		res.status(500);
	}
};

exports.restartRig = async (req, res, next) => {
	const nhapi = new Api(process.env.NICEHASH_BASE);
	try {
		const user = await User.findOne().populate('niceHashApi');
    const privateKey = await utils.keyDecrypt(
      user.email,
      user.niceHashApi.privateKey
    );

		const response = await nhapi.requestPrivate(
			'/main/api/v2/mining/rigs/status2',
			{
				publicKey: user.niceHashApi.publicKey,
				privateKey: privateKey,
				method: 'POST',
				organizationId: user.niceHashApi.organizationId,
        body:{
          rigId: req.params.rigId,
          action: "RESTART"
        }
			}
		);

		console.log(response.data);
		res.status(200).json({
			message: 'stopped rig: ' + response.data,
		});
	} catch (error) {
		console.log(error);
		res.status(500);
	}
};
