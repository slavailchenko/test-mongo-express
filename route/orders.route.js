const router = require('express').Router();

const orders = require ('../controller/order.controller');
const orderCheck = require('../middleware/order.middleware');

	router.use('/:id', orderCheck.checkOrder);

	router.get('/', orders.getAllOrders);
	router.get('/:id', orders.getOrderById);
	router.post('/', orders.newOrder);
	router.put('/:id', orders.updateOrder);
	router.delete('/:id', orders.removeOrder);

module.exports = router;