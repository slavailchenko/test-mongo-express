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
		// log.info(dataAll);
		return new Promise ((resolve, reject) => {
			jwt.sign(dataAll, config.authToken.secretKey,
				{ expiresIn: config.authToken.tokenExpirationTimeSec}, (err, token) => {
					if (err) return reject(err);
					resolve (token);
				});
		})
	},

	verifyToken: (token) => {
		return new Promise ((resolve, reject) => { 
			jwt.verify(token, config.authToken.secretKey, (err, decoded) => {
				if (err) {
					return reject(new ServerError(401, 'Invalid token')); 
				} else {
					// log.info(decoded);
					log.info(`Decoded ${decoded.role}`);
					resolve(decoded);
				}
			})
		})
	}
}