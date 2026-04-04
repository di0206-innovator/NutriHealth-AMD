import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, info) {
    console.error('NutriLens Ecosystem Failure:', error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="error-boundary" 
          role="alert"
          style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            textAlign: 'center',
            background: 'white'
          }}
        >
          <div style={{ 
            background: '#fff1f2', 
            padding: '32px', 
            borderRadius: '50%', 
            marginBottom: '32px',
            color: '#ff3b30'
          }}>
            <AlertTriangle size={64} />
          </div>
          
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '16px' }}>Metabolic Sync Interrupted</h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', maxWidth: '400px', marginBottom: '40px', lineHeight: 1.6 }}>
            NutriLens encountered an unexpected synaptic failure. Your data remains secure on-device.
          </p>
          
          <button 
            onClick={() => window.location.reload()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '18px 32px',
              background: 'var(--color-primary)',
              color: 'white',
              borderRadius: '20px',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: 800,
              boxShadow: '0 10px 30px rgba(255,45,85,0.25)',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={20} /> Re-calibrate Ecosystem
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
