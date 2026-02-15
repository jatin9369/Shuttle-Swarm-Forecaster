const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const authMiddleware = require('../middleware/auth');

// @route   GET api/routes
// @desc    Get all routes
// @access  Private (Admin/Driver)
router.get('/', authMiddleware, routeController.getRoutes);

// @route   POST api/routes/optimize
// @desc    Trigger optimization
// @access  Private (Admin)
router.post('/optimize', authMiddleware, routeController.triggerOptimization);

// @route   POST api/routes/assign
// @desc    Assign driver
// @access  Private (Admin)
// @route   POST api/routes/assign
// @desc    Assign driver
// @access  Private (Admin)
router.post('/assign', authMiddleware, routeController.assignDriver);

// @route   POST api/routes/emergency
// @desc    Trigger emergency reroute
// @access  Private (Admin)
router.post('/emergency', authMiddleware, routeController.triggerEmergency);

module.exports = router;
