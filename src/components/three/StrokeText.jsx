import React from 'react';
import { useInView } from '../../hooks/useInView';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function StrokeText({ text = "PURPOSE OVER FANCY.", className = "" }) {
  const [ref, isInView] = useInView({ threshold: 0.2 });
  const reducedMotion = useReducedMotion();

  const textLines = Array.isArray(text) ? text : text.split('\n');

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        margin: '2rem 0',
      }}
      className={className}
    >
      <svg
        viewBox="0 0 800 240"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          overflow: 'visible',
        }}
      >
        <style>{`
          .stroke-text-path {
            font-family: 'Outfit', sans-serif;
            font-size: 64px;
            font-weight: 900;
            letter-spacing: 0.05em;
            fill: none;
            stroke: #ffffff;
            stroke-width: 2px;
            stroke-dasharray: 600;
            stroke-dashoffset: ${isInView && !reducedMotion ? 0 : 600};
            transition: stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .stroke-text-fill {
            font-family: 'Outfit', sans-serif;
            font-size: 64px;
            font-weight: 900;
            letter-spacing: 0.05em;
            fill: rgba(255, 255, 255, 0.95);
            opacity: ${isInView ? 1 : 0};
            transition: opacity 1.2s ease 1s;
          }
        `}</style>
        
        {textLines.map((line, idx) => (
          <g key={idx} transform={`translate(0, ${70 + idx * 75})`}>
            {/* Outline Path */}
            <text className="stroke-text-path" x="0" y="0">
              {line}
            </text>
            {/* Solid Fill Transition */}
            <text className="stroke-text-fill" x="0" y="0">
              {line}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
