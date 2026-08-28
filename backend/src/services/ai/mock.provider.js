/**
 * SkillBridge Mock AI Provider
 * Deterministic, reliable fallback provider used when no LLM keys are configured or when APIs time out.
 * Returns clean, schema-validated JSON results without external network calls.
 */

class MockAIProvider {
  constructor() {
    this.name = 'Mock AI Provider';
  }

  async analyzeResume(resumeText, targetRole = 'Junior Frontend Developer', candidateSkills = []) {
    return {
      strengthScore: 84,
      detectedSections: ['Skills', 'Projects', 'Education', 'Experience'],
      matchedKeywords: ['REACT', 'JAVASCRIPT', 'HTML', 'CSS', 'REST API', 'GIT'],
      missingKeywords: ['TYPESCRIPT', 'JEST', 'REDUX'],
      improvementAreas: [
        'Add measurable project outcomes (e.g., "Improved load speed by 35%")',
        'Incorporate TypeScript keywords for Junior Frontend Developer role'
      ]
    };
  }

  async analyzeJob(jobText, company = 'TechCorp Solutions', title = 'Junior Frontend Developer', candidateProfile = {}, candidateSkills = [], candidateProjects = []) {
    return {
      company: company || 'TechCorp Solutions',
      jobTitle: title || 'Junior Frontend Developer',
      matchScore: 74,
      strongMatches: [
        { name: 'React', currentRating: 81, targetRating: 80 },
        { name: 'JavaScript (ES6+)', currentRating: 78, targetRating: 85 }
      ],
      partialMatches: [
        { name: 'REST APIs', currentRating: 65, targetRating: 75 }
      ],
      missingSkills: [
        { name: 'TypeScript', currentRating: 0, targetRating: 75 },
        { name: 'Automated Testing (Jest)', currentRating: 0, targetRating: 70 }
      ],
      evidenceGaps: [
        'No TypeScript projects found in candidate portfolio',
        'No automated unit testing evidence present in project descriptions'
      ]
    };
  }

  async detectBottleneck(evidenceData = {}) {
    const { applications = [], resumeScore = 84, interviewScore = 47, assessmentScore = 58 } = evidenceData;
    let techInterviewRejections = 0;
    applications.forEach(app => {
      if (app.rejection_stage === 'Technical Interview' || app.stage === 'Technical Interview') techInterviewRejections++;
    });

    const totalApplications = applications.length || 15;

    return {
      primaryBottleneck: 'TECHNICAL_INTERVIEW',
      secondaryBottleneck: 'PROBLEM_SOLVING',
      confidence: 0.82,
      explanation: `Candidate has high resume alignment (${resumeScore}/100) and consistently reaches technical interviews (${techInterviewRejections} out of ${totalApplications} applications), but converts 0 into job offers due to technical interview readiness and live coding explanation gaps.`,
      evidence: [
        `Reached technical interview stage in ${techInterviewRejections} applications with 0 offer conversions`,
        `Technical interview readiness score: ${interviewScore}/100`,
        `Standardized coding assessment score: ${assessmentScore}/100`,
        `High resume alignment score: ${resumeScore}/100 (Resume successfully converts early screening)`
      ],
      affectedAreas: [
        'Technical Interview Conversion Rate',
        'Live Coding Explanation Aloud',
        'Data Structures & Algorithm Interview Questions'
      ],
      nextBestAction: {
        title: 'Complete Targeted Technical Mock Interview Simulation',
        description: 'Focus on JavaScript ES6+ fundamentals, asynchronous event loop questions, and live coding explanation aloud.',
        estimatedEffortMins: 45,
        priority: 'HIGH',
        expectedImprovementArea: 'Technical Interview Readiness'
      }
    };
  }

  async generateRecommendation(bottleneckDiagnosis = {}) {
    const primary = bottleneckDiagnosis.primaryBottleneck || 'TECHNICAL_INTERVIEW';

    if (primary === 'TECHNICAL_INTERVIEW') {
      return {
        primaryAction: {
          id: 'act_primary_1',
          title: 'Complete Targeted Technical Mock Interview Simulation',
          description: 'Focus on JavaScript ES6+ fundamentals, DOM manipulation, asynchronous event loop scheduling, and explaining live code aloud.',
          priority: 'HIGH',
          estimatedEffort: '45 Mins',
          reason: 'You reached technical interviews in 7 applications but converted none to an offer. Practicing live verbal explanation directly resolves this bottleneck.',
          expectedImprovementArea: 'Technical Interview Readiness (Target +25 pts)',
          isCompleted: false
        },
        secondaryActions: [
          { id: 'act_sub_1', title: 'Review Top 10 React Hook Lifecycle Interview Questions', isCompleted: true },
          { id: 'act_sub_2', title: 'Practice Explaining Code Aloud while Typing Solution', isCompleted: false },
          { id: 'act_sub_3', title: 'Complete 5 Live Data Structure & Async JavaScript Exercises', isCompleted: false }
        ],
        scheduleDays: [
          { day: 1, title: 'Day 1: JavaScript Event Loop & Microtasks Deep-Dive', task: 'Study microtask priority, Promise resolution order, and event loop call stack execution.', completed: true },
          { day: 2, title: 'Day 2: React State & Immutability Live Coding Practice', task: 'Solve 3 React state reducer problems while explaining your thought process out loud.', completed: false },
          { day: 3, title: 'Day 3: AI Technical Mock Interview Simulation', task: 'Execute full 45-minute interactive AI technical mock interview.', completed: false },
          { day: 4, title: 'Day 4: Review Weak Answer Feedback & Refine Explanations', task: 'Analyze feedback report from Day 3 mock interview and rewrite weak answers.', completed: false },
          { day: 5, title: 'Day 5: Reassessment Mock Interview & Readiness Benchmark', task: 'Complete final mock interview reassessment to verify score improvement.', completed: false }
        ]
      };
    } else if (primary === 'RESUME_GAP') {
      return {
        primaryAction: {
          id: 'act_primary_2',
          title: 'Incorporate Quantifiable Outcome Metrics & Missing Keywords',
          description: 'Rewrite bullet points in your top 2 projects to include percentage improvements and add TypeScript/testing keywords.',
          priority: 'HIGH',
          estimatedEffort: '30 Mins',
          reason: 'Early resume screening rejections indicate missing role keywords for Junior Frontend Developer.',
          expectedImprovementArea: 'Resume Strength Score (Target +20 pts)',
          isCompleted: false
        },
        secondaryActions: [
          { id: 'act_sub_4', title: 'Add GitHub Repo & Live Demo Links for All Projects', isCompleted: false },
          { id: 'act_sub_5', title: 'Re-scan Resume via SkillBridge Resume Intelligence', isCompleted: false }
        ],
        scheduleDays: [
          { day: 1, title: 'Day 1: Audit Project Bullet Points for Quantifiable Metrics', task: 'Add metrics to DevBoard project.', completed: false },
          { day: 2, title: 'Day 2: Integrate Missing TypeScript & Jest Keywords', task: 'Add TypeScript skill section.', completed: false },
          { day: 3, title: 'Day 3: Re-upload Resume & Verify 80+ Strength Score', task: 'Upload updated PDF resume to SkillBridge.', completed: false }
        ]
      };
    } else {
      return {
        primaryAction: {
          id: 'act_primary_3',
          title: 'Complete 15 Role-Specific Coding Problems',
          description: 'Practice array manipulation, string search, and hashmap lookup problems under timed assessment conditions.',
          priority: 'HIGH',
          estimatedEffort: '90 Mins',
          reason: 'Coding assessment scores are blocking progression to technical interview rounds.',
          expectedImprovementArea: 'Problem Solving & Assessment Score (Target +20 pts)',
          isCompleted: false
        },
        secondaryActions: [
          { id: 'act_sub_6', title: 'Solve 5 String Hashmap Problems', isCompleted: false },
          { id: 'act_sub_7', title: 'Take SkillBridge Standardized Coding Assessment', isCompleted: false }
        ],
        scheduleDays: [
          { day: 1, title: 'Day 1: Array Two-Pointer & Sliding Window Techniques', task: 'Solve 5 array problems.', completed: false },
          { day: 2, title: 'Day 2: Hashmap & Frequency Counter Problems', task: 'Solve 5 hashmap problems.', completed: false },
          { day: 3, title: 'Day 3: Timed Coding Assessment Simulation', task: 'Complete timed coding assessment.', completed: false }
        ]
      };
    }
  }

  async generateInterview(targetRole = 'Junior Frontend Developer', interviewType = 'technical', difficulty = 'Medium') {
    if (interviewType === 'behavioral') {
      return [
        {
          id: 1,
          question: 'Describe a situation where you had to debug a difficult issue under a tight deadline. How did you isolate the problem?',
          category: 'behavioral',
          expectedCriteria: ['Systematic debugging methodology', 'Communication under pressure', 'Resolution outcomes']
        },
        {
          id: 2,
          question: 'How do you handle technical disagreements with senior team members regarding architecture decisions?',
          category: 'behavioral',
          expectedCriteria: ['Constructive collaboration', 'Data-backed trade-offs', 'Team alignment']
        }
      ];
    }

    return [
      {
        id: 1,
        question: 'Explain how the JavaScript Event Loop works. What is the difference between the Call Stack, Microtask Queue (Promises), and Macrotask Queue (setTimeout)?',
        category: 'technical',
        expectedCriteria: ['Call Stack explanation', 'Microtask priority over Macrotask', 'Promise resolution timing']
      },
      {
        id: 2,
        question: 'What is the difference between state and props in React? Why must React state never be mutated directly, and how does React detect re-renders?',
        category: 'technical',
        expectedCriteria: ['Immutability principle', 'Shallow reference comparison', 'Unidirectional data flow']
      },
      {
        id: 3,
        question: 'If a React component is re-rendering too frequently and causing slow scroll performance, what optimization techniques (e.g., React.memo, useMemo, useCallback) would you apply?',
        category: 'problem_solving',
        expectedCriteria: ['React.memo for component memoization', 'useCallback for handler identity', 'List virtualization']
      }
    ];
  }

  async evaluateInterview(qaPairs = [], targetRole = 'Junior Frontend Developer') {
    let totalScore = 71;
    let technicalCorrectness = 72;
    let problemSolving = 68;
    let communication = 74;
    let clarity = 70;

    let wordsTotal = 0;
    qaPairs.forEach(pair => {
      wordsTotal += (pair.answer || '').split(' ').length;
    });

    if (wordsTotal > 150) {
      totalScore = 74;
      technicalCorrectness = 75;
      problemSolving = 70;
      communication = 76;
      clarity = 72;
    }

    const feedback = qaPairs.map((pair, idx) => {
      const q = pair.question;
      const ansLower = (pair.answer || '').toLowerCase();
      let score = 70;
      let strengths = 'Clear explanation of core concept.';
      let improvementAreas = 'Elaborate further on edge cases and performance trade-offs.';

      if (ansLower.includes('microtask') || ansLower.includes('immutability') || ansLower.includes('memo')) {
        score = 80;
        strengths = 'Excellent technical terminology and accurate execution model explanation.';
        improvementAreas = 'Solid answer.';
      } else if (ansLower.length < 30) {
        score = 55;
        strengths = 'Basic response provided.';
        improvementAreas = 'Provide structured step-by-step examples.';
      }

      return {
        questionId: q.id || idx + 1,
        question: q.question,
        candidateAnswer: pair.answer,
        score,
        strengths,
        improvementAreas
      };
    });

    return {
      overallScore: totalScore,
      technicalCorrectness,
      problemSolving,
      communication,
      clarity,
      feedback
    };
  }
}

module.exports = new MockAIProvider();
