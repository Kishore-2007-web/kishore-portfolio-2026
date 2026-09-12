import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function StrokeText({
  text = "PURPOSE OVER FANCY.",
  strokeColor = "#ffffff",
  fillColor = "#F8FAFC",
  strokeWidth = 1.4,
  drawDuration = 1.6,
  fillDelay = 1.0,
  stagger = 0.05,
  ease = "power2.out",
  trigger = "mount",
  fillMode = "wipe",
  fontSize = 128,
  fontWeight = 800,
  letterSpacing = -4,
  loop = true,
  className = ""
}) {
  const containerRef = useRef(null);
  const strokeTextRef = useRef(null);
  const fillRectRef = useRef(null);
  const clipId = useRef(`stroke-wipe-clip-${Math.random().toString(36).substr(2, 9)}`).current;

  useEffect(() => {
    const strokeEl = strokeTextRef.current;
    const clipRect = fillRectRef.current;
    if (!strokeEl) return;

    // Calculate text length for accurate dash animation
    const textLen = strokeEl.getComputedTextLength ? strokeEl.getComputedTextLength() : 1200;
    const dashLength = Math.max(textLen * 1.5, 1200);

    strokeEl.style.strokeDasharray = dashLength;
    strokeEl.style.strokeDashoffset = dashLength;

    if (clipRect) {
      clipRect.setAttribute('width', '0%');
    }

    const tl = gsap.timeline({
      repeat: loop ? -1 : 0,
      repeatDelay: 0.5,
      delay: 0.2
    });

    // 1. Draw outline stroke
    tl.to(strokeEl, {
      strokeDashoffset: 0,
      duration: drawDuration,
      ease: ease
    });

    // 2. Wipe fill overlay
    if (fillMode === 'wipe' && clipRect) {
      tl.to(
        clipRect,
        {
          attr: { width: '100%' },
          duration: drawDuration * 0.75,
          ease: ease
        },
        `-=${Math.max(0.05, drawDuration - fillDelay)}`
      );
    }

    // 3. Pause & reset smoothly for continuous loop
    if (loop) {
      tl.to(clipRect, {
        attr: { width: '0%' },
        duration: 0.7,
        ease: 'power2.inOut',
        delay: 1.8
      });
      tl.to(
        strokeEl,
        {
          strokeDashoffset: dashLength,
          duration: 0.8,
          ease: 'power2.inOut'
        },
        '-=0.4'
      );
    }

    return () => {
      tl.kill();
    };
  }, [text, drawDuration, fillDelay, ease, fillMode, loop]);

  return (
    <div
      ref={containerRef}
      className={`stroke-text-container ${className}`}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2.5rem 1rem',
        overflow: 'hidden',
        background: '#000000'
      }}
    >
      <svg
        viewBox="0 0 1400 220"
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: '100%',
          maxWidth: '1200px',
          height: 'auto',
          display: 'block',
          overflow: 'visible'
        }}
      >
        <defs>
          <clipPath id={clipId}>
            <rect ref={fillRectRef} x="0" y="0" width="0%" height="100%" />
          </clipPath>
        </defs>

        {/* Outline Stroke Text */}
        <text
          ref={strokeTextRef}
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            fontFamily: 'var(--font-display, "Outfit", sans-serif)',
            fontSize: `${fontSize}px`,
            fontWeight: fontWeight,
            letterSpacing: `${letterSpacing}px`,
            textTransform: 'uppercase'
          }}
        >
          {text}
        </text>

        {/* Solid Wiping Fill Text */}
        <g clipPath={`url(#${clipId})`}>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="central"
            fill={fillColor}
            stroke="none"
            style={{
              fontFamily: 'var(--font-display, "Outfit", sans-serif)',
              fontSize: `${fontSize}px`,
              fontWeight: fontWeight,
              letterSpacing: `${letterSpacing}px`,
              textTransform: 'uppercase'
            }}
          >
            {text}
          </text>
        </g>
      </svg>
    </div>
  );
}

export default StrokeText;
