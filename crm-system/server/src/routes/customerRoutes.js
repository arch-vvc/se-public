const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customersController');

// CSV Import/Export
router.post('/import', customerController.importCustomers);
router.get('/export', customerController.exportCustomers);

// CRUD routes
router.get('/', customerController.getAll);
router.get('/:id', customerController.getOne);
router.post('/', customerController.create);
router.put('/:id', customerController.update);
router.delete('/:id', customerController.remove);

module.exports = router;
