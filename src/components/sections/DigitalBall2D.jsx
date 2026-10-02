import React, { useEffect, useRef } from 'react';

/**
 * DigitalBall2D - Crisp 2D Digital Ball with Interactive Tracking Eyes
 * 
 * Features:
 * - Smooth 2D ceramic/metallic ball chassis with soft specular sheen
 * - Interactive cursor-tracking eyes with smooth lerped gaze
 * - Natural blinking cycles with expressive pupils
 * - Adapts to Black and White themes
 */
export function DigitalBall2D({
  size = 40,
  isWhiteTheme = false,
  flightAngle = 0,
  isFlying = false,
  squashX = 1,
  squashY = 1,
}) {
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);

  const gazeRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const blinkRef = useRef({ isBlinking: false, timer: 0, nextBlink: 2.5 });

  // Cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isFlying) return; // During flight, eyes look forward
      // Get gaze vector relative to screen center / cursor
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / (window.innerWidth / 2);
      const dy = (e.clientY - cy) / (window.innerHeight / 2);
      gazeRef.current.targetX = Math.max(-1, Math.min(1, dx));
      gazeRef.current.targetY = Math.max(-1, Math.min(1, dy));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isFlying]);

  // Eye animation loop (gaze lerp + blinking)
  useEffect(() => {
    let rafId;
    let lastTime = performance.now();

    const tick = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // 1. Gaze direction
      if (isFlying) {
        // Look in the direction of flight
        const rad = (flightAngle * Math.PI) / 180;
        gazeRef.current.targetX = Math.cos(rad) * 0.9;
        gazeRef.current.targetY = Math.sin(rad) * 0.8;
      }

      const g = gazeRef.current;
      g.x += (g.targetX - g.x) * 0.15;
      g.y += (g.targetY - g.y) * 0.15;

      const maxPupilOffset = size * 0.08;
      const pupilX = g.x * maxPupilOffset;
      const pupilY = g.y * maxPupilOffset;

      if (leftPupilRef.current && rightPupilRef.current) {
        leftPupilRef.current.style.transform = `translate(${pupilX.toFixed(2)}px, ${pupilY.toFixed(2)}px)`;
        rightPupilRef.current.style.transform = `translate(${pupilX.toFixed(2)}px, ${pupilY.toFixed(2)}px)`;
      }

      // 2. Blinking cycle
      blinkRef.current.timer += dt;
      if (!blinkRef.current.isBlinking && blinkRef.current.timer > blinkRef.current.nextBlink) {
        blinkRef.current.isBlinking = true;
        blinkRef.current.timer = 0;
        blinkRef.current.nextBlink = 2.8 + Math.random() * 3.0;

        if (leftEyeRef.current && rightEyeRef.current) {
          leftEyeRef.current.style.transform = 'scaleY(0.1)';
          rightEyeRef.current.style.transform = 'scaleY(0.1)';
        }

        setTimeout(() => {
          if (leftEyeRef.current && rightEyeRef.current) {
            leftEyeRef.current.style.transform = 'scaleY(1)';
            rightEyeRef.current.style.transform = 'scaleY(1)';
          }
          blinkRef.current.isBlinking = false;
        }, 130);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [size, isFlying, flightAngle]);

  // Color schemes for Dark & White themes
  const bodyBg = isWhiteTheme
    ? 'radial-gradient(circle at 35% 30%, #ffffff 0%, #f3f5f8 50%, #d8dee8 100%)'
    : 'radial-gradient(circle at 35% 30%, #ffffff 0%, #e2e8f0 45%, #94a3b8 85%, #64748b 100%)';

  const bodyBorder = isWhiteTheme
    ? '1px solid rgba(0, 0, 0, 0.18)'
    : '1px solid rgba(255, 255, 255, 0.40)';

  const bodyGlow = isWhiteTheme
    ? '0 4px 14px rgba(0, 0, 0, 0.14), inset 0 2px 4px rgba(255, 255, 255, 0.9)'
    : '0 0 16px rgba(0, 229, 255, 0.35), 0 4px 18px rgba(0, 0, 0, 0.6), inset 0 2px 5px rgba(255, 255, 255, 0.8)';

  const eyeColor = isWhiteTheme ? '#0f172a' : '#0a0f1d';
  const catchlightColor = '#ffffff';

  const eyeW = Math.round(size * 0.22);
  const eyeH = Math.round(size * 0.28);
  const pupilSize = Math.round(size * 0.12);
  const catchSize = Math.round(size * 0.05);

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: bodyBg,
        border: bodyBorder,
        boxShadow: bodyGlow,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transformOrigin: '50% 100%',
        transform: `scale(${squashX}, ${squashY})`,
        transition: 'transform 0.05s ease-out',
        userSelect: 'none',
      }}
    >
      {/* Soft Specular Highlight Reflection */}
      <div
        style={{
          position: 'absolute',
          top: `${Math.round(size * 0.08)}px`,
          left: `${Math.round(size * 0.22)}px`,
          width: `${Math.round(size * 0.35)}px`,
          height: `${Math.round(size * 0.18)}px`,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.65)',
          filter: 'blur(1px)',
          transform: 'rotate(-25deg)',
          pointerEvents: 'none',
        }}
      />

      {/* Visor Area with Digital Eyes */}
      <div
        style={{
          position: 'absolute',
          top: '38%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          gap: `${Math.round(size * 0.14)}px`,
        }}
      >
        {/* Left Eye */}
        <div
          ref={leftEyeRef}
          style={{
            width: `${eyeW}px`,
            height: `${eyeH}px`,
            borderRadius: '50%',
            background: eyeColor,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.08s ease',
            boxShadow: isWhiteTheme ? 'inset 0 1px 2px rgba(0,0,0,0.4)' : '0 0 6px rgba(0, 229, 255, 0.4)',
          }}
        >
          {/* Pupil / Gaze Target */}
          <div
            ref={leftPupilRef}
            style={{
              width: `${pupilSize}px`,
              height: `${pupilSize}px`,
              borderRadius: '50%',
              background: isWhiteTheme ? '#00e5ff' : '#00f0ff',
              boxShadow: '0 0 6px #00e5ff',
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              padding: '1px',
            }}
          >
            {/* Catchlight */}
            <div
              style={{
                width: `${catchSize}px`,
                height: `${catchSize}px`,
                borderRadius: '50%',
                background: catchlightColor,
              }}
            />
          </div>
        </div>

        {/* Right Eye */}
        <div
          ref={rightEyeRef}
          style={{
            width: `${eyeW}px`,
            height: `${eyeH}px`,
            borderRadius: '50%',
            background: eyeColor,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.08s ease',
            boxShadow: isWhiteTheme ? 'inset 0 1px 2px rgba(0,0,0,0.4)' : '0 0 6px rgba(0, 229, 255, 0.4)',
          }}
        >
          {/* Pupil / Gaze Target */}
          <div
            ref={rightPupilRef}
            style={{
              width: `${pupilSize}px`,
              height: `${pupilSize}px`,
              borderRadius: '50%',
              background: isWhiteTheme ? '#00e5ff' : '#00f0ff',
              boxShadow: '0 0 6px #00e5ff',
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              padding: '1px',
            }}
          >
            {/* Catchlight */}
            <div
              style={{
                width: `${catchSize}px`,
                height: `${catchSize}px`,
                borderRadius: '50%',
                background: catchlightColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DigitalBall2D;
