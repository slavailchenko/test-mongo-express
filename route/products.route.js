const router = require('express').Router();
const products = require ('../controller/product.controller');
const clientToken = require('../middleware/token.middleware');
const middleware_hasRole = clientToken.hasRole('system');

router.use('/', clientToken.checkToken);
router.get('/', products.getProductByTitleCache);
router.get('/:id', products.getProductById);
router.get('/:id/supplier', middleware_hasRole, products.getCompany);
router.post('/', middleware_hasRole, products.arrayOfValidation, products.validationFields, products.newProduct);
router.put('/:id', middleware_hasRole, products.arrayOfValidation, products.validationFields, products.updateProduct);
router.delete('/:id', middleware_hasRole, products.removeProduct);

module.exports = router;