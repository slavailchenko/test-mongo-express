const router = require('express').Router();

const suppliers = require ('../controller/supplier.controller');
const supplierCheck = require('../middleware/supplier.middleware');

	router.use('/:id', supplierCheck.checkSupplier);

	router.get('/', suppliers.getAllSuppliers);
	router.get('/:id', suppliers.getSupplierById);
	router.post('/', suppliers.newSupplier);
	router.put('/:id', suppliers.updateSupplier);
	router.delete('/:id', suppliers.removeSupplier);

module.exports = router;