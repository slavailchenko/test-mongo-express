const router = require('express').Router();
const products = require ('../controller/product.controller');

router.get('/', products.getProductByTitleCash);
router.get('/:id', products.getProductById);
router.get('/:id/supplier', products.getCompany);
router.post('/', products.newProduct);
router.put('/:id', products.updateProduct);
router.delete('/:id', products.removeProduct);

module.exports = router;