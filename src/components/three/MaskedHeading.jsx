import React from 'react';
import { useInView } from '../../hooks/useInView';

export function MaskedHeading({ text = "THE LAB" }) {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        display: 'inline-block',
        margin: '1.5rem 0',
        filter: 'drop-shadow(0 10px 30px rgba(var(--shadow-rgb),0.15))',
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3.5rem, 10vw, 8rem)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 0.95,
          textTransform: 'uppercase',
          background: 'linear-gradient(135deg, var(--text) 0%, var(--text-muted) 50%, var(--text) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
        }}
      >
        {text}
      </h2>
    </div>
  );
}
