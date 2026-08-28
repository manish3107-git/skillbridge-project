const aiService = require('../ai/ai.service');

/**
 * SkillBridge Job Service Abstraction Layer
 * Handles target job description processing and provides a extensible interface
 * for future external job board APIs (e.g. Indeed, Adzuna, LinkedIn) without breaking manual input.
 */
class JobService {
  constructor() {
    this.name = 'SkillBridge Central Job Service';
  }

  async analyzeJobDescription({ jobText, company = 'TechCorp', title = 'Junior Frontend Developer', candidateProfile = {}, candidateSkills = [], candidateProjects = [] }) {
    if (!jobText || typeof jobText !== 'string' || !jobText.trim()) {
      throw new Error('Job description text is required.');
    }

    return await aiService.analyzeJob(jobText, company, title, candidateProfile, candidateSkills, candidateProjects);
  }

  /**
   * Future Extensibility Hook for External Job Board Search
   */
  async searchExternalJobs(query = '', location = 'Remote') {
    return {
      success: true,
      message: 'Manual job description mode active. External Job API integration ready for future hook.',
      jobs: [
        {
          id: 'job_ext_1',
          company: 'TechCorp Solutions',
          title: query || 'Junior Frontend Developer',
          location: location || 'Remote',
          description: 'React, ES6+, REST APIs, HTML/CSS experience required.'
        }
      ]
    };
  }
}

module.exports = new JobService();
