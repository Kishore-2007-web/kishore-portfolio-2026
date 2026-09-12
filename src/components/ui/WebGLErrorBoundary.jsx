import React from 'react';

export class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("WebGL Component Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="glass-panel"
          style={{
            width: '100%',
            height: this.props.height || '100%',
            minHeight: this.props.minHeight || '240px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle animated background grid for fallback visual */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              opacity: 0.4,
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                marginBottom: '8px',
                letterSpacing: '0.1em',
              }}
            >
              [ INTERACTIVE SCENE STANDBY ]
            </div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: '1rem',
              }}
            >
              {this.props.fallbackText || "Digital Visualizer (GPU Acceleration Offline)"}
            </h4>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
