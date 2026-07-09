const express = require('express');
const router = express.Router();
const {
  addShipment,
  listShipments,
  getShipment,
  getShipmentsForRoute,
  getMyShipments,
  changeShipmentStatus,
  removeShipment
} = require('../controllers/shipmentController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { shipmentValidation } = require('../middleware/validators');

// All shipment routes require a valid token
router.use(verifyToken);

// Driver's own deliveries — must come before /:id
router.get('/mine', authorizeRoles('driver'), getMyShipments);

// Shipments for a specific route (manager)
router.get('/route/:routeId', authorizeRoles('manager'), getShipmentsForRoute);

// Manager views
router.get('/', authorizeRoles('manager'), listShipments);
router.get('/:id', getShipment); // both roles allowed; ownership checked inside controller

// Manager-only: create and delete
router.post('/', authorizeRoles('manager'), shipmentValidation, addShipment);
router.delete('/:id', authorizeRoles('manager'), removeShipment);

// Both managers and drivers can update status (ownership checked inside controller)
router.patch('/:id/status', changeShipmentStatus);

module.exports = router;