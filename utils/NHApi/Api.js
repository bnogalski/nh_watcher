const axios = require('axios').default;
const uuid = require('uuid');
const cryptojs = require('crypto-js');
const qs = require('qs');

const generateAuthHeader = (
	publicKey,
	privateKey,
	time,
	nonce,
	organizationId = '',
	request = {}
) => {
	const hmac = cryptojs.algo.HMAC.create(cryptojs.algo.SHA256, privateKey);

	hmac.update(publicKey);
	hmac.update('\0');
	hmac.update(time.toString());
	hmac.update('\0');
	hmac.update(nonce);
	hmac.update('\0');
	hmac.update('\0');
	if (organizationId) hmac.update(organizationId);
	hmac.update('\0');
	hmac.update('\0');
	hmac.update(request.method);
	hmac.update('\0');
	hmac.update(request.endpoint);
	hmac.update('\0');
	if (request.query) {
		hmac.update(
			typeof request.query == 'object'
				? qs.stringify(request.query)
				: request.query
		);
	}
	if (request.body) {
		hmac.update('\0');
		hmac.update(
			typeof request.body == 'object'
				? JSON.stringify(request.body)
				: request.body
		);
	}

	return publicKey + ':' + hmac.finalize().toString(cryptojs.enc.Hex);
};

class Api {
	constructor(apiBase) {
		this.apiBase = apiBase;
		this.timeDiff = null;
	}

	requestPublic = (endpoint) => {
		// let data;
		return axios
			.get(this.apiBase + endpoint)
			.then((response) => {
				return response.data;
			})
			.catch((err) => console.log(err));
		// return data;
	};

	createNonce = () => {
		var s = '',
			length = 32;
		do {
			s += Math.random().toString(36).substr(2);
		} while (s.length < length);
		s = s.substr(0, length);
		return s;
	};

	requestPrivate = async (
		endpoint,
		{ publicKey, privateKey, organizationId = '', method, query, body } = {}
	) => {
		if (this.timeDiff === null) {
			const requestData = await this.requestPublic('/api/v2/time ');
			this.serverTime = requestData.serverTime;
			this.timeDiff = +new Date() - requestData.serverTime;
		}

		const nonce = uuid.v4();
		const requestId = uuid.v4();
		const time = +new Date() - this.timeDiff;

		const path = this.apiBase + endpoint;
		const url = query ? path + '?' + qs.stringify(query) : path;
		const authHeader = generateAuthHeader(
			publicKey,
			privateKey,
			time,
			nonce,
			organizationId,
			{ method, endpoint, query, body }
		);

		try {
			const resp = await axios({
				method: method,
				url: url,
				data: body,
				headers: {
					'X-Request-Id': requestId,
					'X-User-Agent': 'TESTING',
					'X-Time': time.toString(),
					'X-Nonce': nonce,
					'X-User-Lang': 'en',
					'X-Organization-Id': organizationId,
					'X-Auth': authHeader,
				},
			});
			return resp;
		} catch (error) {
			if (error.response) {
				console.log(
					'API responded with error Status Code:',
					error.response.status
				);
				console.log('Error Data: ', error.response.data);
			} else if (error.request) {
				console.log('API did not respond!!');
				console.log(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log('Unhandled Error', error.message);
			}
		}
	};
}

axios.interceptors.request.use((request) => {
	return request;
});

exports.Api = Api;
