const express = require('express');
const router = express.Router();
const {
  addCustomer,
  listCustomers,
  getCustomer,
  editCustomer,
  removeCustomer
} = require('../controllers/customerController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// All customer routes require a valid token
router.use(verifyToken);

// View routes — both managers and drivers can access
router.get('/', listCustomers);
router.get('/:id', getCustomer);

// Manager-only routes
router.post('/', authorizeRoles('manager'), addCustomer);
router.put('/:id', authorizeRoles('manager'), editCustomer);
router.delete('/:id', authorizeRoles('manager'), removeCustomer);

module.exports = router;