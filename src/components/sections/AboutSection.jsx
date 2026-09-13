import React from 'react';
import { siteConfig } from '../../data/site';
import Lanyard from '../ui/Lanyard/Lanyard';
import { StrokeText } from '../three/StrokeText';
import { GlassPanel } from '../ui/GlassPanel';
import { WebGLErrorBoundary } from '../ui/WebGLErrorBoundary';

export function AboutSection() {
  return (
    <section
      id="about"
      style={{
        padding: '100px 0 60px 0',
        background: '#000000',
        position: 'relative',
      }}
    >
      <div className="container">
        <div className="section-tag">01 — ABOUT</div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
            marginBottom: '60px',
          }}
        >
          {/* Left Column: About Copy */}
          <div>
            <h2 className="section-heading">
              BUILDING WITH REAL PURPOSE & IMPACT.
            </h2>

            <GlassPanel style={{ padding: '32px' }}>
              {siteConfig.aboutCopy.map((paragraph, index) => (
                <p
                  key={index}
                  style={{
                    color: index === 0 ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: index === 0 ? 600 : 400,
                    fontSize: index === 0 ? '1.125rem' : '1rem',
                    lineHeight: 1.7,
                    marginBottom: index === siteConfig.aboutCopy.length - 1 ? 0 : '16px',
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </GlassPanel>
          </div>

          {/* Right Column: Lanyard 3D Card Visual */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '520px',
              minHeight: '420px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <WebGLErrorBoundary height="520px">
              <Lanyard position={[0, 0, 19]} fov={18} gravity={[0, -40, 0]} />
            </WebGLErrorBoundary>
          </div>
        </div>

        {/* Philosophy StrokeText Outline Banner */}
        <StrokeText text={siteConfig.philosophyTag} />
      </div>
    </section>
  );
}
