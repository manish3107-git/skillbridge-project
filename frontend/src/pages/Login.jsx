import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const loggedUser = await login(email, password);
      const targetPath = loggedUser.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoCandidate = () => {
    setEmail('rahul@skillbridge.demo');
    setPassword('password123');
  };

  const handleDemoAdmin = () => {
    setEmail('admin@techcorp.com');
    setPassword('password123');
  };

  return (
    <div className="sb-container" style={{ paddingTop: '3rem', paddingBottom: '3rem', maxWidth: '480px' }}>
      <div className="sb-card sb-card-glow" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Welcome Back to <span className="text-gradient">SkillBridge</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to access your Career Readiness Diagnosis & Action Plan
          </p>
        </div>

        {error && (
          <div style={{ background: 'var(--color-red-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--color-red)', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.875rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="sb-input-group">
            <label className="sb-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="email"
                className="sb-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="sb-input-group">
            <label className="sb-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="password"
                className="sb-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="sb-btn sb-btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={submitting}
          >
            {submitting ? 'Signing in...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        {/* Demo Fast Shortcuts */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
            ⚡ DEMO QUICK SHORTCUTS FOR JUDGES & RECRUITERS
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              onClick={handleDemoCandidate}
              className="sb-btn sb-btn-secondary sb-btn-sm"
              style={{ display: 'flex', gap: '0.35rem', fontSize: '0.75rem' }}
            >
              <UserCheck size={14} /> Rahul (Candidate)
            </button>
            <button
              onClick={handleDemoAdmin}
              className="sb-btn sb-btn-secondary sb-btn-sm"
              style={{ display: 'flex', gap: '0.35rem', fontSize: '0.75rem' }}
            >
              <ShieldCheck size={14} /> Admin (TechCorp)
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-accent)', fontWeight: '600' }}>Register here</Link>
        </div>
      </div>
    </div>
  );
}
