import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Building2, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export default function Register() {
  const [role, setRole] = useState('candidate');
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);

    try {
      const createdUser = await register({
        email,
        password,
        role,
        fullName: role === 'candidate' ? fullName : undefined,
        orgName: role === 'admin' ? orgName : undefined,
      });

      const targetPath = createdUser.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sb-container" style={{ paddingTop: '3rem', paddingBottom: '3rem', maxWidth: '520px' }}>
      <div className="sb-card sb-card-glow" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Create Your <span className="text-gradient">SkillBridge</span> Account
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Choose your account role to get started with career bottleneck detection
          </p>
        </div>

        {error && (
          <div style={{ background: 'var(--color-red-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--color-red)', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.875rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            className={`sb-btn ${role === 'candidate' ? 'sb-btn-primary' : 'sb-btn-secondary'}`}
            style={{ width: '100%', fontSize: '0.875rem' }}
            onClick={() => setRole('candidate')}
          >
            <User size={16} /> Job Candidate
          </button>
          <button
            type="button"
            className={`sb-btn ${role === 'admin' ? 'sb-btn-primary' : 'sb-btn-secondary'}`}
            style={{ width: '100%', fontSize: '0.875rem' }}
            onClick={() => setRole('admin')}
          >
            <Building2 size={16} /> Organization / Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {role === 'candidate' ? (
            <div className="sb-input-group">
              <label className="sb-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  className="sb-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="sb-input-group">
              <label className="sb-label">Organization Name</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  className="sb-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. TechCorp Talent Solutions"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

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
            <label className="sb-label">Password (min 6 characters)</label>
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
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            className="sb-btn sb-btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={submitting}
          >
            {submitting ? 'Registering...' : 'Create Account'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-accent)', fontWeight: '600' }}>Sign in here</Link>
        </div>
      </div>
    </div>
  );
}
