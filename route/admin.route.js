const router = require('express').Router();
const admin = require('../controller/session.controller');
const clientToken = require('../middleware/token.middleware');
const middleware_hasRole = clientToken.hasRole('admin');

// router.get('/clients/:id/generate-token', admin.generateTokenClient);
router.get('/generate-token', admin.generateTokenAdmin);

router.all('/', clientToken.checkToken, middleware_hasRole);
router.delete('/clear-tokens', admin.deleteTokensFromBlackList);

module.exports = router; 