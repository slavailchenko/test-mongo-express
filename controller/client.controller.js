const clientModel = require ('../models/clients.model')
const ServerError = require('../lib/errors');
const log = require('../service/log.service');

module.exports = {

  newClient: (req, res, next) => {
    clientModel.create(req.body)
    .then(clientSaved => res.status(201).json({client: clientSaved}))
    .catch(next);
  },

  getAllClients: (req, res, next) => {
    const query = req.query.email || '';
    clientModel.find({ email: { $regex: query.toLowerCase().trim(),  $options: 'ig' }})
    .then(clients => {
      if (!clients.length) throw new ServerError(404, 'Clients not founded');
      res.json(clients);
    }).catch(next);
  },

  getClientById: (req, res, next) => {
    clientModel.findById({_id: req.params.id})
    .then(client => {
      res.json(client);
    }).catch(next);
  },

  updateClient: (req, res, next) => {
    clientModel.findByIdAndUpdate({_id: req.params.id}, req.body)
    .then(client => {
      res.status(200).json(`Client with id=${req.params.id} updated`);
    }).catch(next);
  },

  someUpdateClient: (req, res, next) => {
    clientModel.update({_id: req.params.id}, {$set: req.body})
    .then(client => {
      res.status(200).json(`Client with id=${req.params.id} updated`);
    }).catch(next);
  },

  removeClient: (req, res, next) => {
    clientModel.findByIdAndRemove({_id: req.params.id})
    .then(client => {
      res.json(`Client with id=${req.params.id} deleted`);
    }).catch(next);
  }

}