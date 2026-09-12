import React from 'react';

export function StatusPill({ status, type = 'live' }) {
  const getColor = () => {
    const s = (status || '').toLowerCase();
    if (s.includes('live')) return '#10b981'; // green
    if (s.includes('development')) return '#f59e0b'; // amber
    if (s.includes('team')) return '#8b5cf6'; // purple
    if (s.includes('private')) return '#64748b'; // slate
    if (s.includes('experiment')) return '#06b6d4'; // cyan
    return '#94a3b8';
  };

  const dotColor = getColor();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.05em',
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#f5f5f5',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        textTransform: 'uppercase',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          boxShadow: `0 0 8px ${dotColor}`,
        }}
      />
      {status}
    </span>
  );
}
