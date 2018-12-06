const clientModel = require ('../models/clients.model');
const tokenJWT = require('../service/jwt.service');
const ServerError = require('../lib/errors');
const config = require('../config/app.config');

module.exports = {

    generateTokenClient: (req, res, next) => {
        let data = Object.assign ({}, {clientId: req.params.id, role: 'client'});
        const token = tokenJWT.generateToken(data);
        res.json({token: token})
    },

    generateTokenSystem: (req, res, next) => {
        let data = Object.assign ({}, {role: 'system'});
        const token = tokenJWT.generateToken(data);
        res.json({token: token});
    },

    currentUser: (req, res, next) => {
        clientModel.findById({_id: req.currentClient.clientId}).lean().
        then(client => {
            if (!client) throw new ServerError(404, 'Client not founded');
            res.json({client: client})
        })
        .catch(next);
    }

};