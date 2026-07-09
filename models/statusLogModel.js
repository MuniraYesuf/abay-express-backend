const pool = require('../config/db');

// Create a status log entry
async function createStatusLog(shipmentId, status, changedBy, notes) {
  const result = await pool.query(
    `INSERT INTO status_logs (shipment_id, status, changed_by, notes)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [shipmentId, status, changedBy, notes]
  );
  return result.rows[0];
}

// Get all status logs for a shipment, newest first, with the name of who changed it
async function getLogsByShipment(shipmentId) {
  const result = await pool.query(`
    SELECT sl.*, u.name AS changed_by_name
    FROM status_logs sl
    JOIN users u ON sl.changed_by = u.id
    WHERE sl.shipment_id = $1
    ORDER BY sl.changed_at DESC
  `, [shipmentId]);
  return result.rows;
}

module.exports = { createStatusLog, getLogsByShipment };