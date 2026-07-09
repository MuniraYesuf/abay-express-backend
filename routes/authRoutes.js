const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

// Test route: only accessible by logged-in managers
router.get('/manager-only', verifyToken, authorizeRoles('manager'), (req, res) => {
  res.json({ message: `Welcome, manager! Your user ID is ${req.user.id}` });
});

module.exports = router;