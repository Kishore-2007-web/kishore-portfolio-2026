import React, { useState, useRef } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { labItems } from '../../data/lab';

export function CircularGallery({ items = labItems }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef(null);

  const activeItem = items[selectedIndex] || items[0];

  return (
    <div style={{ width: '100%', margin: '2rem 0' }}>
      {/* Horizontal Carousel Track */}
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          padding: '16px 4px 24px 4px',
          scrollbarWidth: 'none',
          scrollSnapType: 'x mandatory',
        }}
      >
        {items.map((item, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <div
              key={item.id || idx}
              onClick={() => setSelectedIndex(idx)}
              style={{
                flex: '0 0 280px',
                scrollSnapAlign: 'start',
                cursor: 'pointer',
              }}
            >
              <GlassCard
                style={{
                  padding: '16px',
                  borderColor: isSelected ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.08)',
                  background: isSelected ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.02)',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '160px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: '12px',
                    position: 'relative',
                    background: '#111111',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'grayscale(60%) contrast(110%)',
                      transition: 'filter 0.3s ease',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(0,0,0,0.7)',
                      backdropFilter: 'blur(4px)',
                      fontSize: '0.6875rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    0{idx + 1}
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  {item.category}
                </div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>
                  {item.title}
                </h4>
              </GlassCard>
            </div>
          );
        })}
      </div>

      {/* Selected Lab Item Detail Display */}
      {activeItem && (
        <div
          style={{
            marginTop: '16px',
            padding: '20px 24px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              LAB EXPERIMENT #{activeItem.id}
            </span>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '4px' }}>
              {activeItem.description}
            </p>
          </div>
          <span
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: '#ffffff',
            }}
          >
            ● RESEARCH PROTOTYPE
          </span>
        </div>
      )}
    </div>
  );
}
