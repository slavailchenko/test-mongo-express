const jwt = require('jsonwebtoken');
const ServerError = require('../lib/errors');
const tokenJWT = require('../service/jwt.service');
const config = require('../config/app.config');
const log = require('../service/log.service')(module);
const blackListModel = require ('../models/blacklist.model');

module.exports = {

    checkToken: (req, res, next) => {

        const token = req.headers['x-access-token'];

        if (!token) 
            return next(new ServerError(401, 'No authorization token was found'));

        blackListModel.findOne({token: token})
        .then(token => {
            if (token) {
                return next(new ServerError(401, 'Client logout. Please login'));
            }
        })
        .then(()=> tokenJWT.verifyToken(req.headers['x-access-token']))
        .then(decoded => {
            if (decoded.role === 'client') {
                req.currentClient = decoded;
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

    checkRefreshToken: (req, res, next) => {

        blackListModel.findOne({refreshToken: req.body.refresh_token})
        .then((refreshToken) => {
            if (refreshToken) 
                return next (new ServerError(401, 'Client logout. Please login'))
            else next ()
        })
        .catch(next);
   
    },

    hasRole: (role) => {
        return function(req, res, next) {
            if (role === req.currentClient.role) {
                next()
            } else return next(new ServerError(403, 'Forbidden request forbidden by administrative rules'));        
        }
    }
}