import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  AlertTriangle, ShieldAlert, Sparkles, ArrowRight, CheckCircle2, 
  HelpCircle, Clock, Zap, Target, Activity, FileText, Code 
} from 'lucide-react';

export default function Diagnosis() {
  const navigate = useNavigate();

  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  const fetchLatestDiagnosis = async () => {
    try {
      setLoading(true);
      const res = await api.getLatestDiagnosis();
      if (res.success && res.diagnosis) {
        setDiagnosis(res.diagnosis);
      }
    } catch (err) {
      setError('Failed to load career diagnosis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestDiagnosis();
  }, []);

  const handleRunDiagnosis = async () => {
    setRunning(true);
    setError('');

    try {
      const res = await api.runDiagnosis();
      if (res.success && res.diagnosis) {
        setDiagnosis(res.diagnosis);
      }
    } catch (err) {
      setError(err.message || 'Diagnosis execution failed.');
    } finally {
      setRunning(false);
    }
  };

  const getBottleneckLabel = (key) => {
    switch (key) {
      case 'TECHNICAL_INTERVIEW': return 'Technical Interview Readiness';
      case 'PROBLEM_SOLVING': return 'Problem Solving & Live Coding';
      case 'RESUME_GAP': return 'Resume Keyword & Alignment Gap';
      case 'SKILL_GAP': return 'Technical Skill Gap';
      case 'JOB_TARGETING': return 'Job Targeting Alignment';
      case 'COMMUNICATION': return 'Communication & Presentation';
      case 'PROJECT_EVIDENCE': return 'Practical Project Evidence Gap';
      default: return key || 'Technical Interview Readiness';
    }
  };

  if (loading) {
    return (
      <div className="sb-container" style={{ paddingTop: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: 'var(--primary-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
        <p>Running SkillBridge Evidence & Bottleneck Diagnosis...</p>
      </div>
    );
  }

  const primaryKey = diagnosis?.primaryBottleneck || 'TECHNICAL_INTERVIEW';
  const secondaryKey = diagnosis?.secondaryBottleneck || 'PROBLEM_SOLVING';
  const confidencePct = Math.round((diagnosis?.confidence || 0.82) * (diagnosis?.confidence > 1 ? 1 : 100));
  const nextAction = diagnosis?.nextBestAction || {};

  return (
    <div className="sb-container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '950px' }}>
      
      {/* Top Banner Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div className="sb-badge sb-badge-red" style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            <Activity size={14} /> Core Career Intelligence Feature
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800' }}>Career Bottleneck Diagnosis</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Synthesizes resume score, job match, application outcomes, assessment evidence, and interview performance.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunDiagnosis}
          className="sb-btn sb-btn-outline sb-btn-sm"
          disabled={running}
        >
          <Sparkles size={14} className={running ? 'spin' : ''} />
          {running ? 'Re-analyzing Evidence...' : 'Re-Run AI Diagnosis'}
        </button>
      </div>

      {error && (
        <div style={{ background: 'var(--color-red-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--color-red)', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Bottleneck Alert Hero Card */}
      <div className="sb-card sb-card-glow" style={{ border: '2px solid rgba(239, 68, 68, 0.5)', background: 'linear-gradient(180deg, rgba(239, 68, 68, 0.08) 0%, rgba(31, 41, 61, 0.95) 100%)', marginBottom: '2rem', padding: '2.5rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', paddingBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ background: 'var(--color-red-bg)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '0.75rem', borderRadius: '12px', color: 'var(--color-red)', display: 'flex' }}>
              <ShieldAlert size={28} />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--color-red)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                🚨 CAREER BOTTLENECK DETECTED
              </span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff' }}>
                {getBottleneckLabel(primaryKey)}
              </h2>
            </div>
          </div>

          <div className="sb-badge sb-badge-purple" style={{ fontSize: '0.9rem', padding: '0.4rem 1rem', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc' }}>
            Confidence Rating: <strong style={{ color: '#ffffff', marginLeft: '0.35rem' }}>{confidencePct}%</strong>
          </div>
        </div>

        {/* Why We Detected It Box */}
        <div style={{ background: 'rgba(17,24,39,0.85)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.75rem' }}>
          <h4 style={{ fontSize: '1rem', color: 'var(--primary-accent)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={18} /> Why We Detected This Bottleneck:
          </h4>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.7' }}>
            {diagnosis?.explanation || `Candidate has strong resume alignment (84/100) and reaches technical interviews in 7 out of 15 applications, but converts 0 into job offers due to technical interview readiness and live coding explanation gaps.`}
          </p>
        </div>

        {/* Evidence Breakdown Grid */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#ffffff' }}>Key Supporting Evidence ({diagnosis?.evidence?.length || 4}):</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
            {(diagnosis?.evidence || [
              'Reached technical interview stage in 7 applications with 0 offer conversions',
              'Technical interview readiness score: 47/100',
              'Standardized coding assessment score: 58/100',
              'High resume alignment score: 84/100'
            ]).map((ev, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '0.85rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                <CheckCircle2 size={18} color="var(--color-red)" style={{ minWidth: '18px' }} />
                <span style={{ color: 'var(--text-main)' }}>{ev}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Issue */}
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', padding: '1rem 1.25rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-yellow)', fontWeight: '600' }}>Secondary Bottleneck:</span>
            <span style={{ fontWeight: '700', color: '#ffffff' }}>{getBottleneckLabel(secondaryKey)}</span>
          </div>
          <span className="sb-badge sb-badge-yellow">Monitored</span>
        </div>

      </div>

      {/* Recommended Next Best Action Hero Card */}
      <div className="sb-card sb-card-glow" style={{ border: '2px solid rgba(16,185,129,0.5)', background: 'linear-gradient(180deg, rgba(16,185,129,0.08) 0%, rgba(31,41,61,0.95) 100%)', padding: '2.5rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div className="sb-badge sb-badge-green" style={{ fontSize: '0.85rem' }}>
            <Target size={14} /> HIGHEST IMPACT NEXT BEST ACTION
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Clock size={16} color="var(--color-green)" />
            <span>Estimated Effort: <strong>{nextAction.estimatedEffortMins || 45} mins</strong></span>
          </div>
        </div>

        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.75rem', color: '#ffffff' }}>
          {nextAction.title || 'Complete Targeted Technical Mock Interview Simulation'}
        </h3>

        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.75rem', lineHeight: '1.7' }}>
          {nextAction.description || 'Focus on JavaScript ES6+ fundamentals, asynchronous event loop questions, DOM manipulation, and live coding explanation aloud.'}
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/interviews" className="sb-btn sb-btn-primary sb-btn-lg" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}>
            Start AI Technical Mock Interview <ArrowRight size={20} />
          </Link>
          <Link to="/action-plan" className="sb-btn sb-btn-secondary sb-btn-lg">
            View 5-Day Action Plan
          </Link>
        </div>
      </div>

    </div>
  );
}
