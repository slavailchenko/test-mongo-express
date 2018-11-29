const ServerError = require('../lib/errors');
const orderModel = require ('../models/orders.model');

const fields = ['client_id', 'productIds', 'payment', 'delivery', 'status'];

module.exports = {

	checkOrder: (req, res, next) => {
		orderModel.findById({_id: req.params.id}).
		then(order => {
			console.log (order);
			if (!order) throw new ServerError(404, 'Order not founded')
				else next();
			if (req.method == 'PUT') {
				fields.forEach (item => {
					if (!req.body[item]) throw new ServerError(403, `Order cannot updated, field ${item} is null`);
				})
			};
		}).catch(next); 
	}
}