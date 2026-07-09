const express = require('express');
const router = express.Router();
const {
  addVehicle,
  listVehicles,
  getVehicle,
  changeVehicleStatus,
  removeVehicle
} = require('../controllers/vehicleController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// All vehicle routes require a valid token
router.use(verifyToken);

// View routes — both managers and drivers can access
router.get('/', listVehicles);
router.get('/:id', getVehicle);

// Manager-only routes
router.post('/', authorizeRoles('manager'), addVehicle);
router.patch('/:id/status', authorizeRoles('manager'), changeVehicleStatus);
router.delete('/:id', authorizeRoles('manager'), removeVehicle);

module.exports = router;