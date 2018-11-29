const ServerError = require('../lib/errors');
const productModel = require ('../models/products.model');

const fields = ['title', 'article', 'description', 'price', 
				'url', 'name_sub_category', 'brand_name', 'status',
				'state', 'days', 'supplier_id'];

module.exports = {

	checkProduct: (req, res, next) => {
		productModel.findById({_id: req.params.id}).
		then(product => {
			console.log (product);
			if (!product) throw new ServerError(404, 'Product not founded')
				else next();
			if (req.method == 'PUT') {
				fields.forEach (item => {
					if (!req.body[item]) throw new ServerError(403, `Product cannot updated, field ${item} is null`);
				})
			};
		}).catch(next); 
	}
}