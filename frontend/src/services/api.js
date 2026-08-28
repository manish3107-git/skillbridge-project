/**
 * SkillBridge Central API Client Service
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('skillbridge_token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('skillbridge_token', token);
    } else {
      localStorage.removeItem('skillbridge_token');
    }
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const config = {
      ...options,
      headers,
      signal: controller.signal
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.warn(`[API Timeout ${endpoint}]: Request timed out.`);
        throw new Error('Network request timed out. Please check server status.');
      }
      console.error(`[API Error ${endpoint}]:`, error.message);
      throw error;
    }
  }

  // Auth Endpoints
  login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  getCurrentUser() {
    return this.request('/auth/me');
  }

  // Candidate Profile & Onboarding
  getCandidateProfile() {
    return this.request('/profile');
  }

  updateProfile(profileData) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  submitOnboarding(onboardingPayload) {
    return this.request('/profile/onboarding', {
      method: 'POST',
      body: JSON.stringify(onboardingPayload),
    });
  }

  getSkills() {
    return this.request('/profile/skills');
  }

  updateSkills(skills) {
    return this.request('/profile/skills', {
      method: 'PUT',
      body: JSON.stringify({ skills }),
    });
  }

  getProjects() {
    return this.request('/profile/projects');
  }

  saveProjects(projects) {
    return this.request('/profile/projects', {
      method: 'POST',
      body: JSON.stringify({ projects }),
    });
  }

  // Resume Intelligence APIs
  analyzeResume(bodyPayload) {
    const options = {
      method: 'POST',
      body: bodyPayload instanceof FormData ? bodyPayload : JSON.stringify(bodyPayload)
    };
    return this.request('/resumes/analyze', options);
  }

  getLatestResume() {
    return this.request('/resumes/latest');
  }

  // Target Job Analysis APIs
  analyzeJob(jobData) {
    return this.request('/jobs/analyze', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  }

  getLatestJob() {
    return this.request('/jobs/latest');
  }

  // Career Bottleneck Diagnosis APIs
  runDiagnosis() {
    return this.request('/diagnosis', {
      method: 'POST'
    });
  }

  getLatestDiagnosis() {
    return this.request('/diagnosis/latest');
  }

  // Next Best Action Plan APIs
  getLatestActionPlan() {
    return this.request('/action-plan/latest');
  }

  generateActionPlan() {
    return this.request('/action-plan/generate', {
      method: 'POST'
    });
  }

  updateActionItemStatus(itemId, completed) {
    return this.request('/action-plan/item', {
      method: 'PUT',
      body: JSON.stringify({ itemId, completed })
    });
  }

  // AI Mock Interview APIs
  generateInterview(setupData) {
    return this.request('/interviews/generate', {
      method: 'POST',
      body: JSON.stringify(setupData)
    });
  }

  evaluateInterview(payload) {
    return this.request('/interviews/evaluate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  getInterviewHistory() {
    return this.request('/interviews/history');
  }

  // Reassessment & Progress APIs
  getProgressData() {
    return this.request('/progress');
  }

  // Admin Profile & Stats
  getAdminProfile() {
    return this.request('/admin/profile');
  }

  getAdminStats() {
    return this.request('/admin/stats');
  }

  // Health Check
  getHealth() {
    return this.request('/health');
  }
}

export const api = new ApiClient();
export default api;
