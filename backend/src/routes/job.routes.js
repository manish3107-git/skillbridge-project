const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

router.use(authenticateToken, requireRole('candidate'));

router.post('/analyze', jobController.analyzeJob);
router.get('/latest', jobController.getLatestJob);

module.exports = router;
