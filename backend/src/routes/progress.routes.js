const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

router.use(authenticateToken, requireRole('candidate'));

router.get('/', progressController.getProgressData);

module.exports = router;
