const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

router.use(authenticateToken, requireRole('admin'));

router.get('/profile', adminController.getAdminProfile);
router.get('/stats', adminController.getAdminStats);

module.exports = router;
