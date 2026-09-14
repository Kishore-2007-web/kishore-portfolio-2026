import React, { useEffect, useRef } from 'react';
import { GlassPanel } from './GlassPanel';
import { GlassButton } from './GlassButton';

export function ProjectArchiveModal({ project, onClose }) {
  const closeButtonRef = useRef(null);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (project) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      // Focus close button for keyboard accessibility
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [project]);

  // Handle Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && project) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="archive-modal-title"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'archiveModalFadeIn 0.25s ease-out',
      }}
    >
      <style>{`
        @keyframes archiveModalFadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '24px',
        }}
      >
        <GlassPanel
          style={{
            padding: 'clamp(24px, 5vw, 36px)',
            position: 'relative',
            background: '#000000',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 32px 80px -16px rgba(255, 255, 255, 0.15)',
          }}
        >
          {/* Close Button */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close project details"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: '#000000',
              border: '1px solid #ffffff',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              color: '#ffffff',
              fontSize: '1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.color = '#000000';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#000000';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ×
          </button>

          {/* Project Image Preview */}
          {project.image && (
            <div
              style={{
                width: '100%',
                height: '240px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={project.image}
                alt={project.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'grayscale(100%) contrast(1.2) brightness(1.2)',
                }}
              />
            </div>
          )}

          {/* Project Header */}
          <div style={{ marginBottom: '16px' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: '6px',
                background: '#ffffff',
                color: '#000000',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              {project.category || 'Web Development'}
            </span>

            <h3
              id="archive-modal-title"
              style={{
                fontFamily: 'var(--font-display, sans-serif)',
                fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.2,
                marginTop: '4px',
              }}
            >
              {project.title}
            </h3>
          </div>

          {/* Description */}
          <p
            style={{
              color: '#ffffff',
              fontSize: '1.0625rem',
              lineHeight: 1.6,
              marginBottom: '24px',
            }}
          >
            {project.description}
          </p>

          {/* Technologies Pills */}
          {project.technologies && project.technologies.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '10px',
                }}
              >
                Technologies
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      background: '#000000',
                      border: '1px solid #ffffff',
                      fontSize: '0.8125rem',
                      fontFamily: 'var(--font-mono, monospace)',
                      color: '#ffffff',
                      fontWeight: 600,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Conditional Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
            {project.liveDemo && (
              <GlassButton
                href={project.liveDemo}
                variant="primary"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 22px',
                  fontSize: '0.875rem',
                  background: '#ffffff',
                  color: '#000000',
                  fontWeight: 800,
                  border: '1px solid #ffffff',
                }}
              >
                LIVE DEMO ↗
              </GlassButton>
            )}

            {project.github && (
              <GlassButton
                href={project.github}
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 22px',
                  fontSize: '0.875rem',
                  background: '#000000',
                  color: '#ffffff',
                  border: '1px solid #ffffff',
                  fontWeight: 700,
                }}
              >
                GITHUB ↗
              </GlassButton>
            )}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

export default ProjectArchiveModal;
