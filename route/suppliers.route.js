const router = require('express').Router();
const suppliers = require ('../controller/supplier.controller');
const clientToken = require('../middleware/token.middleware');
const middleware_hasRole = clientToken.hasRole('admin');

router.use('/', clientToken.checkToken, middleware_hasRole);
router.get('/', suppliers.getAllSuppliers);
router.get('/:id', suppliers.getSupplierById);
router.post('/', suppliers.arrayOfValidation, suppliers.validationFields, suppliers.newSupplier);
router.put('/:id', suppliers.arrayOfValidation, suppliers.validationFields, suppliers.updateSupplier);
router.delete('/:id', suppliers.removeSupplier);

module.exports = router;