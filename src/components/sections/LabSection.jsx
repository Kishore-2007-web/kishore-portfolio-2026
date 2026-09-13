import React, { useState, useEffect } from 'react';
import { MaskedHeading } from '../three/MaskedHeading';
import CircularGallery from '../reactbits/CircularGallery/CircularGallery';
import { WebGLErrorBoundary } from '../ui/WebGLErrorBoundary';
import { GlassPanel } from '../ui/GlassPanel';
import { GlassButton } from '../ui/GlassButton';
import { StatusPill } from '../ui/StatusPill';
import { X, Github, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { labItems as rawLabItems } from '../../data/lab';

export function LabSection() {
  const [selectedExperiment, setSelectedExperiment] = useState(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedExperiment(null);
      }
    };
    if (selectedExperiment) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedExperiment]);

  return (
    <section
      id="lab"
      style={{
        padding: '100px 0 80px 0',
        background: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <div className="section-tag">05 — THE LAB</div>

        <MaskedHeading text="THE LAB" />

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1.0625rem',
            maxWidth: '640px',
            marginBottom: '32px',
            lineHeight: 1.6,
          }}
        >
          Experimental prototypes, 3D modeling studies, WebGL shaders, and creative technology explorations.
          <span style={{ display: 'block', marginTop: '6px', fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            [ Drag horizontally to rotate • Click any experiment card to inspect details ]
          </span>
        </p>

        {/* 3D CircularGallery Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '520px',
            minHeight: '420px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 0%, rgba(0, 0, 0, 0.95) 75%)',
            overflow: 'hidden',
          }}
        >
          <WebGLErrorBoundary height="520px">
            <CircularGallery
              items={rawLabItems}
              bend={2}
              textColor="#ffffff"
              borderRadius={0.12}
              scrollEase={0.07}
              fontUrl="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap"
              font="bold 30px Orbitron"
              scrollSpeed={1.3}
              autoSpin={true}
              autoSpinSpeed={0.8}
              onItemClick={(item) => setSelectedExperiment(item)}
            />
          </WebGLErrorBoundary>
        </div>
      </div>

      {/* Glassmorphism Experiment Details Modal Overlay */}
      {selectedExperiment && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.25s ease-out',
          }}
          onClick={() => setSelectedExperiment(null)}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '720px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '24px',
              animation: 'modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <GlassPanel
              style={{
                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                background: 'rgba(12, 12, 16, 0.92)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6), 0 0 40px rgba(103, 232, 249, 0.15)',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedExperiment(null)}
                aria-label="Close modal"
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  zIndex: 10,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <X size={20} />
              </button>

              {/* Experiment Banner Image */}
              <div
                style={{
                  width: '100%',
                  height: '240px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  marginBottom: '24px',
                  position: 'relative',
                  background: '#111111',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <img
                  src={selectedExperiment.image}
                  alt={selectedExperiment.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(12,12,16,0.9) 0%, transparent 60%)',
                  }}
                />
              </div>

              {/* Badges & Category */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {selectedExperiment.category}
                </span>
                <StatusPill status={selectedExperiment.status || 'RESEARCH PROTOTYPE'} />
              </div>

              {/* Title & Description */}
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '16px',
                  letterSpacing: '-0.02em',
                }}
              >
                {selectedExperiment.title}
              </h3>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1rem',
                  lineHeight: 1.65,
                  marginBottom: '24px',
                }}
              >
                {selectedExperiment.description}
              </p>

              {/* Key Features Checklist */}
              {selectedExperiment.features && selectedExperiment.features.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)',
                      marginBottom: '12px',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Sparkles size={14} color="#67E8F9" />
                    KEY EXPERIMENT HIGHLIGHTS
                  </div>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {selectedExperiment.features.map((feature, fIdx) => (
                      <div
                        key={fIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontSize: '0.9375rem',
                          color: '#e2e8f0',
                        }}
                      >
                        <CheckCircle2 size={16} color="#34d399" style={{ marginTop: '3px', flexShrink: 0 }} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies Used */}
              {selectedExperiment.technologies && selectedExperiment.technologies.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)',
                      marginBottom: '12px',
                      letterSpacing: '0.05em',
                    }}
                  >
                    TECHNOLOGY STACK
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedExperiment.technologies.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          fontSize: '0.8125rem',
                          fontFamily: 'var(--font-mono)',
                          color: '#ffffff',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                {selectedExperiment.github && (
                  <GlassButton href={selectedExperiment.github} variant="primary">
                    <Github size={16} />
                    <span>EXPLORE CODE →</span>
                  </GlassButton>
                )}
                {selectedExperiment.live && (
                  <GlassButton href={selectedExperiment.live} variant="secondary">
                    <ExternalLink size={16} />
                    <span>LIVE EXPERIMENT ↗</span>
                  </GlassButton>
                )}
                <button
                  onClick={() => setSelectedExperiment(null)}
                  style={{
                    marginLeft: 'auto',
                    padding: '10px 20px',
                    borderRadius: '9999px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
                >
                  CLOSE [ESC]
                </button>
              </div>
            </GlassPanel>
          </div>
        </div>
      )}
    </section>
  );
}

export default LabSection;
