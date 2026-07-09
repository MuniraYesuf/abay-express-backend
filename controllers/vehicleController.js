const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicleStatus,
  deleteVehicle
} = require('../models/vehicleModel');

// CREATE a vehicle (manager only)
async function addVehicle(req, res) {
  try {
    const { plateNumber, capacityKg } = req.body;

    if (!plateNumber || !capacityKg) {
      return res.status(400).json({ message: 'Plate number and capacity are required.' });
    }

    if (capacityKg <= 0) {
      return res.status(400).json({ message: 'Capacity must be a positive number.' });
    }

    const vehicle = await createVehicle(plateNumber, capacityKg);
    res.status(201).json({ message: 'Vehicle added successfully.', vehicle });
  } catch (err) {
    console.error('Add vehicle error:', err);
    // Handle duplicate plate number (unique constraint violation)
    if (err.code === '23505') {
      return res.status(409).json({ message: 'A vehicle with this plate number already exists.' });
    }
    res.status(500).json({ message: 'Server error while adding vehicle.' });
  }
}

// GET all vehicles (manager and driver can view)
async function listVehicles(req, res) {
  try {
    const vehicles = await getAllVehicles();
    res.status(200).json({ vehicles });
  } catch (err) {
    console.error('List vehicles error:', err);
    res.status(500).json({ message: 'Server error while fetching vehicles.' });
  }
}

// GET single vehicle
async function getVehicle(req, res) {
  try {
    const vehicle = await getVehicleById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }
    res.status(200).json({ vehicle });
  } catch (err) {
    console.error('Get vehicle error:', err);
    res.status(500).json({ message: 'Server error while fetching vehicle.' });
  }
}

// UPDATE vehicle status (manager only)
async function changeVehicleStatus(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = ['available', 'in_use', 'maintenance'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const vehicle = await updateVehicleStatus(req.params.id, status);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }
    res.status(200).json({ message: 'Vehicle status updated.', vehicle });
  } catch (err) {
    console.error('Update vehicle status error:', err);
    res.status(500).json({ message: 'Server error while updating vehicle.' });
  }
}

// DELETE vehicle (manager only)
async function removeVehicle(req, res) {
  try {
    const vehicle = await deleteVehicle(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }
    res.status(200).json({ message: 'Vehicle deleted successfully.' });
  } catch (err) {
    console.error('Delete vehicle error:', err);
    res.status(500).json({ message: 'Server error while deleting vehicle.' });
  }
}

module.exports = {
  addVehicle,
  listVehicles,
  getVehicle,
  changeVehicleStatus,
  removeVehicle
};