import React, { useState } from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import { GlassButton } from '../ui/GlassButton';
import { StatusPill } from '../ui/StatusPill';

export function InfiniteMenu({ items = [], activeIndex: externalIndex, onSelectIndex }) {
  const [internalIndex, setInternalIndex] = useState(0);

  if (!items || items.length === 0) return null;

  const activeIndex = externalIndex !== undefined ? externalIndex : internalIndex;
  const activeItem = items[activeIndex] || items[0];

  const handleSelect = (idx) => {
    setInternalIndex(idx);
    onSelectIndex?.(idx);
  };

  return (
    <div style={{ width: '100%', margin: '2rem 0' }}>
      {/* Navigation Pills Header */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '16px',
          marginBottom: '24px',
          scrollbarWidth: 'none',
        }}
      >
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={item.id || idx}
              onClick={() => handleSelect(idx)}
              style={{
                padding: '10px 20px',
                borderRadius: '9999px',
                background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isActive ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.08)'}`,
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease',
              }}
            >
              0{idx + 1} — {item.title}
            </button>
          );
        })}
      </div>

      {/* Featured Main Interactive Project Glass Display Panel */}
      <GlassPanel style={{ padding: 'clamp(1.5rem, 4vw, 3rem)', minHeight: '380px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                0{activeIndex + 1}
              </span>
              <StatusPill status={activeItem.status} />
              {activeItem.teamProject && <StatusPill status="TEAM PROJECT" />}
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 700,
                marginBottom: '12px',
                color: '#ffffff',
              }}
            >
              {activeItem.title}
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', marginBottom: '24px', lineHeight: 1.6 }}>
              {activeItem.description}
            </p>

            {/* Technologies */}
            {activeItem.technologies && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
                {activeItem.technologies.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* Verified Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {activeItem.github ? (
                <GlassButton href={activeItem.github} variant="primary">
                  VIEW PROJECT →
                </GlassButton>
              ) : (
                <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', padding: '12px 0' }}>
                  [ PRIVATE REPOSITORY ]
                </span>
              )}

              {activeItem.live ? (
                <GlassButton href={activeItem.live} variant="secondary">
                  LIVE DEMO ↗
                </GlassButton>
              ) : (
                activeItem.status === 'IN DEVELOPMENT' && (
                  <span style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', padding: '12px 0' }}>
                    [ IN DEVELOPMENT ]
                  </span>
                )
              )}
            </div>
          </div>

          {/* Project Preview Decorative Frame */}
          <div
            style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {activeItem.image ? (
              <img
                src={activeItem.image}
                alt={activeItem.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }}
              />
            ) : (
              <>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                    opacity: 0.3,
                  }}
                />
                <div style={{ textAlign: 'center', padding: '20px', zIndex: 1 }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px', opacity: 0.8 }}>⚡</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                    {activeItem.category}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
