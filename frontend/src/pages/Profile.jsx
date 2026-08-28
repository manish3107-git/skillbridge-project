import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Briefcase, Award, Code, MapPin, GraduationCap, Target, Save, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Editable Profile fields
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [education, setEducation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await api.getCandidateProfile();
        if (res.success && res.profile) {
          const p = res.profile;
          setProfile(p);
          setFullName(p.full_name || '');
          setHeadline(p.headline || '');
          setTargetRole(p.target_role || '');
          setEducation(p.education || '');
          setExperienceLevel(p.experience_level || '');
          setLocation(p.location || '');
        }
      } catch (err) {
        console.error('[Profile] Failed to fetch candidate profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await api.updateProfile({
        full_name: fullName,
        headline,
        target_role: targetRole,
        education,
        experience_level: experienceLevel,
        location
      });

      if (res.success) {
        setMessage('Career profile updated successfully!');
        setProfile(res.profile);
      }
    } catch (err) {
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="sb-container" style={{ paddingTop: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading Candidate Career Profile...
      </div>
    );
  }

  return (
    <div className="sb-container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="sb-badge sb-badge-purple" style={{ marginBottom: '0.5rem' }}>
          <User size={14} /> Career Profile & Evidence Vault
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800' }}>{fullName || 'Candidate Profile'}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{headline}</p>
      </div>

      {message && (
        <div style={{ background: 'var(--color-green-bg)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--color-green)', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {/* Component Readiness Metrics */}
      {profile && (
        <div className="sb-card sb-card-glow" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>SkillBridge Component Score Breakdown</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'rgba(17,24,39,0.8)', padding: '1rem', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Technical Skills</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-accent)' }}>{profile.technical_score}/100</div>
            </div>

            <div style={{ background: 'rgba(17,24,39,0.8)', padding: '1rem', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Projects / Evidence</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>{profile.project_score}/100</div>
            </div>

            <div style={{ background: 'rgba(17,24,39,0.8)', padding: '1rem', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Resume Strength</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-green)' }}>{profile.resume_score}/100</div>
            </div>

            <div style={{ background: 'rgba(17,24,39,0.8)', padding: '1rem', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Assessments</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-yellow)' }}>{profile.assessment_score}/100</div>
            </div>

            <div style={{ background: 'rgba(17,24,39,0.8)', padding: '1rem', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Interview Readiness</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-red)' }}>{profile.interview_score}/100</div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Details Form */}
      <div className="sb-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Edit Personal & Target Goal Information</h3>

        <form onSubmit={handleSaveProfile}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="sb-input-group">
              <label className="sb-label">Full Name</label>
              <input type="text" className="sb-input" value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>

            <div className="sb-input-group">
              <label className="sb-label">Target Role</label>
              <input type="text" className="sb-input" value={targetRole} onChange={e => setTargetRole(e.target.value)} required />
            </div>
          </div>

          <div className="sb-input-group">
            <label className="sb-label">Headline</label>
            <input type="text" className="sb-input" value={headline} onChange={e => setHeadline(e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="sb-input-group">
              <label className="sb-label">Education</label>
              <input type="text" className="sb-input" value={education} onChange={e => setEducation(e.target.value)} />
            </div>

            <div className="sb-input-group">
              <label className="sb-label">Experience Level</label>
              <input type="text" className="sb-input" value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)} />
            </div>

            <div className="sb-input-group">
              <label className="sb-label">Location</label>
              <input type="text" className="sb-input" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="sb-btn sb-btn-primary" disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      {/* Skills Vault */}
      <div className="sb-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Demonstrated Skills ({profile?.skills?.length || 0})</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          {profile?.skills?.map(sk => (
            <div key={sk.id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: '600' }}>{sk.name}</span>
              <span className={`sb-badge ${sk.rating >= 75 ? 'sb-badge-green' : sk.rating >= 50 ? 'sb-badge-yellow' : 'sb-badge-red'}`} style={{ fontSize: '0.7rem' }}>
                {sk.rating}/100
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Vault */}
      <div className="sb-card">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Practical Projects ({profile?.projects?.length || 0})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {profile?.projects?.map(proj => (
            <div key={proj.id} style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '10px' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{proj.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{proj.description}</p>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary-accent)' }}>
                Tech Stack: {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
