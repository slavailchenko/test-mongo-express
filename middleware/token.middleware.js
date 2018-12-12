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
                // console.log(req.currentClient);
                req.currentClient = decoded;
                console.log(req.currentClient);
                log.info(`Client ${req.currentClient.clientId} logged in with token: ${token}`); 
                next();
            } else if (decoded.role === 'admin') {
                req.currentClient = decoded;
                log.info(`Admin logged in with token: ${token}`);
                next();
            } else {
                return next(new ServerError(401, `Token is invalid`))
            }
        })
        .catch(next);
    },

    checkLogin: (req, res, next) => {

        console.log(req.currentClient.isActive);
        if (req.currentClient.isActive) {
            next()
        } else return next (new ServerError(401, 'Client is not logged'))
        
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
