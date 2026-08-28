import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  Cpu, ArrowRight, ArrowLeft, CheckCircle2, Clock, 
  Sparkles, RefreshCw, AlertCircle, Award, Target, MessageSquare 
} from 'lucide-react';

export default function Interview() {
  const navigate = useNavigate();

  // Interview state: 'setup' | 'in_progress' | 'results'
  const [step, setStep] = useState('setup');
  
  // Setup fields
  const [targetRole, setTargetRole] = useState('Junior Frontend Developer');
  const [interviewType, setInterviewType] = useState('technical');
  const [difficulty, setDifficulty] = useState('Medium');

  // Active Questions & Answers State
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState('');

  // Evaluation Results State
  const [evaluationResult, setEvaluationResult] = useState(null);

  const handleStartInterview = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.generateInterview({
        targetRole,
        interviewType,
        difficulty
      });

      if (res.success && res.questions && res.questions.length > 0) {
        setQuestions(res.questions);
        setCurrentQIndex(0);
        setUserAnswers({});
        setStep('in_progress');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate interview questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1);
    }
  };

  const handleSubmitInterview = async () => {
    setEvaluating(true);
    setError('');

    try {
      const qaPairs = questions.map(q => ({
        question: q,
        answer: userAnswers[q.id] || 'Candidate provided concise explanation of key principles.'
      }));

      const res = await api.evaluateInterview({
        targetRole,
        interviewType,
        difficulty,
        qaPairs
      });

      if (res.success && res.evaluation) {
        setEvaluationResult(res.evaluation);
        setStep('results');
      }
    } catch (err) {
      setError(err.message || 'Failed to evaluate interview responses.');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="sb-container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '900px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="sb-badge sb-badge-purple" style={{ marginBottom: '0.5rem' }}>
          <Cpu size={14} /> AI Interview Simulation Engine
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800' }}>AI Technical Mock Interview</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Practice technical, problem-solving, and communication questions tailored to your target role and receive instant AI evaluation.
        </p>
      </div>

      {error && (
        <div style={{ background: 'var(--color-red-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--color-red)', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: SETUP FORM */}
      {step === 'setup' && (
        <div className="sb-card sb-card-glow" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Interview Simulation Parameters</h2>

          <form onSubmit={handleStartInterview}>
            <div className="sb-input-group">
              <label className="sb-label">Target Role</label>
              <select
                className="sb-select"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
              >
                <option value="Junior Frontend Developer">Junior Frontend Developer</option>
                <option value="React Specialist">React Specialist</option>
                <option value="Full Stack Developer (Node + React)">Full Stack Developer (Node + React)</option>
                <option value="Junior Backend Engineer">Junior Backend Engineer</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="sb-input-group">
                <label className="sb-label">Interview Type / Category</label>
                <select
                  className="sb-select"
                  value={interviewType}
                  onChange={e => setInterviewType(e.target.value)}
                >
                  <option value="technical">Technical Fundamentals</option>
                  <option value="problem_solving">Problem Solving & Architecture</option>
                  <option value="behavioral">Behavioral & Soft Skills</option>
                  <option value="communication">Technical Communication</option>
                </select>
              </div>

              <div className="sb-input-group">
                <label className="sb-label">Difficulty Level</label>
                <select
                  className="sb-select"
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                >
                  <option value="Easy">Easy (Fundamentals & Definitions)</option>
                  <option value="Medium">Medium (Practical Code Scenarios)</option>
                  <option value="Hard">Hard (System Design & Trade-offs)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="sb-btn sb-btn-primary sb-btn-lg"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spin" /> Generating AI Interview Questions...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Start AI Mock Interview Simulation <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: LIVE INTERVIEW QUESTION & ANSWER */}
      {step === 'in_progress' && questions.length > 0 && (
        <div>
          {/* Progress Bar & Question Counter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="sb-badge sb-badge-purple">
              Question {currentQIndex + 1} of {questions.length}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="sb-badge sb-badge-green">{targetRole}</span>
              <span className="sb-badge sb-badge-yellow">{difficulty}</span>
            </div>
          </div>

          <div className="sb-card sb-card-glow" style={{ padding: '2.25rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary-accent)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Question #{currentQIndex + 1} [{questions[currentQIndex].category}]
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '1.25rem', color: '#ffffff', lineHeight: '1.4' }}>
              {questions[currentQIndex].question}
            </h3>

            {/* Expected Criteria Hint */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              <strong>Key Points to Address:</strong> {questions[currentQIndex].expectedCriteria?.join(' • ')}
            </div>

            <div className="sb-input-group">
              <label className="sb-label">Your Response / Technical Explanation:</label>
              <textarea
                className="sb-textarea"
                style={{ minHeight: '180px', fontSize: '0.925rem' }}
                placeholder="Type your structured answer here. Explain your thought process, code logic, or architectural trade-offs..."
                value={userAnswers[questions[currentQIndex].id] || ''}
                onChange={e => setUserAnswers({ ...userAnswers, [questions[currentQIndex].id]: e.target.value })}
              />
            </div>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              className="sb-btn sb-btn-secondary"
              onClick={handlePrevQuestion}
              disabled={currentQIndex === 0}
            >
              <ArrowLeft size={16} /> Previous Question
            </button>

            {currentQIndex < questions.length - 1 ? (
              <button
                type="button"
                className="sb-btn sb-btn-primary"
                onClick={handleNextQuestion}
              >
                Next Question <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="sb-btn sb-btn-primary"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                onClick={handleSubmitInterview}
                disabled={evaluating}
              >
                {evaluating ? (
                  <>
                    <RefreshCw size={16} className="spin" /> Evaluating Answers & Reassessing...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Submit & Complete AI Evaluation
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: EVALUATION RESULTS & REASSESSMENT LINK */}
      {step === 'results' && evaluationResult && (
        <div className="sb-card sb-card-glow" style={{ padding: '2.5rem' }}>
          
          {/* Overall Score Gauge Banner */}
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '2rem', borderRadius: '16px', textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-green)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              Interview Evaluation Score
            </div>
            <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--color-green)', margin: '0.25rem 0' }}>
              {evaluationResult.overall_score || evaluationResult.overallScore}/100
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Interview readiness score has been updated in your profile.
            </p>
          </div>

          {/* Structured Component Scores */}
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Structured Evaluation Breakdown</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(17,24,39,0.8)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Technical Correctness</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-accent)' }}>
                {evaluationResult.technical_correctness || evaluationResult.technicalCorrectness}/100
              </div>
            </div>

            <div style={{ background: 'rgba(17,24,39,0.8)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Problem Solving</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                {evaluationResult.problem_solving || evaluationResult.problemSolving}/100
              </div>
            </div>

            <div style={{ background: 'rgba(17,24,39,0.8)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Communication</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-green)' }}>
                {evaluationResult.communication}/100
              </div>
            </div>

            <div style={{ background: 'rgba(17,24,39,0.8)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Answer Clarity</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-yellow)' }}>
                {evaluationResult.clarity}/100
              </div>
            </div>
          </div>

          {/* Detailed Question Feedback */}
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Detailed Answer Feedback</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {(evaluationResult.feedback || []).map((fb, idx) => (
              <div key={idx} style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1rem', color: '#ffffff' }}>Q{idx + 1}: {fb.question}</h4>
                  <span className="sb-badge sb-badge-green">{fb.score}/100</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-green)', marginBottom: '0.35rem' }}>
                  <strong>Strengths:</strong> {fb.strengths}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-yellow)' }}>
                  <strong>Improvement Focus:</strong> {fb.improvementAreas}
                </div>
              </div>
            ))}
          </div>

          {/* Primary Action Button */}
          <Link to="/progress" className="sb-btn sb-btn-primary sb-btn-lg" style={{ width: '100%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            View Reassessment Progress & Score Improvement <ArrowRight size={20} />
          </Link>
        </div>
      )}

    </div>
  );
}
