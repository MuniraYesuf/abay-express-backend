const pool = require('../config/db');

// Create a new shipment
async function createShipment(routeId, customerId, weightKg, dimensions) {
  const result = await pool.query(
    `INSERT INTO shipments (route_id, customer_id, weight_kg, dimensions)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [routeId, customerId, weightKg, dimensions]
  );
  return result.rows[0];
}

// Get all shipments, joined with customer and route info
async function getAllShipments() {
  const result = await pool.query(`
    SELECT s.*, c.name AS customer_name, c.address AS customer_address,
           r.route_date, r.status AS route_status
    FROM shipments s
    JOIN customers c ON s.customer_id = c.id
    JOIN routes r ON s.route_id = r.id
    ORDER BY s.id ASC
  `);
  return result.rows;
}

// Get single shipment by id
async function getShipmentById(id) {
  const result = await pool.query(`
    SELECT s.*, c.name AS customer_name, c.address AS customer_address,
           r.route_date, r.status AS route_status, r.driver_id
    FROM shipments s
    JOIN customers c ON s.customer_id = c.id
    JOIN routes r ON s.route_id = r.id
    WHERE s.id = $1
  `, [id]);
  return result.rows[0];
}

// Get all shipments belonging to a specific route
async function getShipmentsByRoute(routeId) {
  const result = await pool.query(`
    SELECT s.*, c.name AS customer_name, c.address AS customer_address
    FROM shipments s
    JOIN customers c ON s.customer_id = c.id
    WHERE s.route_id = $1
    ORDER BY s.id ASC
  `, [routeId]);
  return result.rows;
}

// Get all shipments assigned to the logged-in driver (via their routes)
async function getShipmentsByDriver(driverId) {
  const result = await pool.query(`
    SELECT s.*, c.name AS customer_name, c.address AS customer_address, r.route_date
    FROM shipments s
    JOIN routes r ON s.route_id = r.id
    JOIN customers c ON s.customer_id = c.id
    WHERE r.driver_id = $1
    ORDER BY s.id ASC
  `, [driverId]);
  return result.rows;
}

// Update shipment status
async function updateShipmentStatus(id, status) {
  const result = await pool.query(
    `UPDATE shipments SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return result.rows[0];
}

// Delete a shipment
async function deleteShipment(id) {
  const result = await pool.query(`DELETE FROM shipments WHERE id = $1 RETURNING *`, [id]);
  return result.rows[0];
}

module.exports = {
  createShipment,
  getAllShipments,
  getShipmentById,
  getShipmentsByRoute,
  getShipmentsByDriver,
  updateShipmentStatus,
  deleteShipment
};