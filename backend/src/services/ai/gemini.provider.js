/**
 * SkillBridge Google Gemini AI Provider (Primary LLM Integration)
 * Utilizes Google Gemini API (gemini-1.5-flash) for semantic reasoning, keyword extraction,
 * bottleneck diagnosis explanations, and mock interview evaluation.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../../config/env');

class GeminiAIProvider {
  constructor() {
    this.name = 'Google Gemini API Provider';
    this.apiKey = env.GEMINI_API_KEY;
    this.genAI = this.apiKey ? new GoogleGenerativeAI(this.apiKey) : null;
    this.modelName = 'gemini-1.5-flash';
  }

  isAvailable() {
    return !!(this.apiKey && this.genAI);
  }

  async _generateContent(prompt) {
    if (!this.isAvailable()) {
      throw new Error('Gemini API Key is missing or invalid.');
    }

    const model = this.genAI.getGenerativeModel({ model: this.modelName });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean JSON formatting markdown backticks if present
    const cleanedJsonStr = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedJsonStr);
  }

  async analyzeResume(resumeText, targetRole = 'Junior Frontend Developer', candidateSkills = []) {
    const prompt = `
You are a senior tech recruiter and resume intelligence parser. Analyze the following resume text for a candidate targeting the role "${targetRole}".
Return ONLY a valid JSON object matching this exact structure:
{
  "strengthScore": 85,
  "detectedSections": ["Skills", "Projects", "Education"],
  "matchedKeywords": ["REACT", "JAVASCRIPT"],
  "missingKeywords": ["TYPESCRIPT", "JEST"],
  "improvementAreas": ["Bullet point detail"]
}

Candidate Resume Text:
"""
${resumeText}
"""
    `;

    return await this._generateContent(prompt);
  }

  async analyzeJob(jobText, company = 'TechCorp', title = 'Junior Frontend Developer', candidateProfile = {}, candidateSkills = [], candidateProjects = []) {
    const prompt = `
You are an AI job match analyzer. Evaluate candidate alignment against target job requirements.
Return ONLY a valid JSON object matching this exact structure:
{
  "company": "${company}",
  "jobTitle": "${title}",
  "matchScore": 75,
  "strongMatches": [{"name": "React", "currentRating": 80, "targetRating": 80}],
  "partialMatches": [],
  "missingSkills": [{"name": "TypeScript", "currentRating": 0, "targetRating": 75}],
  "evidenceGaps": ["No automated testing projects"]
}

Job Description:
"""
${jobText}
"""
    `;

    return await this._generateContent(prompt);
  }

  async detectBottleneck(evidenceData = {}) {
    const prompt = `
You are an expert AI Career Bottleneck Detector. Analyze candidate evidence and return ONLY a valid JSON object matching this structure:
{
  "primaryBottleneck": "TECHNICAL_INTERVIEW",
  "secondaryBottleneck": "PROBLEM_SOLVING",
  "confidence": 0.85,
  "explanation": "High resume pass rate but zero technical interview offer conversions.",
  "evidence": ["7 technical interview rejections out of 15 applications"],
  "affectedAreas": ["Interview conversion rate"],
  "nextBestAction": {
    "title": "Complete Targeted Technical Mock Interview Simulation",
    "description": "Practice explaining code aloud.",
    "estimatedEffortMins": 45,
    "priority": "HIGH",
    "expectedImprovementArea": "Technical Interview Readiness"
  }
}

Evidence Input Data:
${JSON.stringify(evidenceData, null, 2)}
    `;

    return await this._generateContent(prompt);
  }

  async generateRecommendation(bottleneckDiagnosis = {}) {
    const prompt = `
Generate a 5-day targeted action plan tailored directly to the primary bottleneck "${bottleneckDiagnosis.primaryBottleneck || 'TECHNICAL_INTERVIEW'}".
Return ONLY a valid JSON object matching this structure:
{
  "primaryAction": {
    "id": "act_primary_1",
    "title": "Complete Targeted Technical Mock Interview Simulation",
    "description": "Focus on live coding explanation.",
    "priority": "HIGH",
    "estimatedEffort": "45 Mins",
    "reason": "Directly resolves interview conversion gap.",
    "expectedImprovementArea": "Technical Interview Readiness",
    "isCompleted": false
  },
  "secondaryActions": [{"id": "act_sub_1", "title": "Review Hook Lifecycles", "isCompleted": false}],
  "scheduleDays": [{"day": 1, "title": "Day 1: JS Event Loop", "task": "Study event loop", "completed": false}]
}
    `;

    return await this._generateContent(prompt);
  }

  async generateInterview(targetRole = 'Junior Frontend Developer', interviewType = 'technical', difficulty = 'Medium') {
    const prompt = `
Generate 3 technical interview questions for a "${targetRole}" position (${interviewType}, difficulty: ${difficulty}).
Return ONLY a valid JSON array matching this structure:
[
  {
    "id": 1,
    "question": "Explain the JS Event Loop",
    "category": "${interviewType}",
    "expectedCriteria": ["Call stack", "Microtasks"]
  }
]
    `;

    return await this._generateContent(prompt);
  }

  async evaluateInterview(qaPairs = [], targetRole = 'Junior Frontend Developer') {
    const prompt = `
Evaluate candidate technical interview answers for role "${targetRole}".
Return ONLY a valid JSON object matching this structure:
{
  "overallScore": 75,
  "technicalCorrectness": 76,
  "problemSolving": 72,
  "communication": 78,
  "clarity": 74,
  "feedback": [
    {
      "questionId": 1,
      "question": "Q1 text",
      "candidateAnswer": "Answer text",
      "score": 75,
      "strengths": "Clear explanation",
      "improvementAreas": "Add edge case detail"
    }
  ]
}

Question & Answer Input Pairs:
${JSON.stringify(qaPairs, null, 2)}
    `;

    return await this._generateContent(prompt);
  }
}

module.exports = new GeminiAIProvider();
