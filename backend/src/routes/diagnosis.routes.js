const express = require('express');
const router = express.Router();
const diagnosisController = require('../controllers/diagnosis.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

router.use(authenticateToken, requireRole('candidate'));

router.post('/', diagnosisController.runDiagnosis);
router.get('/latest', diagnosisController.getLatestDiagnosis);

module.exports = router;
