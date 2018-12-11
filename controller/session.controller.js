const clientModel = require ('../models/clients.model');
const tokenJWT = require('../service/jwt.service');
const ServerError = require('../lib/errors');
const log = require('../service/log.service')(module);
const config = require('../config/app.config');

module.exports = {

    generateTokenClient: (req, res, next) => {
        let data = Object.assign ({}, {clientId: req.params.id, role: 'client'});
        tokenJWT.generateToken(data)
        .then(token => {
            res.json({token: token})
        })
        .catch(next);
    },

    generateTokenAdmin: (req, res, next) => {
        let data = Object.assign ({}, {role: 'admin'});
        tokenJWT.generateToken(data)
        .then(token => {
            res.json({token: token})
        })
        .catch(next);
    },

    signIn: (req, res, next) => {

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
            log.info(`Client with email "${client[0].email}" have token: "${token}"`);
            res.status(201).json({client, token});
        })
        .catch(next);
    },

    signUp: (req, res, next) => {
        const data = Object.assign({}, req.body);
        clientModel.create(data)
        .then(clientSaved => {
            log.info(`Client added with id: ${clientSaved._id}`);

            return tokenJWT.generateToken({clientId: clientSaved._id, role: 'client'})
            .then(token => ({clientSaved, token}))
            .then(({clientSaved, token}) => {
                log.info(`Client "${clientSaved.email}"" logged in with token: "${token}"`);
                res.json({client: clientSaved, token});
            })
            .catch(next)
        })
        .catch(next);
    },

    currentUser: (req, res, next) => {
        clientModel.findById({_id: req.currentClient.clientId}).lean()
        .then(client => {
            if (!client) throw new ServerError(404, 'Client not founded');
            res.json({client: client})
        })
        .catch(next);
    }

};
