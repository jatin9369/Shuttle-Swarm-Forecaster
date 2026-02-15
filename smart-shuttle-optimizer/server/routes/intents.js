const express = require('express');
const router = express.Router();
const intentController = require('../controllers/intentController');
const authMiddleware = require('../middleware/auth');
// Optional: middleware to check for admin role if needed, for simplicity using authMiddleware for now or public for submit

// @route   POST api/intents
// @desc    Submit a rider intent
// @access  Public (or semi-private if requiring login)
// We will allow public submission for QR codes, maybe track via deviceFingerprint
router.post('/', intentController.submitIntent);

// @route   GET api/intents
// @desc    Get all intents
// @access  Private (Admin/Driver mostly)
router.get('/', authMiddleware, intentController.getIntents);

module.exports = router;
