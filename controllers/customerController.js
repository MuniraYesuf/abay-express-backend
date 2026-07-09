const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require('../models/customerModel');

// CREATE customer (manager only)
async function addCustomer(req, res) {
  try {
    const { name, address, phone } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: 'Name and address are required.' });
    }

    const customer = await createCustomer(name, address, phone || null);
    res.status(201).json({ message: 'Customer added successfully.', customer });
  } catch (err) {
    console.error('Add customer error:', err);
    res.status(500).json({ message: 'Server error while adding customer.' });
  }
}

// GET all customers
async function listCustomers(req, res) {
  try {
    const customers = await getAllCustomers();
    res.status(200).json({ customers });
  } catch (err) {
    console.error('List customers error:', err);
    res.status(500).json({ message: 'Server error while fetching customers.' });
  }
}

// GET single customer
async function getCustomer(req, res) {
  try {
    const customer = await getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    res.status(200).json({ customer });
  } catch (err) {
    console.error('Get customer error:', err);
    res.status(500).json({ message: 'Server error while fetching customer.' });
  }
}

// UPDATE customer (manager only)
async function editCustomer(req, res) {
  try {
    const { name, address, phone } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: 'Name and address are required.' });
    }

    const customer = await updateCustomer(req.params.id, name, address, phone || null);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    res.status(200).json({ message: 'Customer updated successfully.', customer });
  } catch (err) {
    console.error('Update customer error:', err);
    res.status(500).json({ message: 'Server error while updating customer.' });
  }
}

// DELETE customer (manager only)
async function removeCustomer(req, res) {
  try {
    const customer = await deleteCustomer(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    res.status(200).json({ message: 'Customer deleted successfully.' });
  } catch (err) {
    console.error('Delete customer error:', err);
    res.status(500).json({ message: 'Server error while deleting customer.' });
  }
}

module.exports = {
  addCustomer,
  listCustomers,
  getCustomer,
  editCustomer,
  removeCustomer
};