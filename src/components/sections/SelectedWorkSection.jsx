import React, { useState, useEffect } from 'react';
import { featuredProjects } from '../../data/projects';
import OrbitImages from '../reactbits/OrbitImages/OrbitImages';
import { GlassPanel } from '../ui/GlassPanel';
import { GlassButton } from '../ui/GlassButton';
import { StatusPill } from '../ui/StatusPill';

export function SelectedWorkSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedProject = featuredProjects[selectedIndex] || featuredProjects[0];

  const projectImages = featuredProjects.map(p => p.image);
  const projectLabels = featuredProjects.map(p => `${p.title} (${p.category})`);

  const handleOrbitClick = (idx) => {
    setSelectedIndex(idx);
    setIsModalOpen(true);
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  return (
    <section
      id="work"
      style={{
        padding: '60px 0 40px 0',
        background: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <div className="section-tag">03 — SELECTED WORK</div>

        <h2 className="section-heading" style={{ marginBottom: '12px' }}>
          FEATURED PROJECTS.
        </h2>

        {/* OrbitImages 3D Interactive Project Showcase */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            minHeight: '340px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: '24px',
          }}
        >
          <OrbitImages
            images={projectImages}
            labels={projectLabels}
            onItemClick={handleOrbitClick}
            shape="ellipse"
            baseWidth={1400}
            radiusX={520}
            radiusY={190}
            rotation={-6}
            duration={12}
            itemSize={130}
            responsive={true}
            showPath={true}
            pathColor="rgba(255, 255, 255, 0.3)"
            pathWidth={2}
            centerContent={
              <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  CLICK ANY PROJECT TO INSPECT
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.05em' }}>
                  6 FEATURED BUILDS
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Lightweight Project Details Modal Overlay */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          onClick={() => setIsModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <GlassPanel style={{ padding: '32px', position: 'relative' }}>
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close project details"
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  color: '#ffffff',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                ×
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  0{selectedIndex + 1}
                </span>
                <StatusPill status={selectedProject.status} />
                {selectedProject.teamProject && <StatusPill status="TEAM PROJECT" />}
              </div>

              <h3
                id="modal-project-title"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '8px',
                }}
              >
                {selectedProject.title}
              </h3>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '20px' }}>
                {selectedProject.category}
              </div>

              {/* Project Image Preview */}
              <div
                style={{
                  width: '100%',
                  height: '240px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                }}
              >
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', lineHeight: 1.6, marginBottom: '24px' }}>
                {selectedProject.description}
              </p>

              {/* Technologies */}
              {selectedProject.technologies && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
                  {selectedProject.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        fontSize: '0.8125rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Links */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {selectedProject.live ? (
                  <GlassButton href={selectedProject.live} variant="primary" target="_blank" rel="noopener noreferrer">
                    LIVE DEMO ↗
                  </GlassButton>
                ) : null}

                {selectedProject.github ? (
                  <GlassButton href={selectedProject.github} variant="secondary" target="_blank" rel="noopener noreferrer">
                    VIEW GITHUB →
                  </GlassButton>
                ) : (
                  !selectedProject.live && (
                    <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', padding: '12px 0' }}>
                      [ PRIVATE REPOSITORY ]
                    </span>
                  )
                )}
              </div>
            </GlassPanel>
          </div>
        </div>
      )}
    </section>
  );
}

export default SelectedWorkSection;
