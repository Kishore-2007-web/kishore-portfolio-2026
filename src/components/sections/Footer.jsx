import React from 'react';
import PixelSnow from '../reactbits/PixelSnow/PixelSnow';

export function Footer() {
  return (
    <footer
      style={{
        position: 'relative',
        padding: '60px 0 40px 0',
        background: '#000000',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <PixelSnow
          color="#ffffff"
          flakeSize={0.014}
          minFlakeSize={1.25}
          pixelResolution={500}
          speed={1.25}
          density={0.75}
          direction={120}
          brightness={2.3}
          depthFade={4.5}
          farPlane={42}
          variant="snowflake"
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
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
          Web · UI/UX · Software · AI · Games · 3D
        </p>

        <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          © 2026 Kishore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}


