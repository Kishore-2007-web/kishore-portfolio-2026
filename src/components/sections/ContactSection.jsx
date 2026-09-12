import React from 'react';
import { siteConfig } from '../../data/site';
import { GlassPanel } from '../ui/GlassPanel';
import { GlassButton } from '../ui/GlassButton';
import { ShapeBlur } from '../three/ShapeBlur';
import { WebGLErrorBoundary } from '../ui/WebGLErrorBoundary';
import { Mail, Github, Linkedin, MessageSquare } from 'lucide-react';

export function ContactSection() {
  const { contact } = siteConfig;

  return (
    <section
      id="contact"
      style={{
        padding: '100px 0',
        background: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ShapeBlur Dynamic Fluid Effect */}
      <WebGLErrorBoundary minHeight="400px">
        <ShapeBlur />
      </WebGLErrorBoundary>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="section-tag">07 — CONTACT</div>

        <GlassPanel style={{ padding: 'clamp(2.5rem, 6vw, 4.5rem)', background: 'rgba(5, 5, 5, 0.85)' }}>
          <div style={{ maxWidth: '640px', marginBottom: '40px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 5.5vw, 4rem)',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                marginBottom: '20px',
                textTransform: 'uppercase',
              }}
            >
              LET'S BUILD <br />
              SOMETHING USEFUL.
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: 1.6 }}>
              {contact.subheading}
            </p>
          </div>

          {/* Contact Methods Glass Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            <GlassButton href={`mailto:${contact.email}`} variant="primary" style={{ justifyContent: 'flex-start', padding: '16px 24px' }}>
              <Mail size={18} />
              <span>EMAIL →</span>
            </GlassButton>

            <GlassButton href={contact.github} variant="secondary" style={{ justifyContent: 'flex-start', padding: '16px 24px' }}>
              <Github size={18} />
              <span>GITHUB →</span>
            </GlassButton>

            <GlassButton href={contact.linkedin} variant="secondary" style={{ justifyContent: 'flex-start', padding: '16px 24px' }}>
              <Linkedin size={18} />
              <span>LINKEDIN →</span>
            </GlassButton>

            <GlassButton href={contact.whatsappLink} variant="secondary" style={{ justifyContent: 'flex-start', padding: '16px 24px' }}>
              <MessageSquare size={18} />
              <span>WHATSAPP →</span>
            </GlassButton>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
