const { body, validationResult } = require('express-validator');

// Reusable function to check validation results and respond with errors if any
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed.',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
}

// Validation rules for registration
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  body('role').isIn(['manager', 'driver']).withMessage('Role must be either manager or driver.'),
  handleValidationErrors
];

// Validation rules for login
const loginValidation = [
  body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
  handleValidationErrors
];

// Validation rules for creating a shipment
const shipmentValidation = [
  body('routeId').isInt({ min: 1 }).withMessage('A valid route ID is required.'),
  body('customerId').isInt({ min: 1 }).withMessage('A valid customer ID is required.'),
  body('weightKg').isFloat({ min: 0.1, max: 50000 }).withMessage('Weight must be between 0.1 and 50000 kg.'),
  body('dimensions').optional().trim().isLength({ max: 50 }).withMessage('Dimensions must be under 50 characters.'),
  handleValidationErrors
];

module.exports = { registerValidation, loginValidation, shipmentValidation };