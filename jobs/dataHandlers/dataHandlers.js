const mongoose = require('mongoose');
const NiceHashData = require('../../models/NiceHash/NiceHashData');
const Rig = require('../../models/NiceHash/rigs/rigs');

//// exported for testing purposes only
updateDevice = (oldDevice, newDevice) => {
	oldDevice.name = newDevice.name;
	oldDevice.temperature = newDevice.temperature;
	oldDevice.load = newDevice.load;
	oldDevice.powerUsage = newDevice.powerUsage;
  oldDevice.status = newDevice.status.enumName;
	return oldDevice;
};

//// exported for testing purposes only
createDevice = (newDevice) => {
	const device = {
		id: newDevice.id,
		name: newDevice.name,
		temperature: newDevice.temperature,
		load: newDevice.load,
		powerUsage: newDevice.powerUsage,
    status: newDevice.status.enumName,
	};
	return device;
};

//// exported for testing purposes only
updateRig = (oldRig, newRig) => {
	oldRig.unpaidAmount = newRig.stats[0].unpaidAmount;
	oldRig.algorithm = newRig.stats[0].algorithm.enumName;
	oldRig.speedAccepted = newRig.stats[0].speedAccepted;
	oldRig.speedRejected = 0;
	oldRig.profitability = newRig.stats[0].profitability;
	oldRig.devices = newRig.devices.map((device) => {
		return createDevice(device);
	});
	return oldRig;
};

//// exported for testing purposes only
createRig = (newRig, id) => {
	rig = new Rig({ id: newRig.rigId, owner: id });
	updateRig(rig, newRig);
	return rig;
};

updateRigs = async (userDataId, data) => {
	try {
		const userData = await NiceHashData.findById(userDataId).populate(
			'miningRigs'
		);
		// await data.miningRigs.forEach(async (rig) => {
		for (const rig of data.miningRigs) {
			const foundRig = userData.miningRigs.find(
				(userRig) => userRig.id === rig.rigId
			);
			if (foundRig) {
				await updateRig(foundRig, rig).save();
			} else {
				const newRig = createRig(rig, userData._id);
				const savedRig = await newRig.save();
				userData.miningRigs.push(savedRig);
			}
		}
		const savedUserData = await userData.save();
/// stripoff db related data
    return await savedUserData.toObject({
			versionKey: false,
			transform: (document, ret, options) => {
				delete ret._id;
        delete ret.owner;
				return ret;
			},
		});

		return savedUserData;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	updateDevice,
	createDevice,
	updateRig,
	createRig,
	updateRigs,
};
