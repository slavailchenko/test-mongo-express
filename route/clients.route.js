const router = require('express').Router();
const clients = require ('../controller/client.controller');
const currentClient = require('../controller/currentClient.controller');
const session = require('../controller/session.controller');
const clientToken = require('../middleware/token.middleware');
const middleware_hasRole = clientToken.hasRole('admin');

router.post('/login', clients.arrayOfValidation[0], clients.validationFields, session.login);
router.post('/registration', clients.arrayOfValidation, clients.validationFields, session.registration);

router.use('/', clientToken.checkToken);

router.post('/logout', clients.arrayOfValidation[0], clients.validationFields, session.logout);

router.all('/me', clientToken.hasRole('client'));
router.get('/me', currentClient.currentClient);

router.all('/', middleware_hasRole);
router.get('/', clients.getAllClients);
router.get('/:id', clients.getClientById);
router.post('/', clients.arrayOfValidation, clients.validationFields, clients.newClient);
router.put('/:id', clients.arrayOfValidation, clients.validationFields, clients.updateClient);
router.delete('/:id', clients.removeClient);

// router.get('/me/orders', clientToken.hasRole('client'), currentClient.getOrdersClient);
// router.post('/me/orders', clientToken.hasRole('client'), currentClient.newOrderClient);

module.exports = router;