const {
	updateRig,
	updateDevice,
	createDevice,
	createRig,
	updateRigs,
} = require('../../../jobs/dataHandlers/dataHandlers');

const mongoose = require('mongoose');
const User = require('../../../models/users');
const NiceHashApi = require('../../../models/NiceHash/NiceHashApi');
const NiceHashData = require('../../../models/NiceHash/NiceHashData');
const Rig = require('../../../models/NiceHash/rigs/rigs');
const utils = require('../../../utils/utils');

test('updates one object with values in other object without changing the Id', () => {
	const oldDevice = {
		id: 'AAAA',
		name: 'old',
		temperature: 1,
		load: 11,
		powerUsage: 111,
	};

	const newDevice = {
		id: 'BBBB',
		name: 'new',
		temperature: 2,
		load: 22,
		powerUsage: 222,
	};

	const expectedDevice = {
		id: 'AAAA',
		name: 'new',
		temperature: 2,
		load: 22,
		powerUsage: 222,
	};

	expect(updateDevice(oldDevice, newDevice)).toStrictEqual(expectedDevice);
});

test('creates device based on provided data', () => {
	const newDevice = {
		id: 'BBBB',
		name: 'new',
		temperature: 2,
		load: 22,
		powerUsage: 222,
		dwadaw: 2131,
		thrashData: 'awdasdawd',
	};
	const expectedDevice = {
		id: 'BBBB',
		name: 'new',
		temperature: 2,
		load: 22,
		powerUsage: 222,
	};

	expect(createDevice(newDevice)).toStrictEqual(expectedDevice);
});

test('correctly updates rigs in RAM', () => {
	const sourceRig = {
		devices: [
			{
				id: 'ID-1',
				name: 'Intel(R) Pentium(R) CPU G4400 @ 3.30GHz',
				deviceType: { enumName: 'CPU', description: 'CPU' },
				status: { enumName: 'DISABLED', description: 'Disabled' },
				temperature: -1,
				load: 2,
				revolutionsPerMinute: -1,
				revolutionsPerMinutePercentage: -1,
				powerMode: { enumName: 'UNKNOWN', description: 'Unknown' },
				powerUsage: -1,
				speeds: [],
				intensity: { enumName: 'LOW', description: 'Low power mode' },
				nhqm: '',
			},
			{
				id: 'ID-2',
				name: 'Gigabyte GeForce RTX 2080 Ti',
				deviceType: { enumName: 'NVIDIA', description: 'Nvidia' },
				status: { enumName: 'MINING', description: 'Mining' },
				temperature: 58,
				load: 100,
				revolutionsPerMinute: -1,
				revolutionsPerMinutePercentage: 59,
				powerMode: { enumName: 'HIGH', description: 'High power mode' },
				powerUsage: 167,
				speeds: [[Object]],
				intensity: { enumName: 'LOW', description: 'Low power mode' },
				nhqm: '',
			},
			{
				id: 'ID-3',
				name: 'Gigabyte GeForce GTX 1070',
				deviceType: { enumName: 'NVIDIA', description: 'Nvidia' },
				status: { enumName: 'MINING', description: 'Mining' },
				temperature: 54,
				load: 100,
				revolutionsPerMinute: 1757,
				revolutionsPerMinutePercentage: 55,
				powerMode: { enumName: 'HIGH', description: 'High power mode' },
				powerUsage: 141,
				speeds: [[Object]],
				intensity: { enumName: 'LOW', description: 'Low power mode' },
				nhqm: '',
			},
		],
		stats: [
			{
				statsTime: 1616009542000,
				market: 'EU_N',
				algorithm: {
					enumName: 'DAGGERHASHIMOTO',
					description: 'DaggerHashimoto',
				},
				unpaidAmount: '0.0000251',
				difficulty: 0.20015909446238303,
				proxyId: 3,
				timeConnected: 1615912772770,
				xnsub: true,
				speedAccepted: 77.2807419417657,
				speedRejectedR1Target: 0,
				speedRejectedR2Stale: 0,
				speedRejectedR3Duplicate: 0,
				speedRejectedR4NTime: 0,
				speedRejectedR5Other: 0,
				speedRejectedTotal: 0,
				profitability: 0.00019008000000000002,
			},
		],
		notifications: ['RIG_OFFLINE', 'RIG_ERROR'],
	};

	expectedRig = {
		devices: [
			{
				id: 'ID-1',
				name: 'Intel(R) Pentium(R) CPU G4400 @ 3.30GHz',
				temperature: -1,
				load: 2,
				powerUsage: -1,
			},
			{
				id: 'ID-2',
				name: 'Gigabyte GeForce RTX 2080 Ti',
				temperature: 58,
				load: 100,
				powerUsage: 167,
			},
			{
				id: 'ID-3',
				name: 'Gigabyte GeForce GTX 1070',
				temperature: 54,
				load: 100,
				powerUsage: 141,
			},
		],
		algorithm: 'DAGGERHASHIMOTO',
		unpaidAmount: '0.0000251',
		speedAccepted: 77.2807419417657,
		speedRejected: 0,
		profitability: 0.00019008000000000002,
	};

	oldRig = {
		devices: [
			{
				id: 'SomeOtherId',
				name: 'Intel(R) Pentium(R) CPU G4400 @ 3.30GHz',
				temperature: -1,
				load: 2,
				powerUsage: -1,
			},
			{
				id: 'ID-2',
				name: 'Gigabyte GeForce RTX 2080 Ti',
				temperature: 58,
				load: 55,
				powerUsage: 167,
			},
			{
				id: 'ID-3',
				name: 'Gigabyte GeForce GTX 1070',
				temperature: 54,
				load: 100,
				powerUsage: 100,
			},
		],
		algorithm: 'DAGGERHASHIMOTO',
		unpaidAmount: '0.0000251',
		speedAccepted: 10,
		speedRejected: 0,
		profitability: 0.00019008000000000002,
	};

	expect(updateRig(oldRig, sourceRig)).toStrictEqual(expectedRig);
});

test('should correctly create data in database and strip off unrelated values in return value', async () => {
	try {
		const serverSideData = {
			_id: expect.stringMatching(/./),
			miningRigs: [
				{
					rigId: 'RIG_ID_1',
					devices: [
						{
							id: 'ID-1',
							name: 'Intel(R) Pentium(R) CPU G4400 @ 3.30GHz',
							deviceType: { enumName: 'CPU', description: 'CPU' },
							status: { enumName: 'DISABLED', description: 'Disabled' },
							temperature: -1,
							load: 2,
							revolutionsPerMinute: -1,
							revolutionsPerMinutePercentage: -1,
							powerMode: { enumName: 'UNKNOWN', description: 'Unknown' },
							powerUsage: -1,
							speeds: [],
							intensity: { enumName: 'LOW', description: 'Low power mode' },
							nhqm: '',
						},
						{
							id: 'ID-2',
							name: 'Gigabyte GeForce RTX 2080 Ti',
							deviceType: { enumName: 'NVIDIA', description: 'Nvidia' },
							status: { enumName: 'MINING', description: 'Mining' },
							temperature: 58,
							load: 100,
							revolutionsPerMinute: -1,
							revolutionsPerMinutePercentage: 59,
							powerMode: { enumName: 'HIGH', description: 'High power mode' },
							powerUsage: 167,
							speeds: [[Object]],
							intensity: { enumName: 'LOW', description: 'Low power mode' },
							nhqm: '',
						},
						{
							id: 'ID-3',
							name: 'Gigabyte GeForce GTX 1070',
							deviceType: { enumName: 'NVIDIA', description: 'Nvidia' },
							status: { enumName: 'MINING', description: 'Mining' },
							temperature: 54,
							load: 100,
							revolutionsPerMinute: 1757,
							revolutionsPerMinutePercentage: 55,
							powerMode: { enumName: 'HIGH', description: 'High power mode' },
							powerUsage: 141,
							speeds: [[Object]],
							intensity: { enumName: 'LOW', description: 'Low power mode' },
							nhqm: '',
						},
					],
					stats: [
						{
							statsTime: 1616009542000,
							market: 'EU_N',
							algorithm: {
								enumName: 'DAGGERHASHIMOTO',
								description: 'DaggerHashimoto',
							},
							unpaidAmount: '0.0000251',
							difficulty: 0.20015909446238303,
							proxyId: 3,
							timeConnected: 1615912772770,
							xnsub: true,
							speedAccepted: 77.2807419417657,
							speedRejectedR1Target: 0,
							speedRejectedR2Stale: 0,
							speedRejectedR3Duplicate: 0,
							speedRejectedR4NTime: 0,
							speedRejectedR5Other: 0,
							speedRejectedTotal: 0,
							profitability: 0.00019008000000000002,
						},
					],
					notifications: ['RIG_OFFLINE', 'RIG_ERROR'],
				},
			],
		};

		expectedRig = {
			miningRigs: [
				{
					devices: [
						{
							id: 'ID-1',
							name: 'Intel(R) Pentium(R) CPU G4400 @ 3.30GHz',
							temperature: -1,
							load: 2,
							powerUsage: -1,
						},
						{
							id: 'ID-2',
							name: 'Gigabyte GeForce RTX 2080 Ti',
							temperature: 58,
							load: 100,
							powerUsage: 167,
						},
						{
							id: 'ID-3',
							name: 'Gigabyte GeForce GTX 1070',
							temperature: 54,
							load: 100,
							powerUsage: 141,
						},
					],
					id: 'RIG_ID_1',
					algorithm: 'DAGGERHASHIMOTO',
					unpaidAmount: 0.0000251,
					speedAccepted: 77.2807419417657,
					speedRejected: 0,
					profitability: 0.00019008000000000002,
				},
			],
		};

		return await expect( updateRigs('60535f06727ffdb825782c94', serverSideData)).resolves.toMatchObject(expectedRig);
	} catch (error) {
		throw error;
	}
});

beforeAll(async () => {
	try {
		const resp = await mongoose.connect(
			`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.gx6v9.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`
		);

		const collections = await mongoose.connection.db.collections();
		for (let collection of collections) {
			await collection.deleteMany();
		}
	} catch (error) {
		console.log(error);
	}
});

beforeEach(async function () {
	try {
		const user = new User({
			_id: '60535f06727ffdb825782c92',
			email: 'test@test.com',
			password: '123456',
		});
		const newUser = await user.save();
		const privateKey = utils.keyEncrypt(newUser.email, 'dummy key');
		niceHashApi = new NiceHashApi({
			publicKey: 'dummy public key',
			privateKey: privateKey,
			organizationId: 'dummy organization id',
			owner: newUser._id,
			_id: '60535f06727ffdb825782c93',
		});
		const newNiceHashApi = await niceHashApi.save();
		niceHashData = new NiceHashData({
			owner: newUser._id,
			_id: '60535f06727ffdb825782c94',
		});
		const newNiceHashData = await niceHashData.save();
		newUser.niceHashApi = newNiceHashApi;
		newUser.niceHashData = newNiceHashData;
		await newUser.save();
	} catch (error) {
		console.log(error);
	}
});

afterEach(async function () {
	const collections = await mongoose.connection.db.collections();
	for (let collection of collections) {
		await collection.deleteMany();
	}
});

afterAll(async function () {
	await mongoose.disconnect();
});
