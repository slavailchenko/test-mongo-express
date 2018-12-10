const router = require('express').Router();
const clients = require ('../controller/client.controller');
const currentClient = require('../controller/currentClient.controller');
const clientToken = require('../middleware/token.middleware');
const middleware_hasRole = clientToken.hasRole('admin');

router.use('/', clientToken.checkToken);
router.use('/all', middleware_hasRole);
router.get('/all', clients.getAllClients);
router.get('/all/:id', clients.getClientById);
router.post('/all', clients.arrayOfValidation, clients.validationFields, clients.newClient);
router.put('/all/:id', clients.arrayOfValidation, clients.validationFields, clients.updateClient);
router.delete('/all/:id', clients.removeClient);

router.get('/me', clientToken.hasRole('client'), currentClient.currentClient);
router.get('/me/orders', clientToken.hasRole('client'), currentClient.getOrdersClient);
router.post('/me/orders', clientToken.hasRole('client'), currentClient.newOrderClient);

module.exports = router;