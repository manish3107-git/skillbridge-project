const express = require('express');
const router = express.Router();
const actionPlanController = require('../controllers/actionPlan.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

router.use(authenticateToken, requireRole('candidate'));

router.get('/latest', actionPlanController.getLatestActionPlan);
router.post('/generate', actionPlanController.generateActionPlan);
router.put('/item', actionPlanController.updateActionItem);

module.exports = router;
