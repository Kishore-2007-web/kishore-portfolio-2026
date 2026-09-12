import React from 'react';
import { secondaryProjects } from '../../data/projects';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { StatusPill } from '../ui/StatusPill';

export function MoreBuildsSection() {
  return (
    <section
      id="more-builds"
      style={{
        padding: '60px 0 80px 0',
        background: '#000000',
      }}
    >
      <div className="container">
        <div className="section-tag">04 — MORE BUILDS</div>

        <h2 className="section-heading">
          SECONDARY ARCHIVE.
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
            marginTop: '32px',
          }}
        >
          {secondaryProjects.map((item) => (
            <GlassCard key={item.id} style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {item.category}
                  </span>
                  <StatusPill status={item.status} />
                </div>

                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
                  {item.title}
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  {item.description}
                </p>
              </div>

              {/* Verified Links */}
              <div style={{ display: 'flex', gap: '12px' }}>
                {item.github && (
                  <GlassButton href={item.github} style={{ padding: '8px 16px', fontSize: '0.8125rem' }}>
                    GITHUB →
                  </GlassButton>
                )}
                {item.live && (
                  <GlassButton href={item.live} variant="primary" style={{ padding: '8px 16px', fontSize: '0.8125rem' }}>
                    LIVE ↗
                  </GlassButton>
                )}
                {!item.github && !item.live && (
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    [ PRIVATE PROJECT ]
                  </span>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
