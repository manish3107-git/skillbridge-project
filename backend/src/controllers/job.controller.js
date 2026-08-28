const jobService = require('../services/jobs/job.service');
const db = require('../db/db.service');

// Analyze Target Job Description (POST /api/jobs/analyze)
const analyzeJob = async (req, res, next) => {
  try {
    const { company = 'TechCorp', title = 'Junior Frontend Developer', jobDescription = '', descriptionText = '' } = req.body;
    const textToAnalyze = jobDescription || descriptionText || 'Seeking Junior Frontend Developer with React, JavaScript, and HTML/CSS skills.';

    const candidateProfile = await db.getCandidateProfile(req.user.id);
    if (!candidateProfile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    const candidateSkills = await db.getCandidateSkills(candidateProfile.id);
    const candidateProjects = await db.getCandidateProjects(candidateProfile.id);

    // Call Job Service to compare profile skills against job requirements
    const analysis = await jobService.analyzeJobDescription({
      jobText: textToAnalyze,
      company,
      title,
      candidateProfile,
      candidateSkills,
      candidateProjects
    });

    // Save Job Analysis Record into DB
    const savedRecord = await db.saveJobAnalysis(candidateProfile.id, analysis);

    res.status(200).json({
      success: true,
      message: 'Target job description analyzed and compared successfully.',
      matchScore: analysis.matchScore,
      analysis: savedRecord
    });
  } catch (error) {
    next(error);
  }
};

// Get Latest Target Job Analysis (GET /api/jobs/latest)
const getLatestJob = async (req, res, next) => {
  try {
    const candidateProfile = await db.getCandidateProfile(req.user.id);
    if (!candidateProfile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    const latest = await db.getLatestJob(candidateProfile.id);
    res.status(200).json({
      success: true,
      job: latest
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeJob,
  getLatestJob
};
