const jwt = require('jsonwebtoken-refresh');
const clientModel = require ('../models/clients.model');
const tokenJWT = require('../service/jwt.service');
const ServerError = require('../lib/errors');
const log = require('../service/log.service')(module);
const config = require('../config/app.config');

module.exports = {

    generateTokenAdmin: (req, res, next) => {
        let data = Object.assign ({}, {role: 'admin'});
        tokenJWT.generateToken(data)
        .then(token => {
            res.json({token: token})
        })
        .catch(next);
    },

    login: (req, res, next) => {

        clientModel.find({email: req.body.email}).lean()
        .then(client => {
            if (!client) {
                throw new ServerError(404, 'Client not found');
            };
            let data = Object.assign ({}, {clientId: client[0]._id, role: 'client'});

            return tokenJWT.generateToken(data)
            .then(token => ({client, token}))
            .catch(next)
        })
        .then(({client, token}) => {

            const refreshToken = jwt.sign({
                clientId: client[0]._id, 
                role: 'client',
                date: new Date (),
                version: config.authToken.version}, 
                config.authToken.refreshSecretKey, 
                {expiresIn: config.authToken.refreshTokenExpirationTimeSec});

            log.info(`Client with email "${client[0].email}" have token: "${token}"`);
            res.status(201).json({client, token, refreshToken});
        })
        .catch(next);
    },

    registration: (req, res, next) => {
        const data = Object.assign({}, req.body);
        clientModel.create(data)
        .then(clientSaved => {
            log.info(`Client added with id: ${clientSaved._id}`);

            return tokenJWT.generateToken({clientId: clientSaved._id, role: 'client'})
            .then(token => ({clientSaved, token}))
            .then(({clientSaved, token}) => {

                const refreshToken = jwt.sign({
                    clientId: clientSaved[0]._id, 
                    role: 'client',
                    date: new Date (),
                    version: config.authToken.version}, 
                    config.authToken.refreshSecretKey, 
                    {expiresIn: config.authToken.refreshTokenExpirationTimeSec});

                log.info(`Client "${clientSaved.email}" logged in with token: "${token}"`);
                res.status(201).json({client: clientSaved, token, refreshToken});
            })
            .catch(next)
        })
        .catch(next);
    },

    refresh: (req, res, next) => {
        new Promise((resolve, reject) => {
            jwt.verify(
                req.sanitizeBody('refresh_token').trim(),
                config.authToken.refreshSecretKey,
                (err, decoded) => {
                    if (err || !decoded.clientId) {
                        return reject(new ServerError(401, 'Invalid token'));
                    }
                    resolve();
                }) 
        })
        .then(() => req.headers['x-access-token'])
        .then(token => jwt.decode(token, {complete: true}))
        .then(decodedToken => {
            req.currentClient = decodedToken.payload;
            return jwt.refresh(decodedToken, 
                config.authToken.tokenExpirationTimeSec, 
                config.authToken.secretKey)           
        })
        .then(newToken => {
            res.status(200).json({
                access_token: newToken,
                expires_in: config.authToken.tokenExpirationTimeSec,
                refresh_token: jwt.sign({
                    clientId: req.currentClient.clientId, 
                    role: 'client',
                    date: new Date (),
                    version: config.authToken.version}, 
                    config.authToken.refreshSecretKey, 
                    {expiresIn: config.authToken.refreshTokenExpirationTimeSec})
            })})
        .catch(next)
    },


    logout: (req, res, next) => {

        clientModel.find({email: req.body.email}).lean()
        .then(client => {
            console.log(client);
            if (!client) {
                throw new ServerError(404, 'Client not found');
            } else if (!req.currentClient.clientId) {
                throw new ServerError(404, 'Client dont logged')
            } else {
                req.currentClient.isActive = false;
                console.log(req.currentClient);
                next();
            }
        })
        .catch(next);
    },

    currentClient: (req, res, next) => {
        clientModel.findById({_id: req.currentClient.clientId}).lean()
        .then(client => {
            if (!client) throw new ServerError(404, 'Client not founded');
            res.json({client: client})
        })
        .catch(next);
    }

};
