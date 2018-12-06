const router = require('express').Router();
const products = require ('../controller/product.controller');
const clientToken = require('../middleware/token.middleware');

router.use('/', clientToken.checkTokenAdmin);
router.get('/', products.getProductByTitleCache);
router.get('/:id', products.getProductById);
router.get('/:id/supplier', products.getCompany);
router.post('/', products.newProduct);
router.put('/:id', products.updateProduct);
router.delete('/:id', products.removeProduct);

module.exports = router;