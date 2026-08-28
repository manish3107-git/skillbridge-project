/**
 * SkillBridge GitHub REST API Service
 * Fetches public GitHub repositories and primary languages as supporting evidence.
 * Supports optional GITHUB_TOKEN for higher rate limits.
 */

const env = require('../../config/env');

class GitHubService {
  constructor() {
    this.token = env.GITHUB_TOKEN;
    this.baseUrl = 'https://api.github.com';
  }

  async getCandidateGitHubEvidence(username) {
    if (!username || typeof username !== 'string' || !username.trim()) {
      return { success: false, message: 'GitHub username is required.' };
    }

    const cleanUsername = username.trim().replace(/^@/, '');
    const url = `${this.baseUrl}/users/${cleanUsername}/repos?sort=updated&per_page=10`;

    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'SkillBridge-Career-Platform',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` })
    };

    try {
      const response = await fetch(url, { headers });

      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, message: `GitHub user "${cleanUsername}" not found.` };
        }
        return { success: false, message: `GitHub API returned status ${response.status}` };
      }

      const repos = await response.json();

      // Aggregate language distribution & project evidence
      const languageMap = {};
      const projectEvidence = [];

      repos.forEach(repo => {
        if (repo.language) {
          languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
        }

        projectEvidence.push({
          id: repo.id,
          name: repo.name,
          description: repo.description || 'No description provided.',
          language: repo.language || 'JavaScript',
          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,
          html_url: repo.html_url,
          updated_at: repo.updated_at
        });
      });

      const topLanguages = Object.entries(languageMap)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);

      return {
        success: true,
        username: cleanUsername,
        publicReposCount: repos.length,
        topLanguages,
        projects: projectEvidence,
        evidenceNote: 'GitHub repository data used as supporting evidence for candidate portfolio.'
      };
    } catch (error) {
      console.error('[GitHub Service Error]:', error.message);
      return {
        success: false,
        message: 'Failed to fetch GitHub evidence.',
        error: error.message
      };
    }
  }
}

module.exports = new GitHubService();
