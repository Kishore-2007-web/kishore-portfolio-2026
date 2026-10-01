import React from 'react';
import { siteConfig } from '../../data/site';
import { GlassPanel } from '../ui/GlassPanel';
import { GlassButton } from '../ui/GlassButton';
import { WhatsAppQR } from '../ui/WhatsAppQR';
import { getWhatsAppUrl, WHATSAPP_CONFIG } from '../../utils/whatsapp';
import LightRays from '../reactbits/LightRays/LightRays';
import { WebGLErrorBoundary } from '../ui/WebGLErrorBoundary';
import { Mail, Github, Linkedin, ArrowUpRight } from 'lucide-react';

export function ContactSection() {
  const { contact } = siteConfig;
  const whatsAppUrl = getWhatsAppUrl(
    WHATSAPP_CONFIG.rawNumber,
    WHATSAPP_CONFIG.defaultMessage
  );

  return (
    <section
      id="contact"
      className="contact-section"
      style={{
        padding: '100px 0',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Volumetric LightRays Layer */}
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
            raysColor="var(--text)"
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
          {/* Header */}
          <div style={{ maxWidth: '680px', marginBottom: '32px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 5.5vw, 4rem)',
                fontWeight: 900,
                color: 'var(--text)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                marginBottom: '20px',
                textTransform: 'uppercase',
                textShadow: '0 0 30px rgba(var(--shadow-rgb), 0.8)',
              }}
            >
              LET'S BUILD <br />
              SOMETHING USEFUL.
            </h2>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.125rem',
                lineHeight: 1.6,
                textShadow: '0 0 20px rgba(var(--shadow-rgb), 0.9)',
              }}
            >
              {contact.subheading}
            </p>
          </div>

          {/* Existing Contact Options Row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <GlassButton
              href={`mailto:${contact.email}`}
              variant="secondary"
              aria-label="Send email to Kishore"
              style={{ padding: '12px 22px', fontSize: '0.875rem' }}
            >
              <Mail size={16} />
              <span>EMAIL →</span>
            </GlassButton>

            <GlassButton
              href={contact.github}
              variant="secondary"
              aria-label="Visit Kishore's GitHub profile"
              style={{ padding: '12px 22px', fontSize: '0.875rem' }}
            >
              <Github size={16} />
              <span>GITHUB →</span>
            </GlassButton>

            <GlassButton
              href={contact.linkedin}
              variant="secondary"
              aria-label="Connect with Kishore on LinkedIn"
              style={{ padding: '12px 22px', fontSize: '0.875rem' }}
            >
              <Linkedin size={16} />
              <span>LINKEDIN →</span>
            </GlassButton>
          </div>

          {/* Primary Featured WhatsApp Experience Card */}
          <div className="whatsapp-direct-card">
            {/* Card Header Bar */}
            <div className="whatsapp-card-header">
              <div className="whatsapp-card-tag">
                <span>DIRECT CONNECTION // WHATSAPP</span>
              </div>

              <div className="whatsapp-status-badge">
                <span className="whatsapp-pulse-dot" />
                <span>ACTIVE · FAST RESPONSE</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="whatsapp-card-body">
              <div className="whatsapp-card-content">
                <h3 className="whatsapp-title">
                  TALK TO KISHORE
                </h3>

                <p className="whatsapp-desc">
                  Direct line for project discussions, collaborations, and instant inquiries.
                  Starts a pre-configured conversation directly on WhatsApp.
                </p>

                {/* Pre-filled Message Laboratory Box */}
                <div className="whatsapp-prefilled-pill">
                  <span className="whatsapp-prefilled-label">
                    Pre-filled Message · Editable Before Sending
                  </span>
                  <span className="whatsapp-prefilled-text">
                    "{WHATSAPP_CONFIG.defaultMessage}"
                  </span>
                </div>

                {/* Primary CTA Action */}
                <div className="whatsapp-actions-row">
                  <GlassButton
                    href={whatsAppUrl}
                    variant="primary"
                    className="whatsapp-cta-btn"
                    aria-label="Talk to Kishore on WhatsApp with pre-filled greeting (opens in new tab)"
                  >
                    <span>TALK TO KISHORE</span>
                    <ArrowUpRight size={18} strokeWidth={2.5} />
                  </GlassButton>
                </div>
              </div>

              {/* Desktop QR Code Option */}
              <div className="whatsapp-desktop-qr">
                <WhatsAppQR url={whatsAppUrl} size={110} />
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}

export default ContactSection;
