const router = require('express').Router();
const orders = require ('../controller/order.controller');
const clientToken = require('../middleware/token.middleware');

router.use('/', clientToken.checkTokenAdmin);
router.get('/', orders.getAllOrders);
router.get('/:id', orders.getOrderById);
router.post('/', orders.newOrder);
router.put('/:id', orders.updateOrder);
router.delete('/:id', orders.removeOrder);

module.exports = router;