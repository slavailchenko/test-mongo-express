const jwt = require('jsonwebtoken');
const ServerError = require('../lib/errors');
const tokenJWT = require('../service/jwt.service');
const config = require('../config/app.config');
const log = require('../service/log.service')(module);

module.exports = {

    checkTokenClient: (req, res, next) => {

        const token = req.headers['x-access-token'];
        if (!token) return next(new ServerError(401, 'No authorization token was found'));

        let data = tokenJWT.verifyToken(token);
        if (data.role == 'client') {
            req.currentClient = data;
            log.info(`Client ${req.currentClient.clientId} logged in with token: ${token}`); 
            next();
        } else {
            return next(new ServerError(401, `Token is invalid for client ${req.currentClient._id}`))
        }
    },

    checkTokenAdmin: (req, res, next) => {

        const token = req.headers['x-access-token'];
        if (!token) return next(new ServerError(401, 'No authorization token was found'));

        let data = tokenJWT.verifyToken(token);
        if (data.role == 'system') {
            log.info(`Admin logged in with token: ${token}`);
            next();
        } else {
            return next(new ServerError(401, 'Token is invalid for admin'))
        }
    }
}
