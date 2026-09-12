import React from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function CurvedLoop({
  text = "WEB • SOFTWARE • AI • GAME DEVELOPMENT • 3D • BUILD WITH PURPOSE • ",
}) {
  const reducedMotion = useReducedMotion();
  const repeatedText = `${text} ${text} ${text} `;

  return (
    <div
      style={{
        width: '100%',
        height: '160px',
        maxHeight: '260px',
        minHeight: '120px',
        position: 'relative',
        overflow: 'hidden',
        background: '#000000',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '2rem 0',
      }}
    >
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .curved-loop-track {
          display: flex;
          white-space: nowrap;
          animation: marqueeScroll ${reducedMotion ? '0s' : '22s'} linear infinite;
        }
      `}</style>
      
      <div className="curved-loop-track">
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3.5vw, 2.75rem)',
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: 'rgba(255, 255, 255, 0.85)',
            textTransform: 'uppercase',
          }}
        >
          {repeatedText}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3.5vw, 2.75rem)',
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: 'rgba(255, 255, 255, 0.85)',
            textTransform: 'uppercase',
          }}
        >
          {repeatedText}
        </span>
      </div>
    </div>
  );
}
