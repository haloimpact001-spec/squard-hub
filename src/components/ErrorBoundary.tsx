import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught application error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '2rem', 
          textAlign: 'center',
          backgroundColor: '#05070f',
          color: '#f2f4ff'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ff4d4d' }}>System Malfunction</h1>
          <p style={{ marginBottom: '2rem', maxWidth: '500px', color: '#8b95b0' }}>
            The application encountered an unexpected error. Please refresh the page to re-establish your connection to the Squard Hub mainframe.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="gamer-btn-secondary"
            style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
          >
            Reboot System
          </button>
          <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#555' }}>
            Error: {this.state.error?.message}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}