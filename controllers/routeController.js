const {
  createRoute,
  getAllRoutes,
  getRouteById,
  getRoutesByDriver,
  updateRouteStatus,
  deleteRoute
} = require('../models/routeModel');

// CREATE a route (manager only)
async function addRoute(req, res) {
  try {
    const { driverId, vehicleId, routeDate } = req.body;

    if (!driverId || !vehicleId || !routeDate) {
      return res.status(400).json({ message: 'Driver, vehicle, and route date are required.' });
    }

    const route = await createRoute(driverId, vehicleId, routeDate);
    res.status(201).json({ message: 'Route created successfully.', route });
  } catch (err) {
    console.error('Add route error:', err);
    // Foreign key violation (invalid driverId or vehicleId)
    if (err.code === '23503') {
      return res.status(400).json({ message: 'Invalid driver or vehicle ID.' });
    }
    res.status(500).json({ message: 'Server error while creating route.' });
  }
}

// GET all routes (manager sees everything)
async function listRoutes(req, res) {
  try {
    const routes = await getAllRoutes();
    res.status(200).json({ routes });
  } catch (err) {
    console.error('List routes error:', err);
    res.status(500).json({ message: 'Server error while fetching routes.' });
  }
}

// GET single route
async function getRoute(req, res) {
  try {
    const route = await getRouteById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found.' });
    }
    res.status(200).json({ route });
  } catch (err) {
    console.error('Get route error:', err);
    res.status(500).json({ message: 'Server error while fetching route.' });
  }
}

// GET routes for the currently logged-in driver ("my tasks" — driver portal)
async function getMyRoutes(req, res) {
  try {
    const routes = await getRoutesByDriver(req.user.id);
    res.status(200).json({ routes });
  } catch (err) {
    console.error('Get my routes error:', err);
    res.status(500).json({ message: 'Server error while fetching your routes.' });
  }
}

// UPDATE route status (manager only)
async function changeRouteStatus(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = ['planned', 'active', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const route = await updateRouteStatus(req.params.id, status);
    if (!route) {
      return res.status(404).json({ message: 'Route not found.' });
    }
    res.status(200).json({ message: 'Route status updated.', route });
  } catch (err) {
    console.error('Update route status error:', err);
    res.status(500).json({ message: 'Server error while updating route.' });
  }
}

// DELETE route (manager only)
async function removeRoute(req, res) {
  try {
    const route = await deleteRoute(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found.' });
    }
    res.status(200).json({ message: 'Route deleted successfully.' });
  } catch (err) {
    console.error('Delete route error:', err);
    res.status(500).json({ message: 'Server error while deleting route.' });
  }
}

module.exports = {
  addRoute,
  listRoutes,
  getRoute,
  getMyRoutes,
  changeRouteStatus,
  removeRoute
};