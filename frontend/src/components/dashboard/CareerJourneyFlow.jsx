import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Activity, AlertTriangle, Target, MessageSquare, TrendingUp } from 'lucide-react';

export function CareerJourneyFlow({ currentStepPath = '/diagnosis' }) {
  const navigate = useNavigate();

  const steps = [
    { label: 'Profile', path: '/profile', status: 'completed' },
    { label: 'Resume', path: '/resume', status: 'completed' },
    { label: 'Target Job', path: '/jobs', status: 'completed' },
    { label: 'Assessment', path: '/assessment', status: 'completed' },
    { label: 'Diagnosis', path: '/diagnosis', status: 'current', highlight: true },
    { label: 'Action Plan', path: '/action-plan', status: 'upcoming' },
    { label: 'Reassessment', path: '/progress', status: 'upcoming' }
  ];

  return (
    <div className="sb-card" style={{ marginBottom: '2rem', padding: '1.5rem 1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Candidate Career Journey Pipeline</h3>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Closed-Loop Bottleneck Detection & Improvement Roadmap
          </div>
        </div>
        <span className="sb-badge sb-badge-purple">Stage 5 of 7 Active</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div
              onClick={() => navigate(step.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                opacity: step.status === 'upcoming' ? 0.6 : 1,
                transition: 'var(--transition-fast)'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: '700',
                background: step.status === 'completed'
                  ? 'rgba(16, 185, 129, 0.2)'
                  : step.status === 'current'
                  ? 'var(--primary-gradient)'
                  : 'rgba(255, 255, 255, 0.06)',
                color: step.status === 'completed'
                  ? 'var(--color-green)'
                  : step.status === 'current'
                  ? '#ffffff'
                  : 'var(--text-muted)',
                border: step.status === 'completed'
                  ? '1px solid rgba(16, 185, 129, 0.4)'
                  : step.status === 'current'
                  ? '1px solid var(--primary-accent)'
                  : '1px solid var(--border-color)',
                boxShadow: step.status === 'current' ? 'var(--shadow-glow)' : 'none'
              }}>
                {step.status === 'completed' ? <Check size={16} /> : idx + 1}
              </div>
              <div>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: step.status === 'current' ? '700' : '600',
                  color: step.status === 'current' ? '#ffffff' : step.status === 'completed' ? 'var(--text-main)' : 'var(--text-muted)'
                }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '0.7rem', color: step.status === 'current' ? 'var(--primary-accent)' : 'var(--text-dim)' }}>
                  {step.status === 'completed' ? 'Done' : step.status === 'current' ? 'Active' : 'Next'}
                </div>
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div style={{ color: 'var(--text-dim)', opacity: 0.4, margin: '0 0.25rem' }}>
                <ArrowRight size={16} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
