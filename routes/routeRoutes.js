const express = require('express');
const router = express.Router();
const {
  addRoute,
  listRoutes,
  getRoute,
  getMyRoutes,
  changeRouteStatus,
  removeRoute
} = require('../controllers/routeController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// All route endpoints require a valid token
router.use(verifyToken);

// Driver's own routes ("my tasks") — must come before /:id to avoid route conflicts
router.get('/mine', authorizeRoles('driver'), getMyRoutes);

// Manager views
router.get('/', authorizeRoles('manager'), listRoutes);
router.get('/:id', authorizeRoles('manager'), getRoute);

// Manager-only actions
router.post('/', authorizeRoles('manager'), addRoute);
router.patch('/:id/status', authorizeRoles('manager'), changeRouteStatus);
router.delete('/:id', authorizeRoles('manager'), removeRoute);

module.exports = router;