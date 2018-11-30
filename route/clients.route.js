const router = require('express').Router();
const clients = require ('../controller/client.controller');

router.get('/', clients.getAllClients);
router.get('/:id', clients.getClientById);
router.post('/', clients.newClient);
router.put('/:id', clients.updateClient);
router.patch('/:id', clients.someUpdateClient);
router.delete('/:id', clients.removeClient);

module.exports = router;