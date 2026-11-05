import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

class StartupErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error('Appointment Booking System failed to render:', error);
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{ maxWidth: 680, margin: '10vh auto', padding: 28, fontFamily: 'Segoe UI, Arial, sans-serif', color: '#293631', background: '#fff', border: '1px solid #e9ece6', borderRadius: 14 }} role="alert">
          <h1 style={{ fontSize: 22, margin: '0 0 8px' }}>The booking system could not start</h1>
          <p style={{ color: '#718076' }}>Refresh the page. If the problem continues, send this error to your developer:</p>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#8a5555', fontSize: 13 }}>{this.state.error.message}</pre>
          <button onClick={() => window.location.reload()} style={{ padding: '9px 14px', border: 0, borderRadius: 7, color: '#fff', background: '#49735d', cursor: 'pointer' }}>Refresh app</button>
        </main>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StartupErrorBoundary>
      <App />
    </StartupErrorBoundary>
  </React.StrictMode>,
);
