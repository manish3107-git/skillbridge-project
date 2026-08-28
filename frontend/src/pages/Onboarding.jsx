import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  User, Briefcase, Target, FileText, CheckCircle2, ArrowRight, ArrowLeft, 
  Plus, Trash2, Sliders, Sparkles, AlertCircle, FileUp, Code, Award 
} from 'lucide-react';

const PRESET_SKILLS = [
  { name: 'JavaScript', category: 'Technical', rating: 80 },
  { name: 'React', category: 'Technical', rating: 75 },
  { name: 'HTML/CSS', category: 'Technical', rating: 85 },
  { name: 'TypeScript', category: 'Technical', rating: 65 },
  { name: 'Node.js', category: 'Technical', rating: 70 },
  { name: 'Data Structures & Algorithms', category: 'Technical', rating: 50 },
  { name: 'Git & Version Control', category: 'Technical', rating: 75 },
  { name: 'Communication', category: 'Soft Skill', rating: 60 }
];

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.name || '',
    headline: 'Aspiring Software Developer',
    education: 'B.Tech in Computer Science',
    experienceLevel: 'Entry Level (0-1 YOE)',
    location: 'Bangalore, India'
  });

  // Step 2: Skills State
  const [skills, setSkills] = useState([
    { id: '1', name: 'JavaScript', category: 'Technical', rating: 78, evidence: 'Built DOM & React web apps' },
    { id: '2', name: 'React', category: 'Technical', rating: 80, evidence: 'Created custom hooks and router components' }
  ]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Technical');
  const [newSkillRating, setNewSkillRating] = useState(70);
  const [newSkillEvidence, setNewSkillEvidence] = useState('');

  // Step 3: Projects State
  const [projects, setProjects] = useState([
    {
      id: 'p1',
      title: 'DevBoard - Kanban Task Manager',
      description: 'Interactive Kanban project management app with drag-and-drop tasks and local storage.',
      technologies: 'React, JavaScript, CSS Modules',
      github_url: 'https://github.com/demo/devboard',
      demo_url: 'https://devboard.demo.app',
      contribution_details: 'Architected state management and built drag-and-drop board components.'
    }
  ]);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    github_url: '',
    demo_url: '',
    contribution_details: ''
  });
  const [showProjectForm, setShowProjectForm] = useState(false);

  // Step 4: Target Role & Goal State
  const [targetRole, setTargetRole] = useState('Junior Frontend Developer');
  const [careerGoal, setCareerGoal] = useState('Secure a Frontend Engineer role in a product-focused tech company within 3 months.');

  // Step 5: Resume Upload / Text State
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('Experienced in building modern React web interfaces, state management, REST API integration, and responsive CSS design.');

  // Fetch initial profile if existing
  useEffect(() => {
    const loadExistingProfile = async () => {
      try {
        const data = await api.getCandidateProfile();
        if (data.success && data.profile) {
          const p = data.profile;
          setPersonalInfo({
            fullName: p.full_name || user?.name || '',
            headline: p.headline || 'Aspiring Software Developer',
            education: p.education || 'B.Tech in Computer Science',
            experienceLevel: p.experience_level || 'Entry Level (0-1 YOE)',
            location: p.location || 'Bangalore, India'
          });
          if (p.target_role) setTargetRole(p.target_role);
          if (p.skills && p.skills.length > 0) setSkills(p.skills);
          if (p.projects && p.projects.length > 0) {
            setProjects(p.projects.map(proj => ({
              ...proj,
              technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies
            })));
          }
        }
      } catch (err) {
        console.log('[Onboarding] Loaded fresh onboarding state.');
      }
    };

    loadExistingProfile();
  }, [user]);

  // Skill Handlers
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const exists = skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase());
    if (exists) {
      setError('This skill is already added.');
      return;
    }
    setError('');
    const created = {
      id: `sk_${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      rating: Number(newSkillRating),
      evidence: newSkillEvidence.trim()
    };
    setSkills([...skills, created]);
    setNewSkillName('');
    setNewSkillEvidence('');
    setNewSkillRating(70);
  };

  const handleAddPresetSkill = (preset) => {
    const exists = skills.some(s => s.name.toLowerCase() === preset.name.toLowerCase());
    if (exists) return;
    setSkills([...skills, { ...preset, id: `sk_${Date.now()}`, evidence: 'Practical project experience' }]);
  };

  const handleRemoveSkill = (id) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  // Project Handlers
  const handleAddProject = () => {
    if (!newProject.title.trim()) return;
    setProjects([...projects, { ...newProject, id: `proj_${Date.now()}` }]);
    setNewProject({
      title: '',
      description: '',
      technologies: '',
      github_url: '',
      demo_url: '',
      contribution_details: ''
    });
    setShowProjectForm(false);
  };

  const handleRemoveProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  // Onboarding Submission
  const handleCompleteOnboarding = async () => {
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        personalInfo,
        skills,
        projects: projects.map(p => ({
          ...p,
          technologies: typeof p.technologies === 'string' ? p.technologies.split(',').map(s => s.trim()) : p.technologies
        })),
        targetRole,
        resumeInfo: {
          filename: resumeFile ? resumeFile.name : 'resume_rahul_sharma.pdf',
          rawText: resumeText
        }
      };

      const res = await api.submitOnboarding(payload);
      if (res.success) {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    setError('');
    if (currentStep === 1 && !personalInfo.fullName.trim()) {
      setError('Please provide your Full Name.');
      return;
    }
    if (currentStep === 2 && skills.length === 0) {
      setError('Please add at least one skill to continue.');
      return;
    }
    if (currentStep === 4 && !targetRole.trim()) {
      setError('Please specify your Target Role.');
      return;
    }
    setCurrentStep(prev => Math.min(6, prev + 1));
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="sb-container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '800px' }}>
      
      {/* Onboarding Timeline Step Indicator */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary-accent)' }}>
            STEP {currentStep} OF 6
          </span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {currentStep === 1 && 'Personal & Career Profile'}
            {currentStep === 2 && 'Skills & Self Assessment'}
            {currentStep === 3 && 'Projects & Evidence'}
            {currentStep === 4 && 'Target Role & Goal'}
            {currentStep === 5 && 'Resume Attachment'}
            {currentStep === 6 && 'Review & Finalize'}
          </span>
        </div>

        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${(currentStep / 6) * 100}%`, 
              height: '100%', 
              background: 'var(--primary-gradient)', 
              transition: 'width 0.3s ease-in-out' 
            }} 
          />
        </div>
      </div>

      {error && (
        <div style={{ background: 'var(--color-red-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--color-red)', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.875rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Personal & Career Information */}
      {currentStep === 1 && (
        <div className="sb-card sb-card-glow">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(99,102,241,0.15)', padding: '0.65rem', borderRadius: '10px', color: 'var(--primary-accent)' }}>
              <User size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem' }}>Personal & Career Baseline</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Help SkillBridge understand your background and experience baseline.</p>
            </div>
          </div>

          <div className="sb-input-group">
            <label className="sb-label">Full Name</label>
            <input
              type="text"
              className="sb-input"
              value={personalInfo.fullName}
              onChange={e => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
              placeholder="e.g. Rahul Sharma"
            />
          </div>

          <div className="sb-input-group">
            <label className="sb-label">Professional Headline</label>
            <input
              type="text"
              className="sb-input"
              value={personalInfo.headline}
              onChange={e => setPersonalInfo({ ...personalInfo, headline: e.target.value })}
              placeholder="e.g. Aspiring Frontend Developer specializing in React"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="sb-input-group">
              <label className="sb-label">Education Qualification</label>
              <input
                type="text"
                className="sb-input"
                value={personalInfo.education}
                onChange={e => setPersonalInfo({ ...personalInfo, education: e.target.value })}
                placeholder="e.g. B.Tech in Computer Science"
              />
            </div>

            <div className="sb-input-group">
              <label className="sb-label">Experience Level</label>
              <select
                className="sb-select"
                value={personalInfo.experienceLevel}
                onChange={e => setPersonalInfo({ ...personalInfo, experienceLevel: e.target.value })}
              >
                <option value="Entry Level (0-1 YOE)">Entry Level (0-1 YOE)</option>
                <option value="Junior (1-2 YOE)">Junior (1-2 YOE)</option>
                <option value="Mid-Level (3-5 YOE)">Mid-Level (3-5 YOE)</option>
                <option value="Career Switcher">Career Switcher</option>
              </select>
            </div>
          </div>

          <div className="sb-input-group">
            <label className="sb-label">Location / Work Preference</label>
            <input
              type="text"
              className="sb-input"
              value={personalInfo.location}
              onChange={e => setPersonalInfo({ ...personalInfo, location: e.target.value })}
              placeholder="e.g. Bangalore, India (Open to Remote & Hybrid)"
            />
          </div>
        </div>
      )}

      {/* STEP 2: Skills & Ratings */}
      {currentStep === 2 && (
        <div className="sb-card sb-card-glow">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(16,185,129,0.15)', padding: '0.65rem', borderRadius: '10px', color: 'var(--color-green)' }}>
              <Code size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem' }}>Skills & Demonstrated Ability</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Rate your proficiency (1-100) and attach practical evidence for each skill.</p>
            </div>
          </div>

          {/* Quick Presets Bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="sb-label">Quick Add Popular Skills:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {PRESET_SKILLS.map(preset => {
                const added = skills.some(s => s.name.toLowerCase() === preset.name.toLowerCase());
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleAddPresetSkill(preset)}
                    className={`sb-btn sb-btn-sm ${added ? 'sb-btn-secondary' : 'sb-btn-outline'}`}
                    disabled={added}
                    style={{ opacity: added ? 0.5 : 1 }}
                  >
                    {added ? '✓ ' + preset.name : '+ ' + preset.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skills Added List */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Your Skills ({skills.length}):</h4>
            {skills.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>No skills added yet. Add a skill below.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {skills.map(sk => (
                  <div key={sk.id} style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: '700', fontSize: '1rem' }}>{sk.name}</span>
                        <span className={`sb-badge ${sk.rating >= 75 ? 'sb-badge-green' : sk.rating >= 50 ? 'sb-badge-yellow' : 'sb-badge-red'}`}>
                          {sk.rating}/100 Proficiency
                        </span>
                        <span className="sb-badge sb-badge-purple">{sk.category}</span>
                      </div>
                      {sk.evidence && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Evidence: {sk.evidence}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(sk.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--color-red)', cursor: 'pointer', padding: '0.5rem' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Custom Skill Form */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>Add Custom Skill:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                className="sb-input"
                placeholder="Skill Name (e.g. Redux Toolkit)"
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
              />
              <select
                className="sb-select"
                value={newSkillCategory}
                onChange={e => setNewSkillCategory(e.target.value)}
              >
                <option value="Technical">Technical</option>
                <option value="Soft Skill">Soft Skill</option>
                <option value="Tool / Framework">Tool / Framework</option>
              </select>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>Proficiency Rating:</span>
                <span style={{ fontWeight: '700', color: 'var(--primary-accent)' }}>{newSkillRating}/100</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={newSkillRating}
                onChange={e => setNewSkillRating(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--primary-accent)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                className="sb-input"
                placeholder="Optional evidence (e.g. Built 2 projects using state slice)"
                value={newSkillEvidence}
                onChange={e => setNewSkillEvidence(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="sb-btn sb-btn-primary"
                onClick={handleAddSkill}
              >
                <Plus size={16} /> Add Skill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Projects & Practical Evidence */}
      {currentStep === 3 && (
        <div className="sb-card sb-card-glow">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(6,182,212,0.15)', padding: '0.65rem', borderRadius: '10px', color: 'var(--accent-cyan)' }}>
                <Briefcase size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem' }}>Practical Projects ({projects.length})</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Demonstrated proof of skills built into actual working applications.</p>
              </div>
            </div>

            <button
              type="button"
              className="sb-btn sb-btn-primary sb-btn-sm"
              onClick={() => setShowProjectForm(!showProjectForm)}
            >
              <Plus size={16} /> Add Project
            </button>
          </div>

          {/* Project List Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {projects.map(p => (
              <div key={p.id} style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>{p.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{p.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveProject(p.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--color-red)', cursor: 'pointer' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--primary-accent)', marginBottom: '0.5rem' }}>
                  <strong>Tech Stack:</strong> {typeof p.technologies === 'string' ? p.technologies : p.technologies?.join(', ')}
                </div>

                {p.contribution_details && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Contribution: {p.contribution_details}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Add Project Modal / In-line Form */}
          {showProjectForm && (
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--primary-accent)' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Add New Practical Project:</h4>
              <div className="sb-input-group">
                <input
                  type="text"
                  className="sb-input"
                  placeholder="Project Title (e.g. E-Commerce Cart App)"
                  value={newProject.title}
                  onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>

              <div className="sb-input-group">
                <textarea
                  className="sb-textarea"
                  style={{ minHeight: '80px' }}
                  placeholder="Short Description of project features and problem solved..."
                  value={newProject.description}
                  onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>

              <div className="sb-input-group">
                <input
                  type="text"
                  className="sb-input"
                  placeholder="Technologies Used (comma separated, e.g. React, Redux, REST API)"
                  value={newProject.technologies}
                  onChange={e => setNewProject({ ...newProject, technologies: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <input
                  type="url"
                  className="sb-input"
                  placeholder="GitHub Repo URL (optional)"
                  value={newProject.github_url}
                  onChange={e => setNewProject({ ...newProject, github_url: e.target.value })}
                />
                <input
                  type="url"
                  className="sb-input"
                  placeholder="Live Demo URL (optional)"
                  value={newProject.demo_url}
                  onChange={e => setNewProject({ ...newProject, demo_url: e.target.value })}
                />
              </div>

              <div className="sb-input-group">
                <input
                  type="text"
                  className="sb-input"
                  placeholder="Your exact technical contributions..."
                  value={newProject.contribution_details}
                  onChange={e => setNewProject({ ...newProject, contribution_details: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="sb-btn sb-btn-secondary"
                  onClick={() => setShowProjectForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="sb-btn sb-btn-primary"
                  onClick={handleAddProject}
                >
                  Save Project
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: Target Role & Career Goal */}
      {currentStep === 4 && (
        <div className="sb-card sb-card-glow">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(245,158,11,0.15)', padding: '0.65rem', borderRadius: '10px', color: 'var(--color-yellow)' }}>
              <Target size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem' }}>Target Role & Career Goal</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Specify the exact job title you are targeting for bottleneck analysis.</p>
            </div>
          </div>

          <div className="sb-input-group">
            <label className="sb-label">Target Role Title</label>
            <select
              className="sb-select"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
            >
              <option value="Junior Frontend Developer">Junior Frontend Developer</option>
              <option value="React Engineer">React Engineer</option>
              <option value="Full Stack Developer (Node + React)">Full Stack Developer (Node + React)</option>
              <option value="Junior Backend Engineer">Junior Backend Engineer</option>
              <option value="Software Engineer Trainee">Software Engineer Trainee</option>
            </select>
          </div>

          <div className="sb-input-group">
            <label className="sb-label">Primary Career Objective</label>
            <textarea
              className="sb-textarea"
              value={careerGoal}
              onChange={e => setCareerGoal(e.target.value)}
              placeholder="Describe your career goals and what you hope to achieve..."
            />
          </div>
        </div>
      )}

      {/* STEP 5: Resume Upload Placeholder */}
      {currentStep === 5 && (
        <div className="sb-card sb-card-glow">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(139,92,246,0.15)', padding: '0.65rem', borderRadius: '10px', color: '#a5b4fc' }}>
              <FileUp size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem' }}>Resume Upload & Analysis Baseline</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Attach your resume PDF or paste your resume highlights for keyword scanning.</p>
            </div>
          </div>

          {/* Upload Dropzone */}
          <div style={{ border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '2.5rem', textAlign: 'center', background: 'rgba(17,24,39,0.5)', marginBottom: '1.5rem' }}>
            <FileText size={40} style={{ color: 'var(--primary-accent)', marginBottom: '0.75rem' }} />
            <h4 style={{ marginBottom: '0.35rem' }}>
              {resumeFile ? resumeFile.name : 'Upload PDF Resume'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Drag and drop your PDF resume or click to select
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              id="resume-file-input"
              onChange={e => setResumeFile(e.target.files[0])}
            />
            <label htmlFor="resume-file-input" className="sb-btn sb-btn-outline sb-btn-sm" style={{ cursor: 'pointer' }}>
              Select File
            </label>
          </div>

          <div className="sb-input-group">
            <label className="sb-label">Resume Highlights / Text Content</label>
            <textarea
              className="sb-textarea"
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              placeholder="Paste your key resume sections here..."
            />
          </div>

          <div style={{ background: 'rgba(16,185,129,0.1)', padding: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Award size={20} color="var(--color-green)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--color-green)' }}>
              Detected Sections: ✓ Skills ✓ Projects ✓ Education ✓ Experience
            </span>
          </div>
        </div>
      )}

      {/* STEP 6: Review & Finalize */}
      {currentStep === 6 && (
        <div className="sb-card sb-card-glow">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--primary-gradient)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', boxShadow: 'var(--shadow-glow)' }}>
              <Sparkles size={30} color="#ffffff" />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Ready to Calculate Your Career Readiness</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              We will synthesize your profile, skills, and projects into your baseline SkillBridge Career Readiness Score.
            </p>
          </div>

          {/* Profile Summary Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(17,24,39,0.8)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Candidate</div>
              <div style={{ fontWeight: '700', fontSize: '1rem' }}>{personalInfo.fullName}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary-accent)' }}>{personalInfo.headline}</div>
            </div>

            <div style={{ background: 'rgba(17,24,39,0.8)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Role</div>
              <div style={{ fontWeight: '700', fontSize: '1rem' }}>{targetRole}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{personalInfo.experienceLevel}</div>
            </div>

            <div style={{ background: 'rgba(17,24,39,0.8)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Skills Added</div>
              <div style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--color-green)' }}>{skills.length} Skills</div>
            </div>

            <div style={{ background: 'rgba(17,24,39,0.8)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Projects Attached</div>
              <div style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--accent-cyan)' }}>{projects.length} Projects</div>
            </div>
          </div>

          <button
            type="button"
            className="sb-btn sb-btn-primary sb-btn-lg"
            style={{ width: '100%' }}
            onClick={handleCompleteOnboarding}
            disabled={submitting}
          >
            {submitting ? 'Calculating Readiness Score & Saving...' : 'Complete Onboarding & View Dashboard'} <ArrowRight size={20} />
          </button>
        </div>
      )}

      {/* Navigation Step Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
        {currentStep > 1 ? (
          <button type="button" className="sb-btn sb-btn-secondary" onClick={prevStep}>
            <ArrowLeft size={16} /> Previous Step
          </button>
        ) : <div />}

        {currentStep < 6 && (
          <button type="button" className="sb-btn sb-btn-primary" onClick={nextStep}>
            Next Step <ArrowRight size={16} />
          </button>
        )}
      </div>

    </div>
  );
}
