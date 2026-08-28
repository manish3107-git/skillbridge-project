import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Target, User, FileText, Briefcase, Award, Code, CheckSquare, 
  MessageSquare, TrendingUp, ShieldCheck, LogOut, ChevronRight, Check, AlertTriangle, Activity
} from 'lucide-react';

export function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  // Determine stage completion based on current profile state
  // Demonstrates progression: ✓ completed, → current, ○ upcoming
  const getStageStatus = (path) => {
    const currentPath = location.pathname;
    if (currentPath === path) return 'current';

    const pathOrder = [
      '/profile', '/resume', '/jobs',
      '/assessment',
      '/applications', '/interviews',
      '/diagnosis', '/action-plan', '/progress'
    ];

    const currentIndex = pathOrder.indexOf(currentPath);
    const pathIndex = pathOrder.indexOf(path);

    if (pathIndex < currentIndex) return 'completed';
    if (pathIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { num: '01', path: '/dashboard', label: 'Dashboard', icon: Target }
      ]
    },
    {
      title: 'BUILD YOUR PROFILE',
      items: [
        { num: '02', path: '/profile', label: 'Profile', icon: User },
        { num: '03', path: '/resume', label: 'Resume', icon: FileText },
        { num: '04', path: '/jobs', label: 'Target Job', icon: Briefcase }
      ]
    },
    {
      title: 'UNDERSTAND READINESS',
      items: [
        { num: '05', path: '/assessment', label: 'Assessments', icon: Code }
      ]
    },
    {
      title: 'TRACK YOUR JOURNEY',
      items: [
        { num: '06', path: '/applications', label: 'Applications', icon: Briefcase },
        { num: '07', path: '/interviews', label: 'AI Mock Interview', icon: MessageSquare }
      ]
    },
    {
      title: 'IMPROVE & UNBLOCK',
      items: [
        { num: '08', path: '/diagnosis', label: 'Career Diagnosis', icon: AlertTriangle, isHighlight: true },
        { num: '09', path: '/action-plan', label: 'Action Plan', icon: CheckSquare },
        { num: '10', path: '/progress', label: 'Progress & Gains', icon: TrendingUp }
      ]
    }
  ];

  const adminNavGroup = {
    title: 'ORGANIZATION PORTAL',
    items: [
      { num: '01', path: '/admin/dashboard', label: 'Executive Analytics', icon: ShieldCheck }
    ]
  };

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 140
          }}
        />
      )}

      <aside className={`sb-sidebar ${isMobileOpen ? 'sb-sidebar-mobile-open' : ''}`}>
        {/* Brand Header */}
        <div style={{ padding: '1.5rem 1.25rem 1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--primary-gradient)', padding: '0.5rem', borderRadius: '10px', display: 'flex', boxShadow: 'var(--shadow-glow)' }}>
              <Target size={22} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                Skill<span className="text-gradient">Bridge</span>
              </span>
              <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--primary-accent)', letterSpacing: '0.12em', marginTop: '-2px' }}>
                CAREER INTELLIGENCE
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem' }}>
          {user.role === 'admin' ? (
            <div>
              <div className="sb-nav-section-title">{adminNavGroup.title}</div>
              {adminNavGroup.items.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) => `sb-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <span className="sb-nav-num">{item.num}</span>
                    <Icon size={18} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ) : (
            navGroups.map((group, idx) => (
              <div key={idx} style={{ marginBottom: '1.25rem' }}>
                <div className="sb-nav-section-title">{group.title}</div>
                {group.items.map(item => {
                  const Icon = item.icon;
                  const status = getStageStatus(item.path);

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={({ isActive }) => 
                        `sb-nav-item ${isActive ? 'active' : ''} ${item.isHighlight ? 'sb-nav-item-highlight' : ''}`
                      }
                    >
                      <span className="sb-nav-num">{item.num}</span>
                      <Icon size={18} />
                      <span style={{ flex: 1 }}>{item.label}</span>

                      {/* Stage Status Indicator */}
                      {item.path !== '/dashboard' && (
                        <span className={`sb-status-indicator sb-status-${status}`}>
                          {status === 'completed' && <Check size={12} />}
                          {status === 'current' && <span className="sb-pulse-dot" />}
                          {status === 'upcoming' && '○'}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* User Footer Card */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: user.role === 'admin' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.9rem',
                color: '#ffffff'
              }}>
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {user.name || 'Candidate User'}
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {user.role} Account
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="sb-btn sb-btn-secondary sb-btn-sm"
            style={{ width: '100%', justifyContent: 'center', background: 'rgba(239,68,68,0.1)', color: 'var(--color-red)', borderColor: 'rgba(239,68,68,0.2)' }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
