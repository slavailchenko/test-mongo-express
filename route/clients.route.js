const router = require('express').Router();

const clients = require ('../controller/client.controller');
const clientCheck = require('../middleware/client.middleware');

	router.use('/:id', clientCheck.checkClient);

	router.get('/', clients.getAllClients);
	router.get('/:id', clients.getClientById);
	router.post('/', clients.newClient);
	router.put('/:id', clients.updateClient);
	router.patch('/:id', clients.someUpdateClient);
	router.delete('/:id', clients.removeClient);

module.exports = router;