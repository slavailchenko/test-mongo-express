const ServerError = require('../lib/errors');
const supplierModel = require ('../models/suppliers.model');

const fields = ['company', 'manager', 'email', 'phone', 'adress', 
				'url'];

module.exports = {

	checkSupplier: (req, res, next) => {
		supplierModel.findById({_id: req.params.id}).
		then(supplier => {
			console.log (supplier);
			if (!supplier) throw new ServerError(404, 'Supplier not founded')
				else next();
			if (req.method == 'PUT') {
				fields.forEach (item => {
					if (!req.body[item]) throw new ServerError(403, `Supplier cannot updated, field ${item} is null`);
				})
			};
		}).catch(next); 
	}
}