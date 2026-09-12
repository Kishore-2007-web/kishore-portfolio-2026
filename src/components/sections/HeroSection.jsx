import React from 'react';
import { siteConfig } from '../../data/site';
import { GlassButton } from '../ui/GlassButton';
import AeroShards from '../reactbits/AeroShards/AeroShards';
import { WebGLErrorBoundary } from '../ui/WebGLErrorBoundary';

export function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'var(--header-height)',
        overflow: 'hidden',
        background: '#000000',
      }}
    >
      {/* ReactBits WebGPU AeroShards Background Visual */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <WebGLErrorBoundary minHeight="100vh">
          <AeroShards
            backgroundColor="#120F17"
            shardColor="#ffffff"
            accentColor="#ffffff"
            placement="full"
            flow="stream"
            material="pearl"
            detail="balanced"
            effect="none"
            scale={1}
            spread={1}
            depth={1}
            speed={1}
            spin={1}
            interaction="repel"
            density={1.5}
            shardSize={1.1}
            stretch={1}
            turbulence={1}
            glow={1}
            edgeSoftness={2}
            bloom={0.5}
            grain={0.05}
            chromaticAberration={0.0075}
            transitionDuration={1}
            interactionRadius={1.5}
            interactionStrength={0.5}
            rippleIntensity={1}
            holdToGather={true}
          />
        </WebGLErrorBoundary>
      </div>

      {/* Hero Typographic Content */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center',
          paddingTop: '40px',
          paddingBottom: '40px',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              color: 'var(--text-muted)',
              marginBottom: '16px',
              textTransform: 'uppercase',
            }}
          >
            {siteConfig.name}
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6.5vw, 5rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '24px',
              textTransform: 'uppercase',
            }}
          >
            I BUILD DIGITAL <br />
            EXPERIENCES <br />
            THAT MATTER.
          </h1>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.8125rem, 1.5vw, 0.9375rem)',
              color: 'var(--text-secondary)',
              marginBottom: '16px',
              letterSpacing: '0.05em',
            }}
          >
            {siteConfig.title}
          </div>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.125rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              marginBottom: '36px',
              maxWidth: '540px',
            }}
          >
            {siteConfig.heroParagraph}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <GlassButton href="#work" variant="primary">
              VIEW WORK →
            </GlassButton>
            <GlassButton href="#contact" variant="secondary">
              CONTACT ME ↗
            </GlassButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
