const cipher = require('../utils/utils');

test('encrypts and properly decrypts message', async () => {
	const testString = 'wiadomosc testowa wwad wadwad a';
	const salt = 'test@test.com';
	const encryptedMessage = cipher.keyEncrypt(salt, testString);

	await expect(cipher.keyDecrypt(salt, encryptedMessage)).resolves.toBe(
		testString
	);

});

test('should reject to "Malformed UTF-8 data"', async () => {
	const testString = 'wiadomosc testowa wwad wadwad a';
	const salt1 = 'test@test.com';
	const salt2 = 'test2@test.com';
	const encryptedMessage = cipher.keyEncrypt(salt1, testString);

	await expect(cipher.keyDecrypt(salt2, encryptedMessage)).rejects.toBe(
		'Malformed UTF-8 data'
	);
});
