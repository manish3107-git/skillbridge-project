import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  Target, CheckCircle2, Clock, Zap, ArrowRight, Calendar, 
  Sparkles, CheckSquare, Square, RefreshCw, AlertCircle 
} from 'lucide-react';

export default function ActionPlan() {
  const navigate = useNavigate();

  const [actionPlan, setActionPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  const fetchActionPlan = async () => {
    try {
      setLoading(true);
      const res = await api.getLatestActionPlan();
      if (res.success && res.actionPlan) {
        setActionPlan(res.actionPlan);
      }
    } catch (err) {
      setError('Failed to load action plan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActionPlan();
  }, []);

  const handleToggleItem = async (itemId, currentCompleted) => {
    setUpdatingId(itemId);
    try {
      const res = await api.updateActionItemStatus(itemId, !currentCompleted);
      if (res.success && res.actionPlan) {
        setActionPlan(res.actionPlan);
      }
    } catch (err) {
      console.error('[ActionPlan] Toggle error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="sb-container" style={{ paddingTop: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: 'var(--primary-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
        <p>Loading Targeted Next Best Action Plan...</p>
      </div>
    );
  }

  const primary = actionPlan?.primaryAction || {};
  const scheduleDays = actionPlan?.scheduleDays || [];
  const secondaryActions = actionPlan?.secondaryActions || [];

  // Calculate completion percentage
  const totalItems = 1 + secondaryActions.length + scheduleDays.length;
  let completedCount = primary.isCompleted ? 1 : 0;
  secondaryActions.forEach(a => { if (a.isCompleted) completedCount++; });
  scheduleDays.forEach(d => { if (d.completed) completedCount++; });

  const progressPct = Math.round((completedCount / totalItems) * 100) || 0;

  return (
    <div className="sb-container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '950px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="sb-badge sb-badge-green" style={{ marginBottom: '0.5rem' }}>
          <Target size={14} /> Unblocking Career Bottleneck
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800' }}>Targeted Next Best Action Plan</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          A focused, step-by-step roadmap directly addressing your detected career bottleneck.
        </p>
      </div>

      {error && (
        <div style={{ background: 'var(--color-red-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--color-red)', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Progress Bar Card */}
      <div className="sb-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontWeight: '700', fontSize: '1rem' }}>Overall Action Plan Progress</span>
          <span className="sb-badge sb-badge-green" style={{ fontSize: '0.85rem' }}>
            {completedCount} / {totalItems} Tasks Completed ({progressPct}%)
          </span>
        </div>

        <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${progressPct}%`, 
              height: '100%', 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              transition: 'width 0.4s ease-in-out' 
            }} 
          />
        </div>
      </div>

      {/* PRIMARY NEXT BEST ACTION HERO CARD */}
      <div className="sb-card sb-card-glow" style={{ border: '2px solid rgba(16,185,129,0.5)', background: 'linear-gradient(180deg, rgba(16,185,129,0.08) 0%, rgba(31,41,61,0.95) 100%)', marginBottom: '2rem', padding: '2.5rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="sb-badge sb-badge-red" style={{ fontSize: '0.8rem' }}>
              PRIORITY: {primary.priority || 'HIGH'}
            </span>
            <span className="sb-badge sb-badge-purple" style={{ fontSize: '0.8rem' }}>
              <Clock size={12} /> {primary.estimatedEffort || '45 Mins'}
            </span>
          </div>

          <button
            type="button"
            className={`sb-btn ${primary.isCompleted ? 'sb-btn-secondary' : 'sb-btn-primary'}`}
            style={{ fontSize: '0.85rem' }}
            onClick={() => handleToggleItem(primary.id || 'primary', primary.isCompleted)}
            disabled={updatingId === (primary.id || 'primary')}
          >
            {primary.isCompleted ? <CheckSquare size={16} color="var(--color-green)" /> : <Square size={16} />}
            {primary.isCompleted ? 'Completed' : 'Mark Primary Action Completed'}
          </button>
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.75rem' }}>
          PRIMARY: {primary.title || 'Complete Targeted Technical Mock Interview Simulation'}
        </h2>

        <p style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1.5rem', lineHeight: '1.7' }}>
          {primary.description}
        </p>

        {/* Reason Box */}
        <div style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary-accent)', fontWeight: '700', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Why This Action Unblocks You:
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {primary.reason || 'You reached technical interviews in 7 applications but converted none to an offer. Practicing live verbal explanation directly resolves this bottleneck.'}
          </p>
        </div>

        {/* Expected Improvement Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Zap size={16} color="var(--color-yellow)" />
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Expected Improvement Area:</span>
          <span className="sb-badge sb-badge-yellow" style={{ fontSize: '0.85rem' }}>
            {primary.expectedImprovementArea || 'Technical Interview Readiness (Target +25 pts)'}
          </span>
        </div>

        <Link to="/interviews" className="sb-btn sb-btn-primary sb-btn-lg" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
          Start AI Mock Interview Right Now <ArrowRight size={20} />
        </Link>
      </div>

      {/* 5-DAY TARGETED ROADMAP SCHEDULE */}
      <div className="sb-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} color="var(--primary-accent)" /> 5-Day Action Plan Roadmap
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {scheduleDays.map((dayItem) => (
            <div 
              key={dayItem.day} 
              style={{ 
                background: dayItem.completed ? 'rgba(16,185,129,0.08)' : 'rgba(17,24,39,0.8)', 
                border: `1px solid ${dayItem.completed ? 'rgba(16,185,129,0.3)' : 'var(--border-color)'}`, 
                padding: '1.25rem', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '1rem' 
              }}
            >
              <button
                type="button"
                onClick={() => handleToggleItem(dayItem.day, dayItem.completed)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, marginTop: '2px', color: dayItem.completed ? 'var(--color-green)' : 'var(--text-muted)' }}
              >
                {dayItem.completed ? <CheckSquare size={22} color="var(--color-green)" /> : <Square size={22} />}
              </button>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <h4 style={{ fontSize: '1.05rem', color: dayItem.completed ? 'var(--color-green)' : '#ffffff' }}>
                    {dayItem.title}
                  </h4>
                  {dayItem.completed && <span className="sb-badge sb-badge-green" style={{ fontSize: '0.7rem' }}>Completed</span>}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{dayItem.task}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUPPORTING SUB-ACTIONS */}
      {secondaryActions.length > 0 && (
        <div className="sb-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Supporting Practice Tasks</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {secondaryActions.map((sub) => (
              <div 
                key={sub.id} 
                style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--border-color)', 
                  padding: '0.85rem 1rem', 
                  borderRadius: '10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  fontSize: '0.9rem' 
                }}
              >
                <button
                  type="button"
                  onClick={() => handleToggleItem(sub.id, sub.isCompleted)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: sub.isCompleted ? 'var(--color-green)' : 'var(--text-muted)' }}
                >
                  {sub.isCompleted ? <CheckSquare size={18} color="var(--color-green)" /> : <Square size={18} />}
                </button>
                <span style={{ textDecoration: sub.isCompleted ? 'line-through' : 'none', color: sub.isCompleted ? 'var(--text-muted)' : 'var(--text-main)' }}>
                  {sub.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
