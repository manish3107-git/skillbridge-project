const express = require('express');
const multer = require('multer');
const router = express.Router();
const resumeController = require('../controllers/resume.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

// Memory storage for PDF uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.use(authenticateToken, requireRole('candidate'));

router.post('/analyze', upload.single('resume'), resumeController.analyzeResume);
router.get('/latest', resumeController.getLatestResume);

module.exports = router;
