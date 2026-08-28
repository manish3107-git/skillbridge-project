const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

// Candidate Protected Routes
router.use(authenticateToken, requireRole('candidate'));

router.get('/', profileController.getCandidateProfile);
router.put('/', profileController.updateCandidateProfile);

router.post('/onboarding', profileController.submitOnboarding);

router.get('/skills', profileController.getCandidateSkills);
router.put('/skills', profileController.updateCandidateSkills);

router.get('/projects', profileController.getCandidateProjects);
router.post('/projects', profileController.saveCandidateProjects);

// GitHub REST API Evidence Integration Route
router.get('/github/:username', profileController.getGitHubEvidence);

module.exports = router;
