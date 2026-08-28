import React, { useState } from 'react';
import { 
  Activity, CheckCircle2, Play, Award, Clock, 
  HelpCircle, RefreshCw, Sparkles, ArrowRight, Zap 
} from 'lucide-react';

export default function Assessment() {
  const [assessments, setAssessments] = useState([
    {
      id: 'ass_1',
      title: 'Standardized React & Modern JavaScript Assessment',
      category: 'Frontend Engineering',
      score: 58,
      totalQuestions: 10,
      durationMins: 20,
      status: 'Completed',
      lastTaken: '2026-08-15',
      topics: ['Event Loop', 'State Reducers', 'Virtual DOM Diffing', 'Promise Resolution']
    },
    {
      id: 'ass_2',
      title: 'Data Structures & Algorithmic Problem Solving',
      category: 'Computer Science Fundamentals',
      score: 45,
      totalQuestions: 8,
      durationMins: 30,
      status: 'Completed',
      lastTaken: '2026-08-10',
      topics: ['Two Pointers', 'Hashmaps', 'Array Transposition', 'Big-O Complexity']
    },
    {
      id: 'ass_3',
      title: 'Web Performance, CSS & System Design',
      category: 'Web Architecture',
      score: 62,
      totalQuestions: 10,
      durationMins: 25,
      status: 'Completed',
      lastTaken: '2026-08-18',
      topics: ['Core Web Vitals', 'Flexbox & Grid', 'Asset Bundling', 'Lighthouse Optimization']
    }
  ]);

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const sampleQuizQuestions = [
    {
      id: 1,
      question: 'Which queue in the JavaScript runtime takes priority when the call stack clears?',
      options: ['Macrotask Queue (setTimeout)', 'Microtask Queue (Promise.then)', 'RequestAnimationFrame Queue', 'IO Event Queue'],
      correctIndex: 1
    },
    {
      id: 2,
      question: 'Why does React require state updates to be immutable?',
      options: [
        'To speed up garbage collection',
        'To enable shallow reference comparison for component re-rendering optimization',
        'To prevent memory leaks',
        'To enforce strict TypeScript typing'
      ],
      correctIndex: 1
    },
    {
      id: 3,
      question: 'What is the time complexity of looking up a key in a JavaScript Map or Plain Object?',
      options: ['O(N)', 'O(log N)', 'O(1) average case', 'O(N^2)'],
      correctIndex: 2
    }
  ];

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setQuizFinished(false);
  };

  const handleSelectOption = (qId, optionIdx) => {
    setSelectedAnswers({ ...selectedAnswers, [qId]: optionIdx });
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    sampleQuizQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / sampleQuizQuestions.length) * 100);
    setQuizScore(calculatedScore);
    setQuizFinished(true);

    // Update assessment score list
    if (activeQuiz) {
      setAssessments(assessments.map(a => 
        a.id === activeQuiz.id ? { ...a, score: Math.max(a.score, calculatedScore), lastTaken: 'Just now' } : a
      ));
    }
  };

  return (
    <div className="sb-container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '1000px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="sb-badge sb-badge-purple" style={{ marginBottom: '0.5rem' }}>
          <Activity size={14} /> Standardized Skill Assessments
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800' }}>Skill & Problem Solving Assessments</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Benchmark your technical readiness with standardized role-specific coding and domain assessments.
        </p>
      </div>

      {/* ASSESSMENT CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {assessments.map((ass) => (
          <div key={ass.id} className="sb-card sb-card-glow" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="sb-badge sb-badge-purple" style={{ fontSize: '0.75rem' }}>{ass.category}</span>
                <span className={`sb-badge ${ass.score >= 60 ? 'sb-badge-green' : 'sb-badge-yellow'}`}>
                  Score: {ass.score}/100
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.75rem' }}>
                {ass.title}
              </h3>

              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <span><HelpCircle size={14} /> {ass.totalQuestions} Questions</span>
                <span><Clock size={14} /> {ass.durationMins} Mins</span>
              </div>

              {/* Topics Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                {ass.topics.map((t, idx) => (
                  <span key={idx} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleStartQuiz(ass)}
              className="sb-btn sb-btn-primary sb-btn-sm"
              style={{ width: '100%' }}
            >
              <Play size={14} /> Retake Assessment Quiz
            </button>
          </div>
        ))}
      </div>

      {/* QUIZ RUNNER MODAL */}
      {activeQuiz && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="sb-card sb-card-glow" style={{ width: '600px', maxWidth: '100%', padding: '2.25rem' }}>
            
            {!quizFinished ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span className="sb-badge sb-badge-purple">Question {currentQIndex + 1} of {sampleQuizQuestions.length}</span>
                  <button onClick={() => setActiveQuiz(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem', color: '#ffffff' }}>
                  {sampleQuizQuestions[currentQIndex].question}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  {sampleQuizQuestions[currentQIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(sampleQuizQuestions[currentQIndex].id, idx)}
                      style={{
                        textAlign: 'left',
                        padding: '0.85rem 1.15rem',
                        borderRadius: '10px',
                        border: selectedAnswers[sampleQuizQuestions[currentQIndex].id] === idx ? '2px solid var(--primary-accent)' : '1px solid var(--border-color)',
                        background: selectedAnswers[sampleQuizQuestions[currentQIndex].id] === idx ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                        color: selectedAnswers[sampleQuizQuestions[currentQIndex].id] === idx ? '#ffffff' : 'var(--text-main)',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      {String.fromCharCode(65 + idx)}. {opt}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex(prev => prev - 1)}
                    className="sb-btn sb-btn-secondary sb-btn-sm"
                  >
                    Previous
                  </button>

                  {currentQIndex < sampleQuizQuestions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQIndex(prev => prev + 1)}
                      className="sb-btn sb-btn-primary sb-btn-sm"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitQuiz}
                      className="sb-btn sb-btn-primary sb-btn-sm"
                      style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                    >
                      Submit Assessment
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--color-green)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Assessment Completed!</h3>
                <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-green)', marginBottom: '1rem' }}>
                  {quizScore}/100
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Your assessment score has been recorded and factored into your component readiness breakdown.
                </p>
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="sb-btn sb-btn-primary"
                >
                  Done & Close
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
