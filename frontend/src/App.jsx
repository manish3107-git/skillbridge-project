import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/layout/Sidebar';
import { TopContextBar } from './components/layout/TopContextBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import ResumeAnalysis from './pages/ResumeAnalysis';
import JobAnalysis from './pages/JobAnalysis';
import Diagnosis from './pages/Diagnosis';
import ActionPlan from './pages/ActionPlan';
import Interview from './pages/Interview';
import Progress from './pages/Progress';
import Applications from './pages/Applications';
import Assessment from './pages/Assessment';
import AdminDashboard from './pages/AdminDashboard';
import { Target, Activity, Cpu, ArrowRight, BarChart3, Compass } from 'lucide-react';

function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-main)' }}>
      {/* Public Header */}
      <header style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(17, 24, 39, 0.8)', backdropFilter: 'blur(12px)', sticky: 'top' }}>
        <div className="sb-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px', padding: '0 1.5rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{ background: 'var(--primary-gradient)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
              <Target size={24} color="#ffffff" />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>
              Skill<span className="text-gradient">Bridge</span>
            </span>
          </Link>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" className="sb-btn sb-btn-secondary sb-btn-sm">Sign In</Link>
            <Link to="/register" className="sb-btn sb-btn-primary sb-btn-sm">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero Body */}
      <main className="sb-container" style={{ paddingTop: '4rem', paddingBottom: '4rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem auto' }}>
          <div className="sb-badge sb-badge-purple" style={{ marginBottom: '1rem' }}>
            <Cpu size={14} /> AI-Powered Career Intelligence Platform
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.15' }}>
            Stop Guessing Why You're Failing Interviews. <br />
            <span className="text-gradient">Detect Your Career Bottleneck.</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.7' }}>
            SkillBridge isn't another LMS or job board. We analyze your resume, job applications, assessments, and interview rejections to uncover your #1 primary bottleneck and deliver your highest-impact next best action.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/register" className="sb-btn sb-btn-primary sb-btn-lg">
              Start Free Diagnosis <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="sb-btn sb-btn-secondary sb-btn-lg">
              Demo Candidate Login
            </Link>
          </div>
        </div>

        {/* Product Loop Highlight */}
        <div className="sb-card sb-card-glow" style={{ padding: '2.5rem', marginTop: '2rem' }}>
          <h3 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '2rem' }}>
            The Closed-Loop SkillBridge Engine
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-accent)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <Compass size={24} />
              </div>
              <h4 style={{ marginBottom: '0.5rem' }}>1. Candidate Evidence</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Upload resume, skills, application history, and interview feedback.</p>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-red)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <Activity size={24} />
              </div>
              <h4 style={{ marginBottom: '0.5rem' }}>2. Detect Bottleneck</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Identify exact stage of failure (Resume, Technical Interview, Skill Gap).</p>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-green)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <Target size={24} />
              </div>
              <h4 style={{ marginBottom: '0.5rem' }}>3. Next Best Action</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Execute 1 high-priority targeted practice activity to unblock progress.</p>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <BarChart3 size={24} />
              </div>
              <h4 style={{ marginBottom: '0.5rem' }}>4. Measure Improvement</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Reassess readiness score and track before vs after readiness gains.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);

  if (isPublicPage || !user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Fallback for unauthenticated state trying to hit app routes */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    );
  }

  return (
    <div className="sb-layout">
      {/* Master Vertical Left Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Wrapper */}
      <div className="sb-main-wrapper">
        {/* Top Context Header Bar */}
        <TopContextBar onMenuClick={() => setIsMobileOpen(true)} />

        {/* Scrollable Main Body */}
        <main className="sb-content-body">
          <Routes>
            {/* Candidate Protected Routes */}
            <Route path="/onboarding" element={<ProtectedRoute allowedRoles={['candidate']}><Onboarding /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['candidate']}><Profile /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['candidate']}><Dashboard /></ProtectedRoute>} />
            <Route path="/resume" element={<ProtectedRoute allowedRoles={['candidate']}><ResumeAnalysis /></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute allowedRoles={['candidate']}><JobAnalysis /></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute allowedRoles={['candidate']}><Applications /></ProtectedRoute>} />
            <Route path="/assessment" element={<ProtectedRoute allowedRoles={['candidate']}><Assessment /></ProtectedRoute>} />
            <Route path="/diagnosis" element={<ProtectedRoute allowedRoles={['candidate']}><Diagnosis /></ProtectedRoute>} />
            <Route path="/action-plan" element={<ProtectedRoute allowedRoles={['candidate']}><ActionPlan /></ProtectedRoute>} />
            <Route path="/interviews" element={<ProtectedRoute allowedRoles={['candidate']}><Interview /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute allowedRoles={['candidate']}><Progress /></ProtectedRoute>} />

            {/* Organization / Admin Protected Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </main>

        <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
          <p>© 2026 SkillBridge Platform. Production-Quality Career Intelligence Architecture.</p>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
