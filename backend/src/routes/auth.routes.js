const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Public Auth Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected Session Route
router.get('/me', authenticateToken, authController.getCurrentUser);

module.exports = router;
