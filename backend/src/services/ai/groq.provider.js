/**
 * SkillBridge Groq AI Provider (Secondary Fallback LLM Integration)
 * Utilizes Groq REST API for ultra-fast Llama-3/Mixtral fallback processing.
 */

const env = require('../../config/env');

class GroqAIProvider {
  constructor() {
    this.name = 'Groq LLM Fallback Provider';
    this.apiKey = env.GROQ_API_KEY;
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.model = 'llama-3.1-70b-versatile';
  }

  isAvailable() {
    return !!(this.apiKey && this.apiKey.trim().length > 0);
  }

  async _generateContent(prompt) {
    if (!this.isAvailable()) {
      throw new Error('Groq API Key is missing or invalid.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: 'You are an AI career intelligence engine. Return ONLY valid JSON.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Groq API returned HTTP status ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.choices[0].message.content;
      return JSON.parse(rawText.replace(/```json/gi, '').replace(/```/g, '').trim());
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  async analyzeResume(resumeText, targetRole, candidateSkills) {
    const mock = require('./mock.provider');
    if (!this.isAvailable()) return mock.analyzeResume(resumeText, targetRole, candidateSkills);
    const prompt = `Analyze resume for "${targetRole}". Return JSON matching {"strengthScore": 80, "detectedSections": [], "matchedKeywords": [], "missingKeywords": [], "improvementAreas": []}. Text: ${resumeText}`;
    try {
      return await this._generateContent(prompt);
    } catch {
      return mock.analyzeResume(resumeText, targetRole, candidateSkills);
    }
  }

  async analyzeJob(jobText, company, title, candidateProfile, candidateSkills, candidateProjects) {
    const mock = require('./mock.provider');
    if (!this.isAvailable()) return mock.analyzeJob(jobText, company, title, candidateProfile, candidateSkills, candidateProjects);
    const prompt = `Analyze job description for "${title}". Return JSON matching {"company": "${company}", "jobTitle": "${title}", "matchScore": 75, "strongMatches": [], "partialMatches": [], "missingSkills": [], "evidenceGaps": []}. Text: ${jobText}`;
    try {
      return await this._generateContent(prompt);
    } catch {
      return mock.analyzeJob(jobText, company, title, candidateProfile, candidateSkills, candidateProjects);
    }
  }

  async detectBottleneck(evidenceData) {
    const mock = require('./mock.provider');
    if (!this.isAvailable()) return mock.detectBottleneck(evidenceData);
    const prompt = `Detect career bottleneck. Return JSON matching {"primaryBottleneck": "TECHNICAL_INTERVIEW", "secondaryBottleneck": "PROBLEM_SOLVING", "confidence": 0.8, "explanation": "...", "evidence": [], "affectedAreas": [], "nextBestAction": {}}. Data: ${JSON.stringify(evidenceData)}`;
    try {
      return await this._generateContent(prompt);
    } catch {
      return mock.detectBottleneck(evidenceData);
    }
  }

  async generateRecommendation(bottleneckDiagnosis) {
    const mock = require('./mock.provider');
    return mock.generateRecommendation(bottleneckDiagnosis);
  }

  async generateInterview(targetRole, interviewType, difficulty) {
    const mock = require('./mock.provider');
    return mock.generateInterview(targetRole, interviewType, difficulty);
  }

  async evaluateInterview(qaPairs, targetRole) {
    const mock = require('./mock.provider');
    return mock.evaluateInterview(qaPairs, targetRole);
  }
}

module.exports = new GroqAIProvider();
