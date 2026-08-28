import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, ShieldCheck, UserCheck, Activity, Award } from 'lucide-react';

export function TopContextBar({ onMenuClick }) {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case '/dashboard': return 'Candidate Intelligence Overview';
      case '/profile': return 'Career Profile & Skills Matrix';
      case '/resume': return 'Resume Intelligence & ATS Analysis';
      case '/jobs': return 'Target Job Requirement Comparison';
      case '/assessment': return 'Skill Assessments & Live Sandbox';
      case '/applications': return 'Application Funnel & Rejection Tracker';
      case '/interviews': return 'AI Mock Interview Simulator';
      case '/diagnosis': return 'Career Bottleneck Diagnosis Engine';
      case '/action-plan': return 'Next Best Action Improvement Plan';
      case '/progress': return 'Reassessment & Readiness Growth';
      case '/admin/dashboard': return 'Organization Aggregate Analytics';
      default: return 'SkillBridge Workspace';
    }
  };

  return (
    <header className="sb-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={onMenuClick}
          className="sb-btn sb-btn-secondary sb-btn-sm sb-mobile-menu-btn"
          aria-label="Toggle Mobile Navigation"
        >
          <Menu size={20} />
        </button>

        {/* Page Context Title */}
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
            {getPageTitle(location.pathname)}
          </h2>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            SkillBridge AI Platform
          </div>
        </div>
      </div>

      {/* Right Header Status Indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user && user.role === 'candidate' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.825rem',
            fontWeight: '600',
            color: '#a5b4fc'
          }}>
            <Activity size={14} color="var(--primary-accent)" />
            <span>Readiness Score: <strong>74/100</strong></span>
          </div>
        )}

        {user && user.role === 'admin' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(245,158,11,0.15)',
            border: '1px solid rgba(245,158,11,0.3)',
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.825rem',
            fontWeight: '600',
            color: 'var(--color-yellow)'
          }}>
            <ShieldCheck size={14} />
            <span>Admin Executive View</span>
          </div>
        )}

        <button className="sb-btn sb-btn-secondary sb-btn-sm" style={{ padding: '0.5rem', borderRadius: '50%' }}>
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}
