const express = require('express');
const router = express.Router();
const optimizerController = require('../controllers/optimizerController');

router.post('/run', optimizerController.runOptimizer);

module.exports = router;
