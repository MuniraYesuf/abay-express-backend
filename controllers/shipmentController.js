const {
  createShipment,
  getAllShipments,
  getShipmentById,
  getShipmentsByRoute,
  getShipmentsByDriver,
  updateShipmentStatus,
  deleteShipment
} = require('../models/shipmentModel');
const { createStatusLog, getLogsByShipment } = require('../models/statusLogModel');

// Defines which status transitions are allowed, in order
const STATUS_FLOW = ['pending', 'assigned', 'in_transit', 'delivered'];

// CREATE a shipment (manager only)
async function addShipment(req, res) {
  try {
    const { routeId, customerId, weightKg, dimensions } = req.body;

    if (!routeId || !customerId || !weightKg) {
      return res.status(400).json({ message: 'Route, customer, and weight are required.' });
    }

    if (weightKg <= 0) {
      return res.status(400).json({ message: 'Weight must be a positive number.' });
    }

    const shipment = await createShipment(routeId, customerId, weightKg, dimensions || null);

    // Log the initial status
    await createStatusLog(shipment.id, shipment.status, req.user.id, 'Shipment created.');

    res.status(201).json({ message: 'Shipment created successfully.', shipment });
  } catch (err) {
    console.error('Add shipment error:', err);
    if (err.code === '23503') {
      return res.status(400).json({ message: 'Invalid route or customer ID.' });
    }
    res.status(500).json({ message: 'Server error while creating shipment.' });
  }
}

// GET all shipments (manager)
async function listShipments(req, res) {
  try {
    const shipments = await getAllShipments();
    res.status(200).json({ shipments });
  } catch (err) {
    console.error('List shipments error:', err);
    res.status(500).json({ message: 'Server error while fetching shipments.' });
  }
}

// GET single shipment, with its status history
async function getShipment(req, res) {
  try {
    const shipment = await getShipmentById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found.' });
    }

    // If the requester is a driver, make sure this shipment actually belongs to them
    if (req.user.role === 'driver' && shipment.driver_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not have access to this shipment.' });
    }

    const history = await getLogsByShipment(shipment.id);
    res.status(200).json({ shipment, history });
  } catch (err) {
    console.error('Get shipment error:', err);
    res.status(500).json({ message: 'Server error while fetching shipment.' });
  }
}

// GET shipments for a specific route (manager)
async function getShipmentsForRoute(req, res) {
  try {
    const shipments = await getShipmentsByRoute(req.params.routeId);
    res.status(200).json({ shipments });
  } catch (err) {
    console.error('Get shipments for route error:', err);
    res.status(500).json({ message: 'Server error while fetching shipments.' });
  }
}

// GET "my deliveries" for the logged-in driver
async function getMyShipments(req, res) {
  try {
    const shipments = await getShipmentsByDriver(req.user.id);
    res.status(200).json({ shipments });
  } catch (err) {
    console.error('Get my shipments error:', err);
    res.status(500).json({ message: 'Server error while fetching your shipments.' });
  }
}

// UPDATE shipment status — used by BOTH managers and drivers, with transition validation
async function changeShipmentStatus(req, res) {
  try {
    const { status, notes } = req.body;

    if (!STATUS_FLOW.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${STATUS_FLOW.join(', ')}` });
    }

    const shipment = await getShipmentById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found.' });
    }

    // If driver, confirm this shipment belongs to one of their routes
    if (req.user.role === 'driver' && shipment.driver_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not have access to this shipment.' });
    }

    // Enforce valid status transitions: no skipping steps, no going backward
    const currentIndex = STATUS_FLOW.indexOf(shipment.status);
    const newIndex = STATUS_FLOW.indexOf(status);

    if (newIndex !== currentIndex + 1) {
      return res.status(400).json({
        message: `Invalid status transition from "${shipment.status}" to "${status}". Must proceed in order: ${STATUS_FLOW.join(' -> ')}.`
      });
    }

    const updated = await updateShipmentStatus(req.params.id, status);
    await createStatusLog(updated.id, status, req.user.id, notes || null);

    res.status(200).json({ message: 'Shipment status updated.', shipment: updated });
  } catch (err) {
    console.error('Update shipment status error:', err);
    res.status(500).json({ message: 'Server error while updating shipment.' });
  }
}

// DELETE shipment (manager only)
async function removeShipment(req, res) {
  try {
    const shipment = await deleteShipment(req.params.id);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found.' });
    }
    res.status(200).json({ message: 'Shipment deleted successfully.' });
  } catch (err) {
    console.error('Delete shipment error:', err);
    res.status(500).json({ message: 'Server error while deleting shipment.' });
  }
}

module.exports = {
  addShipment,
  listShipments,
  getShipment,
  getShipmentsForRoute,
  getMyShipments,
  changeShipmentStatus,
  removeShipment
};