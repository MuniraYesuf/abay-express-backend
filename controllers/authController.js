const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');

// REGISTER
async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    // Basic presence check
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Only allow valid roles to be self-assigned at registration
    if (!['manager', 'driver'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either manager or driver.' });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    // Hash the password before storing
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create the user
    const newUser = await createUser(name, email, passwordHash, role);

    res.status(201).json({
      message: 'User registered successfully.',
      user: newUser
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
}

// LOGIN
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find the user
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare submitted password with stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
}

module.exports = { register, login };