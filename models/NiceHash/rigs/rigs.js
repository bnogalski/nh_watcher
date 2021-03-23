const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const niceHashDevicesSchema = new Schema();

const niceHashRigsSchema = new Schema({
	id: {
		type: String,
		required: true,
	},
	unpaidAmount: {
		type: Number,
		required: true,
	},
	algorithm: {
		type: String,
		required: true,
	},
	speedAccepted: {
		type: Number,
		required: true,
	},
	speedRejected: {
		type: Number,
		required: true,
	},
	profitability: {
		type: Number,
		required: true,
	},
	devices: [
		{
			id: {
				type: String,
				required: true,
			},
			name: {
				type: String,
				required: true,
			},
			temperature: {
				type: Number,
				required: true,
			},
			load: {
				type: Number,
				required: true,
			},
			powerUsage: {
				type: Number,
				required: true,
			},
			status: {
				type: String,
				required: true,
			},
		},
	],
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'NiceHashData',
		required: true,
	},
});

module.exports = mongoose.model('Rig', niceHashRigsSchema);
