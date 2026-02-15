const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// @route   GET api/auth/user
// @desc    Get logged in user
// @access  Private
router.get('/user', authMiddleware, authController.getUser);

// @route   GET api/auth/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', authMiddleware, authController.getAllUsers);

module.exports = router;
