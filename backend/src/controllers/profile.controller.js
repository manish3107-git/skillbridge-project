const db = require('../db/db.service');

// Get Candidate Profile
const getCandidateProfile = async (req, res, next) => {
  try {
    const profile = await db.getCandidateProfile(req.user.id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Candidate profile not found.'
      });
    }

    const skills = await db.getCandidateSkills(profile.id);
    const projects = await db.getCandidateProjects(profile.id);

    res.status(200).json({
      success: true,
      profile: {
        ...profile,
        skills,
        projects
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update Candidate Profile (PUT /api/profile)
const updateCandidateProfile = async (req, res, next) => {
  try {
    const profileUpdates = req.body;
    const updated = await db.updateCandidateProfile(req.user.id, profileUpdates);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      profile: updated
    });
  } catch (error) {
    next(error);
  }
};

// Submit Complete Onboarding Payload (POST /api/profile/onboarding)
const submitOnboarding = async (req, res, next) => {
  try {
    const { personalInfo = {}, skills = [], projects = [], targetRole = '', resumeInfo = {} } = req.body;

    const existingProfile = await db.getCandidateProfile(req.user.id);
    if (!existingProfile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    // 1. Save Skills & calculate avg technical rating
    const savedSkills = await db.saveCandidateSkills(existingProfile.id, skills);
    const techSkills = savedSkills.filter(s => s.category !== 'Soft Skill');
    const avgTechRating = techSkills.length > 0 
      ? Math.round(techSkills.reduce((acc, s) => acc + s.rating, 0) / techSkills.length)
      : 60;

    const softSkills = savedSkills.filter(s => s.category === 'Soft Skill');
    const avgCommRating = softSkills.length > 0
      ? Math.round(softSkills.reduce((acc, s) => acc + s.rating, 0) / softSkills.length)
      : 55;

    // 2. Save Projects & calculate project score based on count and details
    const savedProjects = await db.saveCandidateProjects(existingProfile.id, projects);
    const projectScore = Math.min(100, Math.max(40, 50 + (savedProjects.length * 12)));

    // 3. Calculate initial Career Readiness Score components
    const componentScores = db.calculateReadinessScore({
      technical_score: avgTechRating,
      project_score: projectScore,
      resume_score: resumeInfo.filename ? 80 : 65,
      assessment_score: existingProfile.assessment_score || 50,
      interview_score: existingProfile.interview_score || 45,
      communication_score: avgCommRating
    });

    // 4. Update Profile Record
    const updatedProfile = await db.updateCandidateProfile(req.user.id, {
      full_name: personalInfo.fullName || existingProfile.full_name,
      headline: personalInfo.headline || `${targetRole || 'Software'} Specialist`,
      education: personalInfo.education || existingProfile.education || 'Bachelor Degree',
      experience_level: personalInfo.experienceLevel || existingProfile.experience_level || 'Entry Level',
      location: personalInfo.location || existingProfile.location || 'Remote',
      target_role: targetRole || existingProfile.target_role || 'Junior Frontend Developer',
      onboarding_step: 6,
      ...componentScores
    });

    res.status(200).json({
      success: true,
      message: 'Onboarding completed successfully! Initial Career Readiness Score calculated.',
      profile: {
        ...updatedProfile,
        skills: savedSkills,
        projects: savedProjects
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Candidate Skills
const getCandidateSkills = async (req, res, next) => {
  try {
    const profile = await db.getCandidateProfile(req.user.id);
    if (!profile) return res.status(404).json({ success: false, message: 'Candidate profile not found.' });

    const skills = await db.getCandidateSkills(profile.id);
    res.status(200).json({ success: true, skills });
  } catch (error) {
    next(error);
  }
};

// Update Candidate Skills
const updateCandidateSkills = async (req, res, next) => {
  try {
    const profile = await db.getCandidateProfile(req.user.id);
    if (!profile) return res.status(404).json({ success: false, message: 'Candidate profile not found.' });

    const skills = req.body.skills || [];
    const saved = await db.saveCandidateSkills(profile.id, skills);

    res.status(200).json({ success: true, message: 'Skills updated.', skills: saved });
  } catch (error) {
    next(error);
  }
};

// Get Candidate Projects
const getCandidateProjects = async (req, res, next) => {
  try {
    const profile = await db.getCandidateProfile(req.user.id);
    if (!profile) return res.status(404).json({ success: false, message: 'Candidate profile not found.' });

    const projects = await db.getCandidateProjects(profile.id);
    res.status(200).json({ success: true, projects });
  } catch (error) {
    next(error);
  }
};

// Save Candidate Projects
const saveCandidateProjects = async (req, res, next) => {
  try {
    const profile = await db.getCandidateProfile(req.user.id);
    if (!profile) return res.status(404).json({ success: false, message: 'Candidate profile not found.' });

    const projects = req.body.projects || [];
    const saved = await db.saveCandidateProjects(profile.id, projects);

    res.status(200).json({ success: true, message: 'Projects saved.', projects: saved });
  } catch (error) {
    next(error);
  }
};

// Admin Profile
const getAdminProfile = async (req, res, next) => {
  try {
    const profile = await db.getOrganizationProfile(req.user.id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Organization profile not found.'
      });
    }
    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

// GitHub Evidence Integration (GET /api/profile/github/:username)
const getGitHubEvidence = async (req, res, next) => {
  try {
    const { username } = req.params;
    const githubService = require('../services/github/github.service');
    const result = await githubService.getCandidateGitHubEvidence(username);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCandidateProfile,
  updateCandidateProfile,
  submitOnboarding,
  getCandidateSkills,
  updateCandidateSkills,
  getCandidateProjects,
  saveCandidateProjects,
  getAdminProfile,
  getGitHubEvidence
};
