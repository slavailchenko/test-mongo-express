const jwt = require('jsonwebtoken');
const ServerError = require('../lib/errors');
const tokenJWT = require('../service/jwt.service');
const config = require('../config/app.config');
const log = require('../service/log.service')(module);

module.exports = {

    checkToken: (req, res, next) => {

        const token = req.headers['x-access-token'];
        if (!token) return next(new ServerError(401, 'No authorization token was found'));

        tokenJWT.verifyToken(token)
        .then(decoded => {
            if (decoded.role === 'client') {
                req.currentClient = decoded;
                log.info(`Client ${req.currentClient.clientId} logged in with token: ${token}`); 
                next();
            } else if (decoded.role === 'system') {
                log.info(`Admin logged in with token: ${token}`);
                req.currentClient = decoded;
                next();
            } else {
                return next(new ServerError(401, `Token is invalid`))
            }
        })
        .catch(next);
    },

    hasRole: (role) => {
        return function(req, res, next) {
            console.log(role);
            if (role === req.currentClient.role) {
                next()
            } else return next(new ServerError(403, 'Forbidden request forbidden by administrative rules'));        
        }
    }
}
