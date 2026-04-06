const express = require('express');
const router = express.Router();
const empController = require('../controllers/employeeController');

router.post('/add', empController.createEmployee);
router.get('/', empController.getEmployees);

// ✅ add this
router.get('/view', empController.getEmployees);

module.exports = router;