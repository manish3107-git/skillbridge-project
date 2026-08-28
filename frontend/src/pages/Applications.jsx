import React, { useState } from 'react';
import { RejectionFunnel } from '../components/applications/RejectionFunnel';
import { 
  Briefcase, Filter, ShieldAlert, Plus, CheckCircle2, 
  XCircle, Clock, AlertTriangle, Search, FileText 
} from 'lucide-react';

export default function Applications() {
  const [filterStage, setFilterStage] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Seeded Application History (15 applications)
  const [applications, setApplications] = useState([
    { id: 'app_1', company: 'TechCorp', role: 'Junior React Dev', stage: 'Technical Interview', result: 'Rejected', rejection_stage: 'Technical Interview', interview_score: 45, date: '2026-08-10' },
    { id: 'app_2', company: 'InnoLabs', role: 'Frontend Engineer', stage: 'Technical Interview', result: 'Rejected', rejection_stage: 'Technical Interview', interview_score: 48, date: '2026-08-12' },
    { id: 'app_3', company: 'CloudScale', role: 'UI Developer', stage: 'Technical Interview', result: 'Rejected', rejection_stage: 'Technical Interview', interview_score: 42, date: '2026-08-14' },
    { id: 'app_4', company: 'DataFlex', role: 'Junior Frontend Dev', stage: 'Technical Interview', result: 'Rejected', rejection_stage: 'Technical Interview', interview_score: 50, date: '2026-08-16' },
    { id: 'app_5', company: 'DevStudio', role: 'React Developer', stage: 'Technical Interview', result: 'Rejected', rejection_stage: 'Technical Interview', interview_score: 46, date: '2026-08-18' },
    { id: 'app_6', company: 'WebFlows', role: 'Junior Software Engineer', stage: 'Technical Interview', result: 'Rejected', rejection_stage: 'Technical Interview', interview_score: 44, date: '2026-08-20' },
    { id: 'app_7', company: 'AppWorks', role: 'Frontend Engineer', stage: 'Technical Interview', result: 'Rejected', rejection_stage: 'Technical Interview', interview_score: 49, date: '2026-08-22' },
    { id: 'app_8', company: 'CodeWorks', role: 'React Dev', stage: 'Resume Screen', result: 'Rejected', rejection_stage: 'Resume Screen', interview_score: null, date: '2026-07-28' },
    { id: 'app_9', company: 'NextGen', role: 'Junior Dev', stage: 'Resume Screen', result: 'Rejected', rejection_stage: 'Resume Screen', interview_score: null, date: '2026-07-30' },
    { id: 'app_10', company: 'PixelCraft', role: 'UI Engineer', stage: 'Resume Screen', result: 'Rejected', rejection_stage: 'Resume Screen', interview_score: null, date: '2026-08-01' },
    { id: 'app_11', company: 'SkillLab', role: 'Frontend Trainee', stage: 'Assessment', result: 'Rejected', rejection_stage: 'Assessment', interview_score: 58, date: '2026-08-03' },
    { id: 'app_12', company: 'ByteCode', role: 'Software Engineer', stage: 'Assessment', result: 'Rejected', rejection_stage: 'Assessment', interview_score: 56, date: '2026-08-05' },
    { id: 'app_13', company: 'SoftCorp', role: 'Junior React Dev', stage: 'HR Interview', result: 'Rejected', rejection_stage: 'HR Interview', interview_score: null, date: '2026-08-06' },
    { id: 'app_14', company: 'GlobalTech', role: 'Frontend Specialist', stage: 'HR Interview', result: 'Rejected', rejection_stage: 'HR Interview', interview_score: null, date: '2026-08-07' },
    { id: 'app_15', company: 'PrimeSystems', role: 'Junior UI Engineer', stage: 'HR Interview', result: 'Rejected', rejection_stage: 'HR Interview', interview_score: null, date: '2026-08-08' }
  ]);

  // Form state for adding new app
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('Junior Frontend Developer');
  const [newStage, setNewStage] = useState('Technical Interview');
  const [newResult, setNewResult] = useState('Rejected');

  const handleAddApplication = (e) => {
    e.preventDefault();
    if (!newCompany) return;

    const newApp = {
      id: `app_${Date.now()}`,
      company: newCompany,
      role: newRole,
      stage: newStage,
      result: newResult,
      rejection_stage: newResult === 'Rejected' ? newStage : null,
      interview_score: newStage === 'Technical Interview' ? 65 : null,
      date: new Date().toISOString().split('T')[0]
    };

    setApplications([newApp, ...applications]);
    setShowAddModal(false);
    setNewCompany('');
  };

  const filteredApps = applications.filter(app => {
    const matchesFilter = filterStage === 'ALL' || app.rejection_stage === filterStage;
    const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) || app.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="sb-badge sb-badge-purple" style={{ marginBottom: '0.5rem' }}>Candidate Job Search Pipeline</div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: 0 }}>Application & Rejection Tracker</h1>
        </div>

        <button onClick={() => setShowAddModal(true)} className="sb-btn sb-btn-primary">
          <Plus size={16} /> Log New Application
        </button>
      </div>

      {/* 1. Visual Application Conversion Funnel Component */}
      <RejectionFunnel />

      {/* 2. Applications History Filter & Search */}
      <div className="sb-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['ALL', 'Technical Interview', 'Resume Screen', 'Assessment', 'HR Interview'].map(stg => (
              <button
                key={stg}
                onClick={() => setFilterStage(stg)}
                className={`sb-btn sb-btn-sm ${filterStage === stg ? 'sb-btn-primary' : 'sb-btn-secondary'}`}
              >
                {stg === 'ALL' ? 'All Applications' : stg}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search company or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sb-input"
              style={{ paddingLeft: '2rem', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Applications List Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {filteredApps.map(app => (
            <div key={app.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px', border: app.rejection_stage === 'Technical Interview' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', color: '#ffffff', margin: 0 }}>{app.company}</h4>
                <span className={`sb-badge ${app.result === 'Accepted' ? 'sb-badge-green' : app.result === 'Rejected' ? 'sb-badge-red' : 'sb-badge-yellow'}`}>
                  {app.result}
                </span>
              </div>

              <div style={{ fontSize: '0.875rem', color: 'var(--primary-accent)', fontWeight: '600', marginBottom: '0.5rem' }}>
                {app.role}
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div>Rejection Stage: <strong style={{ color: app.rejection_stage === 'Technical Interview' ? 'var(--color-red)' : 'var(--text-main)' }}>{app.rejection_stage || app.stage}</strong></div>
                {app.interview_score && <div>Interview Score: <strong>{app.interview_score}/100</strong></div>}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Applied On: {app.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Application Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="sb-card" style={{ maxWidth: '480px', width: '100%', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1.25rem' }}>Log Application History</h3>
            <form onSubmit={handleAddApplication}>
              <div className="sb-input-group">
                <label className="sb-label">Company Name</label>
                <input type="text" className="sb-input" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} placeholder="e.g. Acme Corp" required />
              </div>
              <div className="sb-input-group">
                <label className="sb-label">Target Role</label>
                <input type="text" className="sb-input" value={newRole} onChange={(e) => setNewRole(e.target.value)} required />
              </div>
              <div className="sb-input-group">
                <label className="sb-label">Stage Reached</label>
                <select className="sb-select" value={newStage} onChange={(e) => setNewStage(e.target.value)}>
                  <option value="Technical Interview">Technical Interview</option>
                  <option value="Resume Screen">Resume Screen</option>
                  <option value="Assessment">Assessment</option>
                  <option value="HR Interview">HR Interview</option>
                </select>
              </div>
              <div className="sb-input-group">
                <label className="sb-label">Result</label>
                <select className="sb-select" value={newResult} onChange={(e) => setNewResult(e.target.value)}>
                  <option value="Rejected">Rejected</option>
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted / Offer</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="sb-btn sb-btn-primary" style={{ flex: 1 }}>Save Record</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="sb-btn sb-btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
