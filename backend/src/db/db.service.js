const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

/**
 * Database Service Layer
 * Supports Supabase PostgreSQL database persistence with an in-memory fallback store
 * prepopulated with seed data (Rahul Sharma demo candidate & Admin demo user)
 * ensuring full offline/dev compatibility.
 */

class DatabaseService {
  constructor() {
    this.users = new Map();
    this.candidateProfiles = new Map();
    this.organizationProfiles = new Map();
    this.skillsMaster = new Map();
    this.candidateSkills = new Map();
    this.candidateProjects = new Map();
    this.resumesStore = new Map();
    this.jobsStore = new Map();
    this.applicationsStore = new Map();
    this.diagnosesStore = new Map();
    this.actionPlansStore = new Map();
    this.interviewsStore = new Map();
    this.progressSnapshotsStore = new Map();

    this._initializeSeedDataSync();
  }

  _initializeSeedDataSync() {
    const defaultPasswordHash = bcrypt.hashSync('password123', 10);

    // Seed Demo Candidate (Rahul)
    const candidateUser = {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'rahul@skillbridge.demo',
      password_hash: defaultPasswordHash,
      role: 'candidate',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.users.set(candidateUser.email.toLowerCase(), candidateUser);
    
    const candidateProfile = {
      id: '22222222-2222-2222-2222-222222222222',
      user_id: candidateUser.id,
      full_name: 'Rahul Sharma',
      headline: 'Aspiring Frontend Engineer specializing in React & Modern Web Tech',
      education: 'B.Tech in Computer Science',
      target_role: 'Junior Frontend Developer',
      experience_level: 'Entry Level (0-1 YOE)',
      location: 'Bangalore, India',
      readiness_score: 74,
      technical_score: 68,
      project_score: 72,
      resume_score: 84,
      assessment_score: 58,
      interview_score: 71,
      communication_score: 74,
      onboarding_step: 6,
      created_at: new Date().toISOString()
    };
    this.candidateProfiles.set(candidateUser.id, candidateProfile);

    // Seed Rahul's Initial "BEFORE" Progress Snapshot
    this.progressSnapshotsStore.set(candidateProfile.id, [{
      id: 'snap_before_1',
      candidate_id: candidateProfile.id,
      readiness_score: 61,
      technical_score: 52,
      project_score: 72,
      resume_score: 84,
      assessment_score: 58,
      interview_score: 47,
      communication_score: 55,
      trigger_event: 'Initial Diagnostic Baseline',
      recorded_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }]);

    // Seed Rahul's Skills
    this.candidateSkills.set(candidateProfile.id, [
      { id: 'sk_1', name: 'JavaScript', category: 'Technical', rating: 78, evidence: 'Built 4 DOM & React apps' },
      { id: 'sk_2', name: 'React', category: 'Technical', rating: 81, evidence: 'Created custom hooks & context stores' },
      { id: 'sk_3', name: 'HTML/CSS', category: 'Technical', rating: 90, evidence: 'Responsive Flexbox & Grid layouts' },
      { id: 'sk_4', name: 'Data Structures & Algorithms', category: 'Technical', rating: 45, evidence: 'Basic LeetCode array problems' },
      { id: 'sk_5', name: 'Communication', category: 'Soft Skill', rating: 52, evidence: 'Group discussions & presentation' }
    ]);

    // Seed Rahul's Projects
    this.candidateProjects.set(candidateProfile.id, [
      {
        id: 'proj_1',
        title: 'DevBoard - Kanban Task Manager',
        description: 'Interactive Kanban project management app with drag-and-drop tasks, custom tags, and local storage persistence.',
        technologies: ['React', 'JavaScript', 'CSS Modules'],
        github_url: 'https://github.com/rahul/devboard',
        demo_url: 'https://devboard-demo.vercel.app',
        contribution_details: 'Architected state management, built responsive drag-drop columns, and integrated dark mode theme.',
        rating_score: 80
      },
      {
        id: 'proj_2',
        title: 'ShopPulse - E-commerce UI Kit',
        description: 'Modern storefront UI with cart filtering, product search, checkout modal, and mock API integration.',
        technologies: ['React', 'REST API', 'Tailwind CSS'],
        github_url: 'https://github.com/rahul/shoppulse',
        demo_url: 'https://shoppulse.vercel.app',
        contribution_details: 'Implemented cart state reducer, product detail modals, and mock JSON API fetching.',
        rating_score: 75
      }
    ]);

    // Seed Rahul's Applications History
    const mockApps = [
      { id: 'app_1', company: 'TechCorp', role: 'Junior React Dev', stage: 'Technical Interview', result: 'Rejected', rejection_stage: 'Technical Interview', interview_score: 45 },
      { id: 'app_2', company: 'InnoLabs', role: 'Frontend Engineer', stage: 'Technical Interview', result: 'Rejected', rejection_stage: 'Technical Interview', interview_score: 48 },
      { id: 'app_3', company: 'CloudScale', role: 'UI Developer', stage: 'Technical Interview', result: 'Rejected', rejection_stage: 'Technical Interview', interview_score: 42 },
      { id: 'app_4', company: 'DataFlex', role: 'Junior Frontend Dev', stage: 'Technical Interview', result: 'Rejected', rejection_stage: 'Technical Interview', interview_score: 50 },
      { id: 'app_5', company: 'DevStudio', role: 'React Developer', stage: 'Technical Interview', result: 'Rejected', rejection_stage: 'Technical Interview', interview_score: 46 },
      { id: 'app_6', company: 'WebFlows', role: 'Junior Software Engineer', stage: 'Technical Interview', result: 'Rejected', rejection_stage: 'Technical Interview', interview_score: 44 },
      { id: 'app_7', company: 'AppWorks', role: 'Frontend Engineer', stage: 'Technical Interview', result: 'Rejected', rejection_stage: 'Technical Interview', interview_score: 49 },
      { id: 'app_8', company: 'CodeWorks', role: 'React Dev', stage: 'Resume Screen', result: 'Rejected', rejection_stage: 'Resume Screen' },
      { id: 'app_9', company: 'NextGen', role: 'Junior Dev', stage: 'Resume Screen', result: 'Rejected', rejection_stage: 'Resume Screen' },
      { id: 'app_10', company: 'PixelCraft', role: 'UI Engineer', stage: 'Resume Screen', result: 'Rejected', rejection_stage: 'Resume Screen' },
      { id: 'app_11', company: 'SkillLab', role: 'Frontend Trainee', stage: 'Assessment', result: 'Rejected', rejection_stage: 'Assessment', interview_score: 58 },
      { id: 'app_12', company: 'ByteCode', role: 'Software Engineer', stage: 'Assessment', result: 'Rejected', rejection_stage: 'Assessment', interview_score: 56 },
      { id: 'app_13', company: 'SoftCorp', role: 'Junior React Dev', stage: 'HR Interview', result: 'Rejected', rejection_stage: 'HR Interview' },
      { id: 'app_14', company: 'GlobalTech', role: 'Frontend Specialist', stage: 'HR Interview', result: 'Rejected', rejection_stage: 'HR Interview' },
      { id: 'app_15', company: 'PrimeSystems', role: 'Junior UI Engineer', stage: 'HR Interview', result: 'Rejected', rejection_stage: 'HR Interview' }
    ];
    this.applicationsStore.set(candidateProfile.id, mockApps);

    // Seed Rahul's Initial Resume
    this.resumesStore.set(candidateProfile.id, [{
      id: 'res_seed_1',
      candidate_id: candidateProfile.id,
      filename: 'rahul_sharma_resume.pdf',
      strength_score: 84,
      detected_sections: ['Skills', 'Projects', 'Education', 'Experience'],
      matched_keywords: ['REACT', 'JAVASCRIPT', 'HTML', 'CSS', 'REST API', 'GIT'],
      missing_keywords: ['TYPESCRIPT', 'JEST', 'REDUX'],
      improvement_areas: [
        'Add measurable project outcomes (e.g. "Improved page load speed by 35%")',
        'Incorporate TypeScript keywords for Junior Frontend Developer role'
      ],
      created_at: new Date().toISOString()
    }]);

    // Seed Rahul's Target Job Alignment
    this.jobsStore.set(candidateProfile.id, [{
      id: 'job_seed_1',
      candidate_id: candidateProfile.id,
      company: 'TechCorp Solutions',
      jobTitle: 'Junior Frontend Developer',
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
      evidenceGaps: [],
      created_at: new Date().toISOString()
    }]);

    // Seed Demo Admin
    const adminUser = {
      id: '99999999-9999-9999-9999-999999999999',
      email: 'admin@techcorp.com',
      password_hash: defaultPasswordHash,
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.users.set(adminUser.email.toLowerCase(), adminUser);

    this.organizationProfiles.set(adminUser.id, {
      id: '88888888-8888-8888-8888-888888888888',
      user_id: adminUser.id,
      org_name: 'TechCorp Talent Accelerators',
      industry: 'Software Development & Recruitment',
      created_at: new Date().toISOString()
    });
  }

  async findUserByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('email', normalizedEmail).single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DB Service] Supabase query error:', err.message);
      }
    }
    return this.users.get(normalizedEmail) || null;
  }

  async findUserById(id) {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DB Service] Supabase query error:', err.message);
      }
    }
    for (const user of this.users.values()) {
      if (user.id === id) return user;
    }
    return null;
  }

  async createUser({ email, passwordHash, role = 'candidate', fullName, orgName }) {
    const normalizedEmail = email.toLowerCase().trim();
    const userId = crypto.randomUUID ? crypto.randomUUID() : `usr_${Date.now()}`;
    const profileId = crypto.randomUUID ? crypto.randomUUID() : `prf_${Date.now()}`;
    const now = new Date().toISOString();

    const newUser = {
      id: userId,
      email: normalizedEmail,
      password_hash: passwordHash,
      role,
      created_at: now,
      updated_at: now
    };

    if (supabase) {
      try {
        const { data: userRes, error: userErr } = await supabase.from('users').insert([newUser]).select().single();
        if (userErr) throw userErr;

        if (role === 'candidate') {
          await supabase.from('candidate_profiles').insert([{
            id: profileId,
            user_id: userId,
            full_name: fullName || email.split('@')[0],
            target_role: 'Junior Frontend Developer',
            readiness_score: 40,
            technical_score: 40,
            project_score: 40,
            resume_score: 40,
            assessment_score: 40,
            interview_score: 40,
            communication_score: 40,
            onboarding_step: 1,
            created_at: now
          }]);
        } else {
          await supabase.from('organization_profiles').insert([{
            id: profileId,
            user_id: userId,
            org_name: orgName || 'Organization Admin',
            industry: 'Tech Recruitment',
            created_at: now
          }]);
        }
        return userRes;
      } catch (err) {
        console.warn('[DB Service] Supabase insert error:', err.message);
      }
    }

    this.users.set(normalizedEmail, newUser);

    if (role === 'candidate') {
      this.candidateProfiles.set(userId, {
        id: profileId,
        user_id: userId,
        full_name: fullName || email.split('@')[0],
        headline: 'Candidate',
        education: 'Bachelor Degree',
        target_role: 'Junior Frontend Developer',
        experience_level: 'Entry Level',
        location: 'Remote',
        readiness_score: 40,
        technical_score: 40,
        project_score: 40,
        resume_score: 40,
        assessment_score: 40,
        interview_score: 40,
        communication_score: 40,
        onboarding_step: 1,
        created_at: now
      });
    } else {
      this.organizationProfiles.set(userId, {
        id: profileId,
        user_id: userId,
        org_name: orgName || 'Organization Admin',
        industry: 'Software Development',
        created_at: now
      });
    }

    return newUser;
  }

  async getCandidateProfile(userId) {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('candidate_profiles').select('*').eq('user_id', userId).single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DB Service] Supabase query error:', err.message);
      }
    }
    return this.candidateProfiles.get(userId) || null;
  }

  async updateCandidateProfile(userId, profileUpdates) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('candidate_profiles')
          .update(profileUpdates)
          .eq('user_id', userId)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DB Service] Supabase update error:', err.message);
      }
    }

    const existing = this.candidateProfiles.get(userId);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...profileUpdates,
      updated_at: new Date().toISOString()
    };
    this.candidateProfiles.set(userId, updated);
    return updated;
  }

  async saveCandidateSkills(candidateId, skillsList = []) {
    if (supabase) {
      try {
        for (const sk of skillsList) {
          await supabase.from('candidate_skills').upsert({
            candidate_id: candidateId,
            self_rating: sk.rating || 50,
            evidence_text: sk.evidence || ''
          });
        }
      } catch (err) {
        console.warn('[DB Service] Supabase skills save error:', err.message);
      }
    }

    const formatted = skillsList.map((sk, idx) => ({
      id: sk.id || `sk_${Date.now()}_${idx}`,
      name: sk.name,
      category: sk.category || 'Technical',
      rating: Number(sk.rating) || 50,
      evidence: sk.evidence || ''
    }));

    this.candidateSkills.set(candidateId, formatted);
    return formatted;
  }

  async getCandidateSkills(candidateId) {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('candidate_skills').select('*').eq('candidate_id', candidateId);
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DB Service] Supabase skills query error:', err.message);
      }
    }
    return this.candidateSkills.get(candidateId) || [];
  }

  async saveCandidateProjects(candidateId, projectsList = []) {
    if (supabase) {
      try {
        for (const proj of projectsList) {
          await supabase.from('projects').insert({
            candidate_id: candidateId,
            title: proj.title,
            description: proj.description,
            technologies: proj.technologies,
            github_url: proj.github_url,
            demo_url: proj.demo_url,
            contribution_details: proj.contribution_details
          });
        }
      } catch (err) {
        console.warn('[DB Service] Supabase projects save error:', err.message);
      }
    }

    const formatted = projectsList.map((p, idx) => ({
      id: p.id || `proj_${Date.now()}_${idx}`,
      title: p.title,
      description: p.description || '',
      technologies: Array.isArray(p.technologies) ? p.technologies : (p.technologies ? p.technologies.split(',').map(s => s.trim()) : []),
      github_url: p.github_url || '',
      demo_url: p.demo_url || '',
      contribution_details: p.contribution_details || '',
      rating_score: p.rating_score || 70
    }));

    this.candidateProjects.set(candidateId, formatted);
    return formatted;
  }

  async getCandidateProjects(candidateId) {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('projects').select('*').eq('candidate_id', candidateId);
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DB Service] Supabase projects query error:', err.message);
      }
    }
    return this.candidateProjects.get(candidateId) || [];
  }

  async getCandidateApplications(candidateId) {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('applications').select('*').eq('candidate_id', candidateId);
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DB Service] Supabase applications query error:', err.message);
      }
    }
    return this.applicationsStore.get(candidateId) || [];
  }

  // Save Resume Analysis Record
  async saveResumeAnalysis(candidateId, resumeData) {
    const record = {
      id: `res_${Date.now()}`,
      candidate_id: candidateId,
      filename: resumeData.filename || 'resume.pdf',
      parsed_text: resumeData.parsedText || '',
      strength_score: resumeData.strengthScore || 75,
      detected_sections: resumeData.detectedSections || [],
      matched_keywords: resumeData.matchedKeywords || [],
      missing_keywords: resumeData.missingKeywords || [],
      improvement_areas: resumeData.improvementAreas || [],
      created_at: new Date().toISOString()
    };

    const existing = this.resumesStore.get(candidateId) || [];
    this.resumesStore.set(candidateId, [record, ...existing]);

    return record;
  }

  async getLatestResume(candidateId) {
    const list = this.resumesStore.get(candidateId) || [];
    return list.length > 0 ? list[0] : null;
  }

  // Save Target Job Analysis Record
  async saveJobAnalysis(candidateId, jobData) {
    const record = {
      id: `job_${Date.now()}`,
      candidate_id: candidateId,
      company: jobData.company || 'TechCorp',
      jobTitle: jobData.jobTitle || 'Junior Frontend Developer',
      matchScore: jobData.matchScore || 70,
      strongMatches: jobData.strongMatches || [],
      partialMatches: jobData.partialMatches || [],
      missingSkills: jobData.missingSkills || [],
      evidenceGaps: jobData.evidenceGaps || [],
      extractedRequirements: jobData.extractedRequirements || [],
      created_at: new Date().toISOString()
    };

    const existing = this.jobsStore.get(candidateId) || [];
    this.jobsStore.set(candidateId, [record, ...existing]);

    return record;
  }

  async getLatestJob(candidateId) {
    const list = this.jobsStore.get(candidateId) || [];
    return list.length > 0 ? list[0] : null;
  }

  // Save Career Diagnosis Record
  async saveDiagnosisRecord(candidateId, diagnosisData) {
    const record = {
      id: `diag_${Date.now()}`,
      candidate_id: candidateId,
      primaryBottleneck: diagnosisData.primaryBottleneck,
      secondaryBottleneck: diagnosisData.secondaryBottleneck,
      confidence: diagnosisData.confidence,
      explanation: diagnosisData.explanation,
      evidence: diagnosisData.evidence || [],
      affectedAreas: diagnosisData.affectedAreas || [],
      nextBestAction: diagnosisData.nextBestAction || {},
      created_at: new Date().toISOString()
    };

    const existing = this.diagnosesStore.get(candidateId) || [];
    this.diagnosesStore.set(candidateId, [record, ...existing]);

    return record;
  }

  async getLatestDiagnosis(candidateId) {
    const list = this.diagnosesStore.get(candidateId) || [];
    return list.length > 0 ? list[0] : null;
  }

  // Action Plan Methods
  async saveActionPlanRecord(candidateId, actionPlanData) {
    const plan = {
      id: `plan_${Date.now()}`,
      candidate_id: candidateId,
      ...actionPlanData,
      updated_at: new Date().toISOString()
    };
    this.actionPlansStore.set(candidateId, plan);
    return plan;
  }

  async getLatestActionPlan(candidateId) {
    return this.actionPlansStore.get(candidateId) || null;
  }

  async updateActionItemStatus(candidateId, itemId, completed = true) {
    const plan = this.actionPlansStore.get(candidateId);
    if (!plan) return null;

    if (plan.primaryAction && (plan.primaryAction.id === itemId || itemId === 'primary')) {
      plan.primaryAction.isCompleted = completed;
    }
    if (plan.secondaryActions) {
      plan.secondaryActions.forEach(act => {
        if (act.id === itemId) act.isCompleted = completed;
      });
    }
    if (plan.scheduleDays) {
      plan.scheduleDays.forEach(day => {
        if (day.day === Number(itemId) || day.title.toLowerCase().includes(String(itemId).toLowerCase())) {
          day.completed = completed;
        }
      });
    }

    plan.updated_at = new Date().toISOString();
    this.actionPlansStore.set(candidateId, plan);
    return plan;
  }

  // Save Mock Interview Result & Trigger Profile Score Reassessment
  async saveInterviewResult(candidateId, userId, interviewData) {
    const record = {
      id: `int_${Date.now()}`,
      candidate_id: candidateId,
      target_role: interviewData.targetRole || 'Junior Frontend Developer',
      interview_type: interviewData.interviewType || 'technical',
      difficulty: interviewData.difficulty || 'Medium',
      questions_and_answers: interviewData.qaPairs || [],
      overall_score: interviewData.overallScore || 71,
      technical_correctness: interviewData.technicalCorrectness || 72,
      problem_solving: interviewData.problemSolving || 68,
      communication: interviewData.communication || 74,
      feedback: interviewData.feedback || [],
      created_at: new Date().toISOString()
    };

    const existing = this.interviewsStore.get(candidateId) || [];
    this.interviewsStore.set(candidateId, [record, ...existing]);

    const currentProfile = await this.getCandidateProfile(userId);
    if (currentProfile) {
      const updatedScores = this.calculateReadinessScore({
        technical_score: interviewData.problemSolving || 68,
        project_score: currentProfile.project_score || 72,
        resume_score: currentProfile.resume_score || 84,
        assessment_score: currentProfile.assessment_score || 58,
        interview_score: interviewData.overallScore || 71,
        communication_score: interviewData.communication || 74
      });

      await this.updateCandidateProfile(userId, updatedScores);
      await this.recordProgressSnapshot(candidateId, updatedScores, 'Post Mock-Interview Reassessment');
    }

    return record;
  }

  async getInterviewHistory(candidateId) {
    return this.interviewsStore.get(candidateId) || [];
  }

  // Progress Snapshots Methods
  async recordProgressSnapshot(candidateId, scores, triggerEvent = 'Reassessment Completed') {
    const snapshot = {
      id: `snap_${Date.now()}`,
      candidate_id: candidateId,
      readiness_score: scores.readiness_score || 74,
      technical_score: scores.technical_score || 68,
      project_score: scores.project_score || 72,
      resume_score: scores.resume_score || 84,
      assessment_score: scores.assessment_score || 58,
      interview_score: scores.interview_score || 71,
      communication_score: scores.communication_score || 74,
      trigger_event: triggerEvent,
      recorded_at: new Date().toISOString()
    };

    const existing = this.progressSnapshotsStore.get(candidateId) || [];
    this.progressSnapshotsStore.set(candidateId, [...existing, snapshot]);

    return snapshot;
  }

  async getProgressHistory(candidateId) {
    let snapshots = this.progressSnapshotsStore.get(candidateId) || [];

    if (snapshots.length === 0) {
      const beforeSnap = {
        id: 'snap_before_default',
        candidate_id: candidateId,
        readiness_score: 61,
        technical_score: 52,
        project_score: 72,
        resume_score: 84,
        assessment_score: 58,
        interview_score: 47,
        communication_score: 55,
        trigger_event: 'Initial Diagnostic Baseline',
        recorded_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      snapshots = [beforeSnap];
      this.progressSnapshotsStore.set(candidateId, snapshots);
    }

    return snapshots;
  }

  // Organization Aggregate Privacy-Conscious Analytics
  async getAdminAnalytics() {
    // Return aggregate privacy-conscious metrics for Organization Dashboard
    return {
      kpis: {
        totalCandidates: 128,
        avgReadinessScore: 68.4,
        commonRejectionStage: 'Technical Interview (46%)',
        avgReadinessImprovement: '+14.2 pts',
        interviewConversionRate: '24.5%'
      },
      bottleneckDistribution: [
        { name: 'Technical Interview', count: 59, percentage: 46 },
        { name: 'Problem Solving', count: 32, percentage: 25 },
        { name: 'Resume Gap', count: 19, percentage: 15 },
        { name: 'Skill Gap', count: 13, percentage: 10 },
        { name: 'Communication', count: 5, percentage: 4 }
      ],
      topSkillGaps: [
        { name: 'TypeScript', count: 82 },
        { name: 'Automated Testing (Jest)', count: 71 },
        { name: 'State Management (Redux/Zustand)', count: 54 },
        { name: 'System Design / Web Vitals', count: 42 },
        { name: 'Docker / CI-CD', count: 28 }
      ],
      applicationFunnel: [
        { stage: 'Applications Logged', count: 480 },
        { stage: 'Resume Screen Passed', count: 320 },
        { stage: 'Assessment Passed', count: 210 },
        { stage: 'Technical Interview Passed', count: 115 },
        { stage: 'Job Offers Received', count: 78 }
      ],
      improvementTrend: [
        { month: 'Jan', baselineReadiness: 58, postActionReadiness: 69 },
        { month: 'Feb', baselineReadiness: 59, postActionReadiness: 72 },
        { month: 'Mar', baselineReadiness: 61, postActionReadiness: 74 },
        { month: 'Apr', baselineReadiness: 60, postActionReadiness: 75 },
        { month: 'May', baselineReadiness: 62, postActionReadiness: 77 },
        { month: 'Jun', baselineReadiness: 64, postActionReadiness: 79 }
      ],
      anonymizedCandidates: [
        { id: 'CND-8901', role: 'Junior Frontend Developer', readinessScore: 74, primaryBottleneck: 'TECHNICAL_INTERVIEW', actionPlanStatus: 'In Progress' },
        { id: 'CND-8902', role: 'React Specialist', readinessScore: 68, primaryBottleneck: 'PROBLEM_SOLVING', actionPlanStatus: 'Completed' },
        { id: 'CND-8903', role: 'Full Stack Engineer', readinessScore: 55, primaryBottleneck: 'RESUME_GAP', actionPlanStatus: 'In Progress' },
        { id: 'CND-8904', role: 'Junior Frontend Developer', readinessScore: 81, primaryBottleneck: 'COMMUNICATION', actionPlanStatus: 'Completed' },
        { id: 'CND-8905', role: 'UI Developer', readinessScore: 62, primaryBottleneck: 'TECHNICAL_INTERVIEW', actionPlanStatus: 'Pending' }
      ]
    };
  }

  async getOrganizationProfile(userId) {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('organization_profiles').select('*').eq('user_id', userId).single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DB Service] Supabase query error:', err.message);
      }
    }
    return this.organizationProfiles.get(userId) || null;
  }

  calculateReadinessScore(components = {}) {
    const technical = components.technical_score || 50;
    const project = components.project_score || 50;
    const resume = components.resume_score || 50;
    const assessment = components.assessment_score || 50;
    const interview = components.interview_score || 50;
    const communication = components.communication_score || 50;

    const weightedScore = Math.round(
      (technical * 0.30) +
      (project * 0.20) +
      (resume * 0.15) +
      (assessment * 0.15) +
      (interview * 0.10) +
      (communication * 0.10)
    );

    return {
      readiness_score: Math.min(100, Math.max(0, weightedScore)),
      technical_score: technical,
      project_score: project,
      resume_score: resume,
      assessment_score: assessment,
      interview_score: interview,
      communication_score: communication
    };
  }
}

module.exports = new DatabaseService();
