import React from 'react';

export function Footer() {
  return (
    <footer
      style={{
        padding: '60px 0 40px 0',
        background: '#000000',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="container" style={{ textAlign: 'center' }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '0.15em',
            color: '#ffffff',
            marginBottom: '12px',
          }}
        >
          KISHORE™
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '8px' }}>
          Built with curiosity. Driven by purpose.
        </p>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', marginBottom: '24px' }}>
          Web · Software · AI · Games · 3D
        </p>

        <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          © 2026 Kishore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
