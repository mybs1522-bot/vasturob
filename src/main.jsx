import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { LanguageProvider } from './lib/i18n';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[React ErrorBoundary Caught]', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#090d16',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '560px',
            width: '100%',
            backgroundColor: '#111827',
            border: '1px solid #f59e0b',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', color: '#fbbf24' }}>
              VastuScope Auto-Recovery
            </h1>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '20px', lineHeight: '1.6' }}>
              A cached browser state caused a display glitch. Click below to reload and restore normal functionality instantly.
            </p>
            <div style={{
              backgroundColor: '#030712',
              padding: '12px',
              borderRadius: '12px',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#ef4444',
              textAlign: 'left',
              overflowX: 'auto',
              marginBottom: '24px',
              maxHeight: '120px'
            }}>
              {this.state.error?.toString() || 'Unknown Error'}
            </div>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#f59e0b',
                color: '#000000',
                fontWeight: '800',
                fontSize: '13px',
                padding: '12px 28px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.39)'
              }}
            >
              🔄 Refresh &amp; Restore Site Now
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ErrorBoundary>
  </StrictMode>,
);
