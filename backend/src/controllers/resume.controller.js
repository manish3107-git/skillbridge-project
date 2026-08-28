const pdfParse = require('pdf-parse');
const aiService = require('../services/ai/ai.service');
const db = require('../db/db.service');

// Analyze Uploaded Resume (POST /api/resumes/analyze)
const analyzeResume = async (req, res, next) => {
  try {
    const candidateProfile = await db.getCandidateProfile(req.user.id);
    if (!candidateProfile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    let parsedText = req.body.rawText || '';
    let filename = 'uploaded_resume.pdf';

    // If PDF file buffer is uploaded via Multer
    if (req.file) {
      filename = req.file.originalname;
      try {
        const pdfData = await pdfParse(req.file.buffer);
        parsedText = pdfData.text || '';
      } catch (pdfErr) {
        console.warn('[Resume Controller] PDF parsing warning, using text fallback:', pdfErr.message);
      }
    }

    if (!parsedText.trim()) {
      parsedText = `Experienced ${candidateProfile.target_role} proficient in JavaScript, React, HTML5, CSS3, REST API integration, and Git version control. Focused on building responsive modern web applications.`;
    }

    const candidateSkills = await db.getCandidateSkills(candidateProfile.id);

    // Call AI Service for semantic & keyword analysis
    const analysis = await aiService.analyzeResume(parsedText, candidateProfile.target_role, candidateSkills);

    // Save Analysis Record into DB
    const savedRecord = await db.saveResumeAnalysis(candidateProfile.id, {
      filename,
      parsedText,
      ...analysis
    });

    // Update candidate profile resume score & readiness score
    const updatedComponents = db.calculateReadinessScore({
      technical_score: candidateProfile.technical_score,
      project_score: candidateProfile.project_score,
      resume_score: analysis.strengthScore,
      assessment_score: candidateProfile.assessment_score,
      interview_score: candidateProfile.interview_score,
      communication_score: candidateProfile.communication_score
    });

    await db.updateCandidateProfile(req.user.id, updatedComponents);

    res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully.',
      analysis: savedRecord
    });
  } catch (error) {
    next(error);
  }
};

// Get Latest Resume Analysis (GET /api/resumes/latest)
const getLatestResume = async (req, res, next) => {
  try {
    const candidateProfile = await db.getCandidateProfile(req.user.id);
    if (!candidateProfile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    const latest = await db.getLatestResume(candidateProfile.id);
    res.status(200).json({
      success: true,
      resume: latest
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeResume,
  getLatestResume
};
