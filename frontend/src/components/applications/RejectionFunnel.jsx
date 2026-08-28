import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowDown, ChevronRight, Filter } from 'lucide-react';

export function RejectionFunnel() {
  const navigate = useNavigate();

  const funnelStages = [
    { stage: '1. Total Applications Submitted', count: 15, pct: 100, color: 'var(--primary-accent)' },
    { stage: '2. Resume Screening Passed', count: 12, pct: 80, color: '#818cf8' },
    { stage: '3. Assessment Round Cleared', count: 9, pct: 60, color: '#a5b4fc' },
    { stage: '4. Technical Interview Reached', count: 7, pct: 46, color: 'var(--color-yellow)', isDropoff: true },
    { stage: '5. Offer Conversion', count: 0, pct: 0, color: 'var(--color-red)' }
  ];

  return (
    <div className="sb-card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-yellow)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
            <Filter size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Application Conversion Funnel Analysis</h3>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Identify exact stage drop-offs across candidate job applications
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/diagnosis')}
          className="sb-btn sb-btn-outline sb-btn-sm" 
          style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: 'var(--color-red)' }}
        >
          <AlertTriangle size={14} /> View Bottleneck Diagnosis
        </button>
      </div>

      {/* Funnel Progress Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {funnelStages.map((stg, idx) => (
          <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.85rem 1.25rem', borderRadius: '10px', border: stg.isDropoff ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem' }}>
              <span style={{ fontWeight: '600', color: '#ffffff' }}>{stg.stage}</span>
              <span style={{ fontWeight: '700', color: stg.color }}>
                {stg.count} Candidates ({stg.pct}%)
              </span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${stg.pct}%`, background: stg.color, borderRadius: '4px', transition: 'width 0.8s ease-in-out' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Major Drop-off Alert Card */}
      <div style={{
        marginTop: '1.25rem',
        padding: '1rem 1.25rem',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertTriangle size={24} color="var(--color-red)" />
          <div>
            <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.925rem' }}>
              CRITICAL BOTTLENECK DETECTED: Technical Interview Stage Drop-off
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              You successfully pass early screens (80% pass rate), but 0% convert at the technical interview stage.
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/diagnosis')}
          className="sb-btn sb-btn-primary sb-btn-sm"
          style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}
        >
          Unblock Bottleneck <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
