const router = require('express').Router();
const orders = require ('../controller/order.controller');
const currentClient = require('../controller/currentClient.controller');
const clientToken = require('../middleware/token.middleware');
const middleware_hasRole = clientToken.hasRole('admin');

router.use('/', clientToken.checkToken);

router.all('/', middleware_hasRole);
router.get('/me', clientToken.hasRole('client'), currentClient.getOrdersClient);
router.post('/me', clientToken.hasRole('client'), currentClient.newOrderClient);

router.all('/', middleware_hasRole);
router.get('/', orders.getAllOrders);
router.get('/:id', orders.getOrderById);
router.post('/', orders.newOrder);
router.put('/:id', orders.updateOrder);
router.delete('/:id', orders.removeOrder);

module.exports = router;