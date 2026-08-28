import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  ShieldCheck, Users, BarChart3, TrendingUp, AlertTriangle, 
  Target, Award, Search, Filter, Lock 
} from 'lucide-react';

const BOTTLENECK_COLORS = {
  'Technical Interview': '#ef4444',
  'Problem Solving': '#f59e0b',
  'Resume Gap': '#6366f1',
  'Skill Gap': '#06b6d4',
  'Communication': '#10b981'
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.getAdminStats();
        if (res.success && res.analytics) {
          setAnalytics(res.analytics);
        }
      } catch (err) {
        setError(err.message || 'Failed to load organization analytics dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="sb-container" style={{ paddingTop: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: 'var(--primary-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
        <p>Loading Organization Analytics Dashboard...</p>
      </div>
    );
  }

  const kpis = analytics?.kpis || {};
  const bottlenecks = analytics?.bottleneckDistribution || [];
  const skillGaps = analytics?.topSkillGaps || [];
  const funnel = analytics?.applicationFunnel || [];
  const trend = analytics?.improvementTrend || [];
  const candidates = analytics?.anonymizedCandidates || [];

  const filteredCandidates = candidates.filter(c => 
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.primaryBottleneck.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sb-container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '1100px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="sb-badge sb-badge-purple" style={{ marginBottom: '0.5rem' }}>
            <ShieldCheck size={14} /> Organization Admin Portal
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800' }}>Organization Analytics Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Aggregate, privacy-conscious career bottleneck analytics and talent conversion insights.
          </p>
        </div>

        <div className="sb-badge sb-badge-green" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
          <Lock size={14} /> Privacy-Conscious Anonymized Data Active
        </div>
      </div>

      {error && (
        <div style={{ background: 'var(--color-red-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--color-red)', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* KPI CARDS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        
        <div className="sb-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Candidate Pool</span>
            <Users size={18} color="var(--primary-accent)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff' }}>
            {kpis.totalCandidates}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-green)' }}>Active in platform</span>
        </div>

        <div className="sb-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Avg Readiness Score</span>
            <Award size={18} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
            {kpis.avgReadinessScore}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Out of 100 max</span>
        </div>

        <div className="sb-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Top Rejection Stage</span>
            <AlertTriangle size={18} color="var(--color-red)" />
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-red)', height: '2.4rem', display: 'flex', alignItems: 'center' }}>
            {kpis.commonRejectionStage}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-red)' }}>Primary drop-off point</span>
        </div>

        <div className="sb-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Avg Score Gain</span>
            <TrendingUp size={18} color="var(--color-green)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-green)' }}>
            {kpis.avgReadinessImprovement}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-green)' }}>Post Action Plan</span>
        </div>

        <div className="sb-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Interview Conversion</span>
            <Target size={18} color="var(--color-yellow)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-yellow)' }}>
            {kpis.interviewConversionRate}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Offer placement %</span>
        </div>

      </div>

      {/* CHARTS GRID ROW 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Chart 1: Bottleneck Distribution */}
        <div className="sb-card sb-card-glow" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} color="var(--color-red)" /> Career Bottleneck Distribution
          </h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bottlenecks} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip contentStyle={{ background: '#1f293d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Common Technical Skill Gaps */}
        <div className="sb-card sb-card-glow" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={18} color="var(--primary-accent)" /> Top Missing Technical Skill Gaps
          </h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillGaps} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={11} />
                <Tooltip contentStyle={{ background: '#1f293d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* CHARTS GRID ROW 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Chart 3: Application Funnel */}
        <div className="sb-card sb-card-glow" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} color="var(--accent-cyan)" /> Application Conversion Funnel
          </h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="stage" stroke="var(--text-muted)" fontSize={10} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip contentStyle={{ background: '#1f293d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Readiness Improvement Trend */}
        <div className="sb-card sb-card-glow" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="var(--color-green)" /> Monthly Score Improvement Trend
          </h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} />
                <YAxis domain={[50, 100]} stroke="var(--text-muted)" fontSize={11} />
                <Tooltip contentStyle={{ background: '#1f293d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="baselineReadiness" stroke="#6b7280" name="Baseline Score" strokeWidth={2} />
                <Line type="monotone" dataKey="postActionReadiness" stroke="#10b981" name="Post Action Plan" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ANONYMIZED CANDIDATE POOL TABLE */}
      <div className="sb-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Anonymized Candidate Pool Overview</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Privacy-conscious talent cohort tracking.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search candidate ID, role, or bottleneck..."
              style={{ background: 'transparent', border: 'none', color: '#ffffff', outline: 'none', fontSize: '0.85rem', width: '220px' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.85rem' }}>Candidate ID</th>
                <th style={{ padding: '0.85rem' }}>Target Role</th>
                <th style={{ padding: '0.85rem' }}>Readiness Score</th>
                <th style={{ padding: '0.85rem' }}>Primary Bottleneck</th>
                <th style={{ padding: '0.85rem' }}>Action Plan Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.85rem', fontWeight: '700', color: 'var(--primary-accent)' }}>{c.id}</td>
                  <td style={{ padding: '0.85rem', color: '#ffffff' }}>{c.role}</td>
                  <td style={{ padding: '0.85rem' }}>
                    <span className="sb-badge sb-badge-green">{c.readinessScore}/100</span>
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <span className="sb-badge sb-badge-red" style={{ fontSize: '0.75rem' }}>{c.primaryBottleneck}</span>
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <span className={`sb-badge ${c.actionPlanStatus === 'Completed' ? 'sb-badge-green' : 'sb-badge-yellow'}`}>
                      {c.actionPlanStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
