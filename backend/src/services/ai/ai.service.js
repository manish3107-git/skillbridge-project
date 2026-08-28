const crypto = require('crypto');
const geminiProvider = require('./gemini.provider');
const groqProvider = require('./groq.provider');
const mockProvider = require('./mock.provider');

/**
 * SkillBridge AI Service Abstraction Layer
 * Orchestrates multi-provider LLM execution (Gemini Primary -> Groq Fallback -> Mock Engine),
 * input hashing & result caching, deterministic metric calculations, and JSON schema validation.
 */
class AIService {
  constructor() {
    this.gemini = geminiProvider;
    this.groq = groqProvider;
    this.mock = mockProvider;
    this.cache = new Map();
  }

  /**
   * Cost Optimization: Generate SHA-256 Hash of Inputs
   */
  _generateInputHash(prefix, data) {
    const jsonStr = JSON.stringify(data || {});
    return `${prefix}_${crypto.createHash('sha256').update(jsonStr).digest('hex')}`;
  }

  /**
   * Determine Provider Strategy & Execute with Fallback Handling
   */
  async _executeWithFallback(methodName, cachePrefix, inputData, ...args) {
    const cacheKey = this._generateInputHash(cachePrefix, inputData);

    // 1. Check Cost Optimization Cache
    if (this.cache.has(cacheKey)) {
      console.log(`[AI Service Cache Hit] Returning cached analysis for [${cachePrefix}]`);
      return this.cache.get(cacheKey);
    }

    let result = null;
    let activeProviderName = 'Mock Provider';

    // 2. Try Gemini Primary Provider
    if (this.gemini.isAvailable()) {
      try {
        console.log(`[AI Service] Executing Primary Gemini Provider for [${methodName}]`);
        result = await this._withTimeout(this.gemini[methodName](...args), 9000);
        activeProviderName = this.gemini.name;
      } catch (err) {
        console.warn(`[AI Service Gemini Error]: ${err.message}. Falling back...`);
      }
    }

    // 3. Try Groq Secondary Fallback Provider
    if (!result && this.groq.isAvailable()) {
      try {
        console.log(`[AI Service] Executing Secondary Groq Provider for [${methodName}]`);
        result = await this._withTimeout(this.groq[methodName](...args), 8000);
        activeProviderName = this.groq.name;
      } catch (err) {
        console.warn(`[AI Service Groq Error]: ${err.message}. Falling back to Mock...`);
      }
    }

    // 4. Try Mock Provider Fallback
    if (!result) {
      console.log(`[AI Service] Executing Mock Fallback Provider for [${methodName}]`);
      result = await this.mock[methodName](...args);
      activeProviderName = this.mock.name;
    }

    // Store in Cache
    if (result) {
      this.cache.set(cacheKey, result);
    }

    return result;
  }

  /**
   * Timeout Wrapper Guard
   */
  _withTimeout(promise, timeoutMs = 8000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`AI Request timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      promise
        .then(res => {
          clearTimeout(timer);
          resolve(res);
        })
        .catch(err => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }

  // --- CORE PUBLIC ABSTRACTION API METHODS ---

  async analyzeResume(resumeText, targetRole = 'Junior Frontend Developer', candidateSkills = []) {
    const rawResult = await this._executeWithFallback(
      'analyzeResume',
      'resume',
      { resumeText, targetRole },
      resumeText,
      targetRole,
      candidateSkills
    );

    // Calculate deterministic resume strength score
    const deterministicScore = this.calculateResumeMatchScore(resumeText, candidateSkills);
    return {
      ...rawResult,
      strengthScore: rawResult?.strengthScore || deterministicScore
    };
  }

  async analyzeJob(jobText, company = 'TechCorp', title = 'Junior Frontend Developer', candidateProfile = {}, candidateSkills = [], candidateProjects = []) {
    return await this._executeWithFallback(
      'analyzeJob',
      'job',
      { jobText, company, title, skillsCount: candidateSkills.length },
      jobText,
      company,
      title,
      candidateProfile,
      candidateSkills,
      candidateProjects
    );
  }

  async detectBottleneck(evidenceData = {}) {
    const rawAnalysis = await this._executeWithFallback(
      'detectBottleneck',
      'bottleneck',
      evidenceData,
      evidenceData
    );

    // Calculate deterministic breakdown metrics
    const metrics = this.calculateApplicationConversion(evidenceData.applications || []);
    return {
      ...rawAnalysis,
      metrics
    };
  }

  async generateRecommendation(bottleneckDiagnosis = {}) {
    return await this._executeWithFallback(
      'generateRecommendation',
      'recommendation',
      bottleneckDiagnosis,
      bottleneckDiagnosis
    );
  }

  async generateActionPlan(bottleneckDiagnosis = {}) {
    return this.generateRecommendation(bottleneckDiagnosis);
  }

  async generateInterview(targetRole = 'Junior Frontend Developer', interviewType = 'technical', difficulty = 'Medium') {
    return await this._executeWithFallback(
      'generateInterview',
      'interview_gen',
      { targetRole, interviewType, difficulty },
      targetRole,
      interviewType,
      difficulty
    );
  }

  async generateInterviewQuestions(targetRole, interviewType, difficulty) {
    return this.generateInterview(targetRole, interviewType, difficulty);
  }

  async evaluateInterview(qaPairs = [], targetRole = 'Junior Frontend Developer') {
    return await this._executeWithFallback(
      'evaluateInterview',
      'interview_eval',
      { qaPairs, targetRole },
      qaPairs,
      targetRole
    );
  }

  // --- DETERMINISTIC SCORING ENGINE (NO LLM CALCULATIONS FOR NUMERIC SCORES) ---

  calculateCareerReadinessScore(components = {}) {
    const technical = components.technicalScore || components.technical_score || 50;
    const project = components.projectScore || components.project_score || 50;
    const resume = components.resumeScore || components.resume_score || 50;
    const assessment = components.assessmentScore || components.assessment_score || 50;
    const interview = components.interviewScore || components.interview_score || 50;
    const communication = components.communicationScore || components.communication_score || 50;

    const weightedScore = Math.round(
      (technical * 0.30) +
      (project * 0.20) +
      (resume * 0.15) +
      (assessment * 0.15) +
      (interview * 0.10) +
      (communication * 0.10)
    );

    return Math.min(100, Math.max(0, weightedScore));
  }

  calculateResumeMatchScore(resumeText = '', candidateSkills = []) {
    const textUpper = (resumeText || '').toUpperCase();
    let score = 60;

    const keyTechs = ['REACT', 'JAVASCRIPT', 'HTML', 'CSS', 'REST API', 'GIT', 'TYPESCRIPT', 'NODE'];
    keyTechs.forEach(tech => {
      if (textUpper.includes(tech)) score += 4;
    });

    if (textUpper.includes('PROJECT') || textUpper.includes('EXPERIENCE')) score += 5;
    return Math.min(95, Math.max(40, score));
  }

  calculateApplicationConversion(applications = []) {
    const total = applications.length || 1;
    let technicalRejections = 0;
    let resumeRejections = 0;
    let assessmentRejections = 0;
    let offers = 0;

    applications.forEach(app => {
      if (app.rejection_stage === 'Technical Interview' || app.stage === 'Technical Interview') technicalRejections++;
      if (app.rejection_stage === 'Resume Screen') resumeRejections++;
      if (app.rejection_stage === 'Assessment') assessmentRejections++;
      if (app.result === 'Accepted') offers++;
    });

    return {
      totalApplications: total,
      technicalInterviewRejections: technicalRejections,
      resumeScreenRejections: resumeRejections,
      assessmentRejections: assessmentRejections,
      offersReceived: offers,
      interviewConversionRate: Math.round((offers / (technicalRejections + offers || 1)) * 100),
      overallConversionRate: Math.round((offers / total) * 100)
    };
  }

  calculateImprovementPercentage(beforeScore = 61, afterScore = 74) {
    const delta = afterScore - beforeScore;
    const pct = Math.round((delta / (beforeScore || 1)) * 100);
    return {
      beforeScore,
      afterScore,
      scoreGain: delta,
      percentageImprovement: `${pct}%`
    };
  }
}

module.exports = new AIService();
