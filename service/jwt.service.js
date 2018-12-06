const jwt = require('jsonwebtoken');
const config = require('../config/app.config');
const log = require('../service/log.service')(module);
const ServerError = require('../lib/errors');

module.exports = {

	generateToken: (data) => {
		const dataAll = Object.assign (data, {
			date: new Date (),
			version: config.authToken.version 
		});
		log.info(dataAll);
		const token = jwt.sign(dataAll, config.authToken.secretKey,
			{ expiresIn: config.authToken.tokenExpirationTimeSec});
		return token;
	},

	verifyToken: (token) => {
		return jwt.verify(token, config.authToken.secretKey, (err, decoded) => {
			if (err) {
				return new ServerError(401, 'Invalid auth token')
			} else {
				log.info(decoded);
				log.info(`Decoded ${decoded.role}`);
				return decoded;
			}
		})
	}
}