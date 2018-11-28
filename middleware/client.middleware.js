const ServerError = require('../lib/errors');
const clientModel = require ('../models/clients.model');

const fields = ['first_name', 'last_name', 'email', 'phone', 'adress', 
				'date_regastration', 'status', 'status_reg', 'discount'];
const someFields = ['email', 'phone', 'status', 'status_reg', 'discount'];

module.exports = {

	checkClient: (req, res, next) => {
		clientModel.findById({_id: req.params.id}).
		then(client => {
			console.log (client);
			if (!client) throw new ServerError(404, 'Client not founded')
				else next();
			if (req.method == 'PUT') {
				fields.forEach (item => {
					if (!req.body[item]) throw new ServerError(403, `Client cannot updated, field ${item} is null`);
				})
			};
			if (req.method == 'PATCH') {
				someFields.forEach (item => {
					if (!req.body[item]) throw new ServerError(403, `Client cannot updated, field ${item} is null`);
				})
			}
		}).
		catch(next); 
	}