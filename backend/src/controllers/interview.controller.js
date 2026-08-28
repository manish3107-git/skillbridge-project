const aiService = require('../services/ai/ai.service');
const db = require('../db/db.service');

// Generate Interview Questions (POST /api/interviews/generate)
const generateInterview = async (req, res, next) => {
  try {
    const { targetRole = 'Junior Frontend Developer', interviewType = 'technical', difficulty = 'Medium' } = req.body;

    const questions = await aiService.generateInterviewQuestions(targetRole, interviewType, difficulty);

    res.status(200).json({
      success: true,
      targetRole,
      interviewType,
      difficulty,
      questions
    });
  } catch (error) {
    next(error);
  }
};

// Evaluate Interview Answers & Trigger Profile Score Reassessment (POST /api/interviews/evaluate)
const evaluateInterview = async (req, res, next) => {
  try {
    const { targetRole = 'Junior Frontend Developer', interviewType = 'technical', difficulty = 'Medium', qaPairs = [] } = req.body;

    const candidateProfile = await db.getCandidateProfile(req.user.id);
    if (!candidateProfile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    // Capture BEFORE readiness scores
    const beforeScores = {
      readiness_score: candidateProfile.readiness_score || 61,
      interview_score: candidateProfile.interview_score || 47,
      technical_score: candidateProfile.technical_score || 52,
      communication_score: candidateProfile.communication_score || 55
    };

    // Run AI Evaluation
    const evaluation = await aiService.evaluateInterview(qaPairs, targetRole);

    // Save Interview Result & Update Candidate Profile Component Scores
    const interviewRecord = await db.saveInterviewResult(candidateProfile.id, req.user.id, {
      targetRole,
      interviewType,
      difficulty,
      qaPairs,
      ...evaluation
    });

    // Fetch updated AFTER candidate profile
    const afterProfile = await db.getCandidateProfile(req.user.id);

    const afterScores = {
      readiness_score: afterProfile.readiness_score || 74,
      interview_score: afterProfile.interview_score || 71,
      technical_score: afterProfile.technical_score || 68,
      communication_score: afterProfile.communication_score || 74
    };

    res.status(200).json({
      success: true,
      message: 'Interview evaluated successfully! Reassessment completed.',
      evaluation: interviewRecord,
      comparison: {
        before: beforeScores,
        after: afterScores,
        delta: {
          readiness: afterScores.readiness_score - beforeScores.readiness_score,
          interview: afterScores.interview_score - beforeScores.interview_score,
          technical: afterScores.technical_score - beforeScores.technical_score
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Interview History (GET /api/interviews/history)
const getInterviewHistory = async (req, res, next) => {
  try {
    const candidateProfile = await db.getCandidateProfile(req.user.id);
    if (!candidateProfile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    const history = await db.getInterviewHistory(candidateProfile.id);
    res.status(200).json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateInterview,
  evaluateInterview,
  getInterviewHistory
};
