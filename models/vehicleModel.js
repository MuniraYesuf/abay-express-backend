const pool = require('../config/db');

// Create a new vehicle
async function createVehicle(plateNumber, capacityKg) {
  const result = await pool.query(
    `INSERT INTO vehicles (plate_number, capacity_kg)
     VALUES ($1, $2)
     RETURNING *`,
    [plateNumber, capacityKg]
  );
  return result.rows[0];
}

// Get all vehicles
async function getAllVehicles() {
  const result = await pool.query(`SELECT * FROM vehicles ORDER BY id ASC`);
  return result.rows;
}

// Get a single vehicle by id
async function getVehicleById(id) {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
  return result.rows[0];
}

// Update vehicle status (e.g., available, in_use, maintenance)
async function updateVehicleStatus(id, status) {
  const result = await pool.query(
    `UPDATE vehicles SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return result.rows[0];
}

// Delete a vehicle
async function deleteVehicle(id) {
  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1 RETURNING *`, [id]);
  return result.rows[0];
}

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicleStatus,
  deleteVehicle
};