import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  Target, Sparkles, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, 
  Building2, Briefcase, RefreshCw, Zap, ShieldAlert 
} from 'lucide-react';

const SAMPLE_JD = `TechCorp Solutions is hiring a Junior Frontend Developer to build responsive web applications using React.js, ES6+ JavaScript, HTML5, and CSS3. 

Key Responsibilities:
- Develop modular UI components in React and integrate RESTful APIs.
- Collaborate with backend engineers to fetch dynamic user data.
- Ensure cross-browser compatibility and responsive layout rendering.

Requirements:
- Strong proficiency in React, ES6+ JavaScript, HTML5, CSS3.
- Familiarity with REST APIs, Git version control, and state management.
- Exposure to TypeScript and automated testing (Jest) is a plus.`;

export default function JobAnalysis() {
  const [company, setCompany] = useState('TechCorp Solutions');
  const [title, setTitle] = useState('Junior Frontend Developer');
  const [descriptionText, setDescriptionText] = useState(SAMPLE_JD);
  const [analyzing, setAnalyzing] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchLatestJob = async () => {
      try {
        const res = await api.getLatestJob();
        if (res.success && res.job) {
          setJobData(res.job);
        }
      } catch (err) {
        console.warn('[JobAnalysis] No existing job target analysis found.');
      }
    };
    fetchLatestJob();
  }, []);

  const handleAnalyzeJob = async (e) => {
    e.preventDefault();
    if (!descriptionText.trim()) {
      setError('Please paste a job description.');
      return;
    }

    setError('');
    setAnalyzing(true);

    try {
      const res = await api.analyzeJob({
        company,
        title,
        descriptionText
      });

      if (res.success && res.analysis) {
        setJobData(res.analysis);
      }
    } catch (err) {
      setError(err.message || 'Job description analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLoadSample = () => {
    setCompany('TechCorp Solutions');
    setTitle('Junior Frontend Developer');
    setDescriptionText(SAMPLE_JD);
  };

  return (
    <div className="sb-container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '1000px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="sb-badge sb-badge-purple" style={{ marginBottom: '0.5rem' }}>
          <Target size={14} /> Target Job Matching Engine
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800' }}>Job Description Requirement Comparison</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Compare your demonstrated skills, projects, and evidence directly against target job requirements to calculate your Job Match Score.
        </p>
      </div>

      {error && (
        <div style={{ background: 'var(--color-red-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--color-red)', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Layout: Input Form + Match Analysis Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1.5rem' }}>
        
        {/* Left Column: Job Description Input */}
        <div className="sb-card sb-card-glow" style={{ height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Paste Job Description</h3>
            <button
              type="button"
              onClick={handleLoadSample}
              className="sb-btn sb-btn-outline sb-btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              <Zap size={12} /> Load Preset JD
            </button>
          </div>

          <form onSubmit={handleAnalyzeJob}>
            <div className="sb-input-group">
              <label className="sb-label">Company Name</label>
              <input
                type="text"
                className="sb-input"
                placeholder="e.g. TechCorp Solutions"
                value={company}
                onChange={e => setCompany(e.target.value)}
                required
              />
            </div>

            <div className="sb-input-group">
              <label className="sb-label">Target Role Title</label>
              <input
                type="text"
                className="sb-input"
                placeholder="e.g. Junior Frontend Developer"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="sb-input-group">
              <label className="sb-label">Job Description Text</label>
              <textarea
                className="sb-textarea"
                style={{ minHeight: '160px', fontSize: '0.85rem' }}
                placeholder="Paste the full job description here..."
                value={descriptionText}
                onChange={e => setDescriptionText(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="sb-btn sb-btn-primary"
              style={{ width: '100%' }}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <RefreshCw size={16} className="spin" /> Comparing Requirements...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Run Job Match Comparison
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Comparison Results Matrix */}
        {jobData ? (
          <div className="sb-card sb-card-glow">
            
            {/* Job Match Score Header Banner */}
            <div style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Target Job Match Score
              </div>
              <div style={{ fontSize: '3.25rem', fontWeight: '800', color: 'var(--accent-cyan)', margin: '0.25rem 0' }}>
                {jobData.matchScore || jobData.match_score}/100
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '600' }}>
                {jobData.jobTitle} @ {jobData.company}
              </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <button
                type="button"
                className={`sb-btn sb-btn-sm ${activeTab === 'all' ? 'sb-btn-primary' : 'sb-btn-secondary'}`}
                onClick={() => setActiveTab('all')}
              >
                All Requirements
              </button>
              <button
                type="button"
                className={`sb-btn sb-btn-sm ${activeTab === 'gaps' ? 'sb-btn-primary' : 'sb-btn-secondary'}`}
                onClick={() => setActiveTab('gaps')}
              >
                Evidence Gaps ({jobData.evidenceGaps?.length || 0})
              </button>
            </div>

            {/* Strong Matches */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--color-green)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} /> Strong Skill Matches ({jobData.strongMatches?.length || 0}):
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {jobData.strongMatches?.map((match, idx) => (
                  <div key={idx} style={{ background: 'var(--color-green-bg)', border: '1px solid rgba(16,185,129,0.3)', padding: '0.65rem 0.85rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#ffffff' }}>{match.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Evidence: {match.evidence}</div>
                    </div>
                    <span className="sb-badge sb-badge-green">{match.currentRating}/100 Rating</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Partial Matches */}
            {jobData.partialMatches?.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--color-yellow)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={16} /> Partial Matches ({jobData.partialMatches?.length}):
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {jobData.partialMatches.map((match, idx) => (
                    <div key={idx} style={{ background: 'var(--color-yellow-bg)', border: '1px solid rgba(245,158,11,0.3)', padding: '0.65rem 0.85rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#ffffff' }}>{match.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Target required: {match.targetRating}/100</div>
                      </div>
                      <span className="sb-badge sb-badge-yellow">{match.currentRating}/100 Rating</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {jobData.missingSkills?.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--color-red)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldAlert size={16} /> High Priority Skill Gaps ({jobData.missingSkills?.length}):
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {jobData.missingSkills.map((missing, idx) => (
                    <div key={idx} style={{ background: 'var(--color-red-bg)', border: '1px solid rgba(239,68,68,0.3)', padding: '0.65rem 0.85rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#ffffff' }}>{missing.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Importance: {missing.importance || 'HIGH'}</div>
                      </div>
                      <span className="sb-badge sb-badge-red">Missing (0/100)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence Gaps Breakdown */}
            {jobData.evidenceGaps?.length > 0 && (
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                  Detailed Evidence Gaps Breakdown:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {jobData.evidenceGaps.map((gap, idx) => (
                    <div key={idx} style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid var(--border-color)', padding: '0.85rem', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{gap.skill}</span>
                        <span className={`sb-badge ${gap.gapSeverity.includes('High') ? 'sb-badge-red' : 'sb-badge-yellow'}`}>
                          {gap.gapSeverity}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        <strong>Current Evidence:</strong> {gap.currentEvidence} | <strong>Target Requirement:</strong> {gap.targetRequirement}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--primary-accent)' }}>
                        👉 Action: {gap.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: '2rem' }}>
              <Link to="/skill-analysis" className="sb-btn sb-btn-primary" style={{ width: '100%' }}>
                View Categorized Skill Gap Engine <ArrowRight size={18} />
              </Link>
            </div>

          </div>
        ) : (
          <div className="sb-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)', minHeight: '350px' }}>
            <div>
              <Target size={48} style={{ margin: '0 auto 1rem auto', color: 'var(--text-dim)' }} />
              <h3>No Job Description Analyzed Yet</h3>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Paste a target job description on the left to calculate your Job Match Score and evidence gap breakdown.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
