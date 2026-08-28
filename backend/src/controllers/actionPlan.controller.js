const aiService = require('../services/ai/ai.service');
const db = require('../db/db.service');

// Get Latest Candidate Action Plan (GET /api/action-plan/latest)
const getLatestActionPlan = async (req, res, next) => {
  try {
    const candidateProfile = await db.getCandidateProfile(req.user.id);
    if (!candidateProfile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    let plan = await db.getLatestActionPlan(candidateProfile.id);

    // Auto-generate if no action plan exists yet
    if (!plan) {
      let diagnosis = await db.getLatestDiagnosis(candidateProfile.id);
      if (!diagnosis) {
        const apps = await db.getCandidateApplications(candidateProfile.id);
        const diagnosisResult = await aiService.detectBottleneck({ applications: apps });
        diagnosis = await db.saveDiagnosisRecord(candidateProfile.id, diagnosisResult);
      }

      const actionPlanData = await aiService.generateActionPlan(diagnosis);
      plan = await db.saveActionPlanRecord(candidateProfile.id, actionPlanData);
    }

    res.status(200).json({
      success: true,
      actionPlan: plan
    });
  } catch (error) {
    next(error);
  }
};

// Generate Fresh Action Plan (POST /api/action-plan/generate)
const generateActionPlan = async (req, res, next) => {
  try {
    const candidateProfile = await db.getCandidateProfile(req.user.id);
    if (!candidateProfile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    let diagnosis = await db.getLatestDiagnosis(candidateProfile.id);
    if (!diagnosis) {
      const apps = await db.getCandidateApplications(candidateProfile.id);
      const diagnosisResult = await aiService.detectBottleneck({ applications: apps });
      diagnosis = await db.saveDiagnosisRecord(candidateProfile.id, diagnosisResult);
    }

    const actionPlanData = await aiService.generateActionPlan(diagnosis);
    const plan = await db.saveActionPlanRecord(candidateProfile.id, actionPlanData);

    res.status(200).json({
      success: true,
      message: 'Action plan generated successfully.',
      actionPlan: plan
    });
  } catch (error) {
    next(error);
  }
};

// Update Action Item Completion Status (PUT /api/action-plan/item)
const updateActionItem = async (req, res, next) => {
  try {
    const { itemId, completed } = req.body;

    const candidateProfile = await db.getCandidateProfile(req.user.id);
    if (!candidateProfile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    const updatedPlan = await db.updateActionItemStatus(candidateProfile.id, itemId, completed);

    res.status(200).json({
      success: true,
      message: 'Action plan item status updated.',
      actionPlan: updatedPlan
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLatestActionPlan,
  generateActionPlan,
  updateActionItem
};
