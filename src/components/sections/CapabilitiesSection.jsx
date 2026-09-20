import React from 'react';
import { capabilities } from '../../data/capabilities';
import { GlassCard } from '../ui/GlassCard';
import { Globe, Layout, Code, Cpu, Gamepad2, Box } from 'lucide-react';

const iconMap = {
  Globe: Globe,
  Layout: Layout,
  Code: Code,
  Cpu: Cpu,
  Gamepad2: Gamepad2,
  Box: Box,
};

export function CapabilitiesSection() {
  return (
    <section
      id="capabilities"
      style={{
        padding: '80px 0',
        background: '#000000',
      }}
    >
      <div className="container">
        <div className="section-tag">02 — CAPABILITIES</div>
        
        <h2 className="section-heading">
          WHAT I BUILD.
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginTop: '36px',
          }}
        >
          {capabilities.map((item) => {
            const IconComponent = iconMap[item.icon] || Code;
            return (
              <GlassCard key={item.id} style={{ padding: '32px 24px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                      fontWeight: 600,
                    }}
                  >
                    {item.number}
                  </span>
                  <div
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                    }}
                  >
                    <IconComponent size={22} />
                  </div>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: '12px',
                    color: '#ffffff',
                    letterSpacing: '0.02em',
                  }}
                >
                  {item.title}
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
