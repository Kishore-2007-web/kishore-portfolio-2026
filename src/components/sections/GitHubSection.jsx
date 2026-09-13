import React from 'react';
import { siteConfig } from '../../data/site';
import { GlassPanel } from '../ui/GlassPanel';
import { GlassButton } from '../ui/GlassButton';
import { Particles } from '../three/Particles';
import Galaxy from '../reactbits/Galaxy/Galaxy';
import { Github, ExternalLink } from 'lucide-react';

export function GitHubSection() {
  return (
    <section
      id="github"
      style={{
        padding: '80px 0',
        background: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <Galaxy
          mouseRepulsion={true}
          mouseInteraction={false}
          density={3}
          glowIntensity={0.6}
          saturation={0}
          hueShift={0}
          repulsionStrength={6.5}
          speed={0.2}
          transparent={false}
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-tag">06 — BUILDING IN PUBLIC</div>

        <GlassPanel
          style={{
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '24px',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
              }}
            >
              <Github size={18} />
              <span>@Kishore-2007-web</span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.1,
              }}
            >
              {siteConfig.githubProfile.tagline}
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', maxWidth: '580px', lineHeight: 1.6 }}>
              Exploring open-source software development, sharing experimental codebases, and iterating on projects in the open.
            </p>

            <GlassButton
              href={siteConfig.githubProfile.url}
              variant="primary"
              style={{ marginTop: '12px' }}
            >
              EXPLORE GITHUB PROFILE <ExternalLink size={16} />
            </GlassButton>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}

