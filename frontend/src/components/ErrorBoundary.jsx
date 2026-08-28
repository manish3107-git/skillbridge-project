import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[SkillBridge ErrorBoundary Captured Exception]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0b0f19',
          color: '#f9fafb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            maxWidth: '650px',
            width: '100%',
            backgroundColor: '#1f293d',
            border: '2px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '2rem' }}>⚠️</span>
              <h2 style={{ fontSize: '1.5rem', color: '#ef4444', margin: 0 }}>Application Exception Caught</h2>
            </div>
            
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              SkillBridge encountered an unexpected component render error.
            </p>

            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              color: '#f87171',
              overflowX: 'auto',
              marginBottom: '1.5rem'
            }}>
              {this.state.error && this.state.error.toString()}
            </div>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Clear Session & Reload SkillBridge
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
