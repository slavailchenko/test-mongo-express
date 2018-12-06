const router = require('express').Router();
const admin = require('../controller/session.controller');

router.get('/clients/:id/generate-token', admin.generateTokenClient);
router.get('/system/generate-token', admin.generateTokenSystem);

module.exports = router; 