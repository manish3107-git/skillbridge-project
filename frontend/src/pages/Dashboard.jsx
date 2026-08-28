import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CareerJourneyFlow } from '../components/dashboard/CareerJourneyFlow';
import { WhatIfSimulator } from '../components/dashboard/WhatIfSimulator';
import { 
  Target, AlertTriangle, CheckSquare, MessageSquare, TrendingUp, 
  FileText, ArrowRight, Activity, Clock, Zap, CheckCircle2, Award, Briefcase, ChevronRight 
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [actionPlan, setActionPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [profRes, diagRes, planRes] = await Promise.all([
          api.getCandidateProfile().catch(() => null),
          api.getLatestDiagnosis().catch(() => null),
          api.getLatestActionPlan().catch(() => null)
        ]);

        if (profRes?.profile) setProfile(profRes.profile);
        if (diagRes?.diagnosis) setDiagnosis(diagRes.diagnosis);
        if (planRes?.actionPlan) setActionPlan(planRes.actionPlan);
      } catch (err) {
        console.error('[Dashboard] Data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ width: '44px', height: '44px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: 'var(--primary-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.25rem auto' }} />
        <p style={{ fontWeight: '500' }}>Loading Candidate Intelligence Command Center...</p>
      </div>
    );
  }

  const p = profile || { readiness_score: 74, technical_score: 68, project_score: 72, resume_score: 84, assessment_score: 58, interview_score: 71, communication_score: 74 };
  const primaryBottleneck = diagnosis?.primaryBottleneck || 'TECHNICAL_INTERVIEW';
  const confidence = diagnosis?.confidence || 0.82;
  const primaryAction = actionPlan?.primaryAction || {
    title: 'Complete Targeted Technical Mock Interview Simulation',
    description: 'Focus on JavaScript ES6+ fundamentals, DOM manipulation, asynchronous event loop scheduling, and explaining live code aloud.',
    estimatedEffort: '45 Mins',
    priority: 'HIGH',
    expectedImprovementArea: 'Technical Interview Readiness (Target +25 pts)'
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Hero Welcome Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="sb-badge sb-badge-purple">Candidate Command Center</span>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>• Target Role: Junior Frontend Developer</span>
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Good morning, {user?.name || 'Rahul'}.
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          Your career journey currently has <strong style={{ color: 'var(--color-red)' }}>one primary bottleneck</strong> blocking your job offer conversion.
        </p>
      </div>

      {/* 1. Horizontal Journey Flow Component */}
      <CareerJourneyFlow currentStepPath="/diagnosis" />

      {/* 2. Top Row: Readiness Score & Core Components Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Readiness Score Card */}
        <div className="sb-card sb-card-glow" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            OVERALL CAREER READINESS SCORE
          </div>

          {/* Circle Score Gauge */}
          <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <svg width="150" height="150" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="50" fill="none" stroke="url(#scoreGrad)" strokeWidth="10"
                strokeDasharray="314"
                strokeDashoffset={314 - (314 * (p.readiness_score || 74)) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '2.75rem', fontWeight: '800', color: '#ffffff', lineHeight: 1 }}>
                {p.readiness_score || 74}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ 100</div>
            </div>
          </div>

          <div className="sb-badge sb-badge-green">
            <TrendingUp size={12} /> +13 pts gained this month
          </div>
        </div>

        {/* Component Scores Breakdown Bar List */}
        <div className="sb-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="var(--primary-accent)" />
            6-Component Readiness Score Breakdown
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { label: 'Resume Strength', score: p.resume_score || 84, color: '#6366f1' },
              { label: 'Project Portfolio Evidence', score: p.project_score || 72, color: '#8b5cf6' },
              { label: 'Technical Interview Readiness', score: p.interview_score || 71, color: '#ec4899', isBottleneck: true },
              { label: 'Technical Skills Matrix', score: p.technical_score || 68, color: '#06b6d4' },
              { label: 'Communication Score', score: p.communication_score || 74, color: '#10b981' },
              { label: 'Standardized Coding Assessment', score: p.assessment_score || 58, color: '#f59e0b', isLow: true }
            ].map((comp, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: comp.isBottleneck ? '#ffffff' : 'var(--text-muted)', fontWeight: comp.isBottleneck ? '700' : '500' }}>
                    {comp.label} {comp.isBottleneck && <span style={{ color: 'var(--color-red)', fontSize: '0.75rem' }}>(PRIMARY BOTTLENECK)</span>}
                  </span>
                  <span style={{ fontWeight: '700', color: comp.color }}>{comp.score} / 100</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${comp.score}%`, background: comp.color, borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Hero Card: CAREER BOTTLENECK (Visually Dominant Centerpiece) */}
      <div 
        className="sb-card"
        style={{
          background: 'linear-gradient(135deg, rgba(31,41,61,0.95) 0%, rgba(239,68,68,0.12) 100%)',
          border: '2px solid rgba(239, 68, 68, 0.4)',
          boxShadow: '0 10px 30px rgba(239, 68, 68, 0.15)',
          padding: '2rem',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div className="sb-badge sb-badge-red" style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
            <AlertTriangle size={14} /> 🚨 CAREER DIAGNOSIS DETECTED
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            AI Confidence Rating: <strong style={{ color: '#ffffff' }}>{Math.round(confidence * 100)}%</strong>
          </span>
        </div>

        <div style={{ maxWidth: '800px', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', marginBottom: '0.35rem' }}>
            Primary Career Bottleneck
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', marginBottom: '1rem' }}>
            TECHNICAL_INTERVIEW (Technical Mock Readiness Gap)
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: '1.7', marginBottom: '1.25rem' }}>
            You have strong resume alignment (<strong>84/100</strong>) and reach technical interviews in <strong>7 out of 15 applications</strong>, but convert 0 into job offers due to technical interview answer structure, asynchronous event loop explanation, and live code explanation aloud.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/diagnosis')}
            className="sb-btn sb-btn-primary sb-btn-lg"
            style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)' }}
          >
            <AlertTriangle size={18} /> View Full Diagnosis Report <ChevronRight size={18} />
          </button>
          <button 
            onClick={() => navigate('/interviews')}
            className="sb-btn sb-btn-secondary sb-btn-lg"
          >
            Launch AI Mock Simulator
          </button>
        </div>
      </div>

      {/* 4. NEXT BEST ACTION CARD */}
      <div className="sb-card sb-card-glow" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ background: 'var(--primary-gradient)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
              <Zap size={20} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>NEXT BEST ACTION</h3>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Highest-Impact Unblocking Practice Task
              </div>
            </div>
          </div>
          <span className="sb-badge sb-badge-green">PRIORITY: {primaryAction.priority || 'HIGH'}</span>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.65rem' }}>
            {primaryAction.title}
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem', lineHeight: '1.65', marginBottom: '1.25rem' }}>
            {primaryAction.description}
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)' }}>
              <Clock size={16} color="var(--primary-accent)" />
              <span>Estimated Time: <strong>{primaryAction.estimatedEffort || '45 Mins'}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-green)' }}>
              <Award size={16} />
              <span>Target Gain: <strong>{primaryAction.expectedImprovementArea || 'Technical Interview Readiness (+25 pts)'}</strong></span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/action-plan')}
          className="sb-btn sb-btn-primary sb-btn-lg"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <CheckSquare size={18} /> Execute Action Plan Now <ArrowRight size={18} />
        </button>
      </div>

      {/* 5. What-If Skill Impact Simulator */}
      <WhatIfSimulator currentReadiness={p.readiness_score || 74} currentMatch={74} />

    </div>
  );
}
