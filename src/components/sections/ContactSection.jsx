import React from 'react';
import { siteConfig } from '../../data/site';
import { GlassPanel } from '../ui/GlassPanel';
import { GlassButton } from '../ui/GlassButton';
import LightRays from '../reactbits/LightRays/LightRays';
import { WebGLErrorBoundary } from '../ui/WebGLErrorBoundary';
import { Mail, Github, Linkedin, MessageSquare } from 'lucide-react';

export function ContactSection() {
  const { contact } = siteConfig;

  return (
    <section
      id="contact"
      className="contact-section"
      style={{
        padding: '100px 0',
        background: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Volumetric LightRays Layer (Full Brightness White) */}
      <div
        className="contact-rays"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 1.0,
        }}
      >
        <WebGLErrorBoundary minHeight="100%">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1.5}
            lightSpread={0.9}
            rayLength={1.5}
            followMouse={true}
            mouseInfluence={0.12}
            noiseAmount={0.08}
            distortion={0.05}
            className="custom-rays"
          />
        </WebGLErrorBoundary>
      </div>

      {/* Contact Content Layer */}
      <div className="container contact-content" style={{ position: 'relative', zIndex: 10 }}>
        <div className="section-tag">07 — CONTACT</div>

        {/* Completely Transparent Container so Light is Displayed Fully */}
        <GlassPanel
          style={{
            padding: 'clamp(2rem, 5vw, 4rem)',
            background: 'transparent',
            border: 'none',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            boxShadow: 'none',
          }}
        >
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
                textShadow: '0 0 30px rgba(0, 0, 0, 0.8)',
              }}
            >
              LET'S BUILD <br />
              SOMETHING USEFUL.
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: 1.6, textShadow: '0 0 20px rgba(0, 0, 0, 0.9)' }}>
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

export default ContactSection;
