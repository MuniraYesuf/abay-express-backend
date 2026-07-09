const pool = require('../config/db');

// Create a new customer
async function createCustomer(name, address, phone) {
  const result = await pool.query(
    `INSERT INTO customers (name, address, phone)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, address, phone]
  );
  return result.rows[0];
}

// Get all customers
async function getAllCustomers() {
  const result = await pool.query(`SELECT * FROM customers ORDER BY id ASC`);
  return result.rows;
}

// Get single customer by id
async function getCustomerById(id) {
  const result = await pool.query(`SELECT * FROM customers WHERE id = $1`, [id]);
  return result.rows[0];
}

// Update customer info
async function updateCustomer(id, name, address, phone) {
  const result = await pool.query(
    `UPDATE customers SET name = $1, address = $2, phone = $3 WHERE id = $4 RETURNING *`,
    [name, address, phone, id]
  );
  return result.rows[0];
}

// Delete customer
async function deleteCustomer(id) {
  const result = await pool.query(`DELETE FROM customers WHERE id = $1 RETURNING *`, [id]);
  return result.rows[0];
}

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};