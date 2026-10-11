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

  // Color schemes for Dark & Light (White) themes:
  // - Dark Mode: Ball turns WHITE (radiant ceramic white with glowing cyan pupils)
  // - Light Mode: Ball turns BLACK (glossy obsidian ceramic with cybernetic cyan pupils)
  const bodyBg = isWhiteTheme
    ? 'radial-gradient(circle at 35% 30%, #3a3d45 0%, #1c1d22 45%, #0d0e12 85%, #050608 100%)'
    : 'radial-gradient(circle at 35% 30%, #ffffff 0%, #f1f5f9 45%, #cbd5e1 85%, #94a3b8 100%)';

  const bodyBorder = isWhiteTheme
    ? '1px solid rgba(0, 0, 0, 0.50)'
    : '1px solid rgba(255, 255, 255, 0.45)';

  const bodyGlow = isWhiteTheme
    ? '0 6px 18px rgba(0, 0, 0, 0.35), 0 2px 6px rgba(0, 0, 0, 0.25), inset 0 2px 4px rgba(255, 255, 255, 0.30)'
    : '0 0 16px rgba(0, 229, 255, 0.35), 0 4px 18px rgba(0, 0, 0, 0.6), inset 0 2px 5px rgba(255, 255, 255, 0.85)';

  const specularBg = isWhiteTheme
    ? 'rgba(255, 255, 255, 0.38)'
    : 'rgba(255, 255, 255, 0.70)';

  const eyeSocketBg = isWhiteTheme ? '#090d16' : '#0a0f1d';
  const eyeSocketBorder = isWhiteTheme ? '1px solid rgba(0, 229, 255, 0.45)' : 'none';
  const eyeSocketShadow = isWhiteTheme
    ? '0 0 8px rgba(0, 229, 255, 0.6), inset 0 1px 2px rgba(0,0,0,0.8)'
    : '0 0 6px rgba(0, 229, 255, 0.4)';

  const pupilBg = '#00f0ff';
  const pupilGlow = isWhiteTheme ? '0 0 8px #00e5ff' : '0 0 6px #00e5ff';
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
        transition: 'transform 0.05s ease-out, background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
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
          background: specularBg,
          filter: 'blur(1px)',
          transform: 'rotate(-25deg)',
          pointerEvents: 'none',
          transition: 'background 0.4s ease',
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
            background: eyeSocketBg,
            border: eyeSocketBorder,
            boxShadow: eyeSocketShadow,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.08s ease, background 0.4s ease, box-shadow 0.4s ease',
          }}
        >
          {/* Pupil / Gaze Target */}
          <div
            ref={leftPupilRef}
            style={{
              width: `${pupilSize}px`,
              height: `${pupilSize}px`,
              borderRadius: '50%',
              background: pupilBg,
              boxShadow: pupilGlow,
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
            background: eyeSocketBg,
            border: eyeSocketBorder,
            boxShadow: eyeSocketShadow,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.08s ease, background 0.4s ease, box-shadow 0.4s ease',
          }}
        >
          {/* Pupil / Gaze Target */}
          <div
            ref={rightPupilRef}
            style={{
              width: `${pupilSize}px`,
              height: `${pupilSize}px`,
              borderRadius: '50%',
              background: pupilBg,
              boxShadow: pupilGlow,
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
