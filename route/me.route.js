const router = require('express').Router();
const currentClient = require('../controller/currentClient.controller');
const orders = require ('../controller/order.controller');
const products = require ('../controller/product.controller');
const clientToken = require('../middleware/token.middleware');

router.use('/', clientToken.checkTokenClient);
router.get('/', currentClient.currentClient);
router.get('/products', products.getProductByTitleCache);
router.get('/orders', currentClient.getOrdersClient);
router.post('/orders', currentClient.newOrderClient);

module.exports = router;