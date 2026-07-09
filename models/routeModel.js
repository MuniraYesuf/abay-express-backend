const pool = require('../config/db');

// Create a new route
async function createRoute(driverId, vehicleId, routeDate) {
  const result = await pool.query(
    `INSERT INTO routes (driver_id, vehicle_id, route_date)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [driverId, vehicleId, routeDate]
  );
  return result.rows[0];
}

// Get all routes, with driver and vehicle info joined in
async function getAllRoutes() {
  const result = await pool.query(`
    SELECT r.*, u.name AS driver_name, v.plate_number
    FROM routes r
    JOIN users u ON r.driver_id = u.id
    JOIN vehicles v ON r.vehicle_id = v.id
    ORDER BY r.id ASC
  `);
  return result.rows;
}

// Get a single route by id
async function getRouteById(id) {
  const result = await pool.query(`
    SELECT r.*, u.name AS driver_name, v.plate_number
    FROM routes r
    JOIN users u ON r.driver_id = u.id
    JOIN vehicles v ON r.vehicle_id = v.id
    WHERE r.id = $1
  `, [id]);
  return result.rows[0];
}

// Get all routes assigned to a specific driver (for the driver's own portal)
async function getRoutesByDriver(driverId) {
  const result = await pool.query(`
    SELECT r.*, v.plate_number
    FROM routes r
    JOIN vehicles v ON r.vehicle_id = v.id
    WHERE r.driver_id = $1
    ORDER BY r.route_date DESC
  `, [driverId]);
  return result.rows;
}

// Update route status (planned, active, completed)
async function updateRouteStatus(id, status) {
  const result = await pool.query(
    `UPDATE routes SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return result.rows[0];
}

// Delete a route
async function deleteRoute(id) {
  const result = await pool.query(`DELETE FROM routes WHERE id = $1 RETURNING *`, [id]);
  return result.rows[0];
}

module.exports = {
  createRoute,
  getAllRoutes,
  getRouteById,
  getRoutesByDriver,
  updateRouteStatus,
  deleteRoute
};