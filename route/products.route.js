const router = require('express').Router();

const products = require ('../controller/product.controller');
const productCheck = require('../middleware/product.middleware');

	router.use('/:id', productCheck.checkProduct);

	router.get('/', products.getAllProducts);
	router.get('/:id', products.getProductById);
	router.post('/', products.newProduct);
	router.put('/:id', products.updateProduct);
	router.delete('/:id', products.removeProduct);

module.exports = router;