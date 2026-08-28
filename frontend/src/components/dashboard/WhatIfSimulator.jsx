import React, { useState } from 'react';
import { Sliders, Sparkles, TrendingUp, Target } from 'lucide-react';

export function WhatIfSimulator({ currentReadiness = 74, currentMatch = 74 }) {
  const [dsaScore, setDsaScore] = useState(55);
  const [interviewScore, setInterviewScore] = useState(71);

  // Compute interactive simulation predictions
  const predictedReadiness = Math.min(96, Math.round(currentReadiness + ((dsaScore - 55) * 0.25) + ((interviewScore - 71) * 0.35)));
  const predictedJobMatch = Math.min(94, Math.round(currentMatch + ((dsaScore - 55) * 0.3) + ((interviewScore - 71) * 0.2)));

  return (
    <div className="sb-card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
          <Sliders size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Interactive Skill Impact What-If Simulator</h3>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Simulate how unblocking your skill gaps increases readiness score and job match %
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
        {/* Sliders Control Box */}
        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>DSA & Algorithmic Practice Score</span>
              <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{dsaScore} / 100</span>
            </div>
            <input
              type="range"
              min="55"
              max="95"
              value={dsaScore}
              onChange={(e) => setDsaScore(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>Technical Mock Interview Readiness</span>
              <span style={{ fontWeight: '700', color: 'var(--primary-accent)' }}>{interviewScore} / 100</span>
            </div>
            <input
              type="range"
              min="71"
              max="98"
              value={interviewScore}
              onChange={(e) => setInterviewScore(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-accent)', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Output Metrics Simulation Box */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="sb-card" style={{ textAlign: 'center', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
              <TrendingUp size={14} color="var(--primary-accent)" /> Predicted Readiness
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#ffffff' }}>
              {predictedReadiness} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
            </div>
            <div style={{ fontSize: '0.775rem', color: 'var(--color-green)', fontWeight: '600', marginTop: '0.25rem' }}>
              +{predictedReadiness - currentReadiness} points estimated gain
            </div>
          </div>

          <div className="sb-card" style={{ textAlign: 'center', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
              <Target size={14} color="var(--color-green)" /> Target Job Match
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#ffffff' }}>
              {predictedJobMatch}%
            </div>
            <div style={{ fontSize: '0.775rem', color: 'var(--color-green)', fontWeight: '600', marginTop: '0.25rem' }}>
              +{predictedJobMatch - currentMatch}% match improvement
            </div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'right', marginTop: '1rem', fontStyle: 'italic' }}>
        * Estimated simulation based on weighted skill formula. Does not guarantee employment.
      </div>
    </div>
  );
}
