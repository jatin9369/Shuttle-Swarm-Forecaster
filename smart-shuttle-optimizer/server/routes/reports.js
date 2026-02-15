const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const auth = require('../middleware/auth'); // Assuming auth middleware exists

// @route   GET /api/reports/weekly
// @desc    Get weekly operational report
// @access  Private (Admin)
router.get('/weekly', auth, reportsController.getWeeklyReport);

// @route   GET /api/reports/analytics
// @desc    Get specific analytics data (occupancy, heatmap, etc.)
// @access  Private (Admin)
router.get('/analytics', auth, reportsController.getAnalytics);

// @route   GET /api/reports/sustainability
// @desc    Get eco-impact metrics
// @access  Private (Admin)
router.get('/sustainability', auth, reportsController.getSustainabilityMetrics);

module.exports = router;
