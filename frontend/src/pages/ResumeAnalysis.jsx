import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  FileText, UploadCloud, CheckCircle2, AlertTriangle, Sparkles, ArrowRight, 
  FileUp, Award, Layers, Search, RefreshCw 
} from 'lucide-react';

export default function ResumeAnalysis() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLatestResume = async () => {
      try {
        const res = await api.getLatestResume();
        if (res.success && res.resume) {
          setResumeData(res.resume);
        }
      } catch (err) {
        console.warn('[ResumeAnalysis] No existing resume analysis found.');
      }
    };
    fetchLatestResume();
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError('');
    setAnalyzing(true);

    try {
      let payload;
      if (selectedFile) {
        payload = new FormData();
        payload.append('resume', selectedFile);
        if (rawText) payload.append('rawText', rawText);
      } else {
        payload = { rawText };
      }

      const res = await api.analyzeResume(payload);
      if (res.success && res.analysis) {
        setResumeData(res.analysis);
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="sb-container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '950px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="sb-badge sb-badge-purple" style={{ marginBottom: '0.5rem' }}>
          <FileText size={14} /> Resume Intelligence Engine
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800' }}>Resume Strength & Keyword Analyzer</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Extract skills, keywords, and detected sections from your PDF resume to maximize keyword screening alignment.
        </p>
      </div>

      {error && (
        <div style={{ background: 'var(--color-red-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--color-red)', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Upload Form + Analysis Results */}
      <div style={{ display: 'grid', gridTemplateColumns: resumeData ? '1fr 1.3fr' : '1fr', gap: '1.5rem' }}>
        
        {/* Left Column: Upload Form */}
        <div className="sb-card sb-card-glow" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Upload or Paste Resume</h3>

          <form onSubmit={handleAnalyze}>
            <div style={{ border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '2rem 1rem', textAlign: 'center', background: 'rgba(17,24,39,0.5)', marginBottom: '1.25rem' }}>
              <FileUp size={36} style={{ color: 'var(--primary-accent)', marginBottom: '0.5rem' }} />
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
                {selectedFile ? selectedFile.name : 'Choose PDF Resume File'}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Supports .pdf documents up to 5MB
              </p>
              <input
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                id="resume-file"
                onChange={e => setSelectedFile(e.target.files[0])}
              />
              <label htmlFor="resume-file" className="sb-btn sb-btn-secondary sb-btn-sm" style={{ cursor: 'pointer' }}>
                Select PDF File
              </label>
            </div>

            <div className="sb-input-group">
              <label className="sb-label">Or Paste Resume Text</label>
              <textarea
                className="sb-textarea"
                style={{ minHeight: '120px', fontSize: '0.85rem' }}
                placeholder="Paste your key resume sections, bullet points, or skills list here..."
                value={rawText}
                onChange={e => setRawText(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="sb-btn sb-btn-primary"
              style={{ width: '100%' }}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <RefreshCw size={16} className="spin" /> Analyzing Resume Text...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Run Resume Intelligence Scan
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Analysis Output */}
        {resumeData && (
          <div className="sb-card sb-card-glow">
            
            {/* Score Banner */}
            <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Resume Strength Score
              </div>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary-accent)', margin: '0.25rem 0' }}>
                {resumeData.strength_score || resumeData.strengthScore}/100
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Evaluated against target role requirements and keyword alignment.
              </p>
            </div>

            {/* Detected Sections */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                Sections Detected ({resumeData.detected_sections?.length || resumeData.detectedSections?.length || 0}):
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(resumeData.detected_sections || resumeData.detectedSections || []).map(sec => (
                  <span key={sec} className="sb-badge sb-badge-green" style={{ fontSize: '0.8rem' }}>
                    ✓ {sec}
                  </span>
                ))}
              </div>
            </div>

            {/* Matched Keywords */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Matched Industry Keywords:
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {(resumeData.matched_keywords || resumeData.matchedKeywords || []).map(kw => (
                  <span key={kw} className="sb-badge sb-badge-purple">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--color-red)' }}>
                Missing Role Keywords:
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {(resumeData.missing_keywords || resumeData.missingKeywords || []).map(kw => (
                  <span key={kw} className="sb-badge sb-badge-red">
                    ✗ {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Improvement Areas */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--color-yellow)' }}>
                Recommended Resume Enhancements:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(resumeData.improvement_areas || resumeData.improvementAreas || []).map((area, idx) => (
                  <div key={idx} style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--color-yellow)" style={{ minWidth: '16px', marginTop: '2px' }} />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Step Link */}
            <Link to="/jobs" className="sb-btn sb-btn-primary" style={{ width: '100%' }}>
              Compare Against Target Job Description <ArrowRight size={18} />
            </Link>

          </div>
        )}

      </div>
    </div>
  );
}
