const aiService = require('../services/ai/ai.service');
const db = require('../db/db.service');

// Run Career Bottleneck Diagnosis (POST /api/diagnosis)
const runDiagnosis = async (req, res, next) => {
  try {
    const candidateProfile = await db.getCandidateProfile(req.user.id);
    if (!candidateProfile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    const skills = await db.getCandidateSkills(candidateProfile.id);
    const projects = await db.getCandidateProjects(candidateProfile.id);
    const applications = await db.getCandidateApplications(candidateProfile.id);
    const latestResume = await db.getLatestResume(candidateProfile.id);
    const latestJob = await db.getLatestJob(candidateProfile.id);

    // Consolidate evidence from all candidate data sources
    const evidenceData = {
      applications,
      resumeScore: latestResume?.strength_score || candidateProfile.resume_score || 84,
      jobMatchScore: latestJob?.matchScore || 74,
      technicalScore: candidateProfile.technical_score || 78,
      assessmentScore: candidateProfile.assessment_score || 58,
      interviewScore: candidateProfile.interview_score || 47,
      communicationScore: candidateProfile.communication_score || 55,
      projectsCount: projects.length || 2,
      skillsCount: skills.length || 5
    };

    // Execute Bottleneck Detector Engine
    const diagnosisResult = await aiService.detectBottleneck(evidenceData);

    // Save Diagnosis into DB
    const savedRecord = await db.saveDiagnosisRecord(candidateProfile.id, diagnosisResult);

    res.status(200).json({
      success: true,
      message: 'Career bottleneck diagnosis executed successfully.',
      diagnosis: savedRecord
    });
  } catch (error) {
    next(error);
  }
};

// Get Latest Career Diagnosis (GET /api/diagnosis/latest)
const getLatestDiagnosis = async (req, res, next) => {
  try {
    const candidateProfile = await db.getCandidateProfile(req.user.id);
    if (!candidateProfile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    let latest = await db.getLatestDiagnosis(candidateProfile.id);

    // If no diagnosis executed yet, auto-run diagnosis for seamless user experience
    if (!latest) {
      const skills = await db.getCandidateSkills(candidateProfile.id);
      const projects = await db.getCandidateProjects(candidateProfile.id);
      const applications = await db.getCandidateApplications(candidateProfile.id);
      const latestResume = await db.getLatestResume(candidateProfile.id);
      const latestJob = await db.getLatestJob(candidateProfile.id);

      const evidenceData = {
        applications,
        resumeScore: latestResume?.strength_score || candidateProfile.resume_score || 84,
        jobMatchScore: latestJob?.matchScore || 74,
        technicalScore: candidateProfile.technical_score || 78,
        assessmentScore: candidateProfile.assessment_score || 58,
        interviewScore: candidateProfile.interview_score || 47,
        communicationScore: candidateProfile.communication_score || 55,
        projectsCount: projects.length || 2,
        skillsCount: skills.length || 5
      };

      const diagnosisResult = await aiService.detectBottleneck(evidenceData);
      latest = await db.saveDiagnosisRecord(candidateProfile.id, diagnosisResult);
    }

    res.status(200).json({
      success: true,
      diagnosis: latest
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  runDiagnosis,
  getLatestDiagnosis
};
