const router = require('express').Router();
const orders = require ('../controller/order.controller');
const clientToken = require('../middleware/token.middleware');
const middleware_hasRole = clientToken.hasRole('system');

router.use('/', clientToken.checkToken, middleware_hasRole);
router.get('/', orders.getAllOrders);
router.get('/:id', orders.getOrderById);
router.post('/', orders.newOrder);
router.put('/:id', orders.updateOrder);
router.delete('/:id', orders.removeOrder);

module.exports = router;