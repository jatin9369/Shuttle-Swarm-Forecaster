const express = require('express');
const router = express.Router();
const stopController = require('../controllers/stopController');

// @route   GET api/stops
// @desc    Get all stops
// @access  Public
router.get('/', stopController.getAllStops);

module.exports = router;
