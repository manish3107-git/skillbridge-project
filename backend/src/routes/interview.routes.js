const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interview.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

router.use(authenticateToken, requireRole('candidate'));

router.post('/generate', interviewController.generateInterview);
router.post('/evaluate', interviewController.evaluateInterview);
router.get('/history', interviewController.getInterviewHistory);

module.exports = router;
