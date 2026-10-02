import React, { useEffect, useRef, useState } from 'react';
import { DigitalBall2D } from './DigitalBall2D';

/**
 * HeroScrollCharacter - 2D Digital Ball with Interactive Eyes
 * 
 * Features:
 * 1. Initially positioned directly on top of the letter "T" in "DIGITAL"
 * 2. Continuously bounces on the "T" with natural physical squash & stretch
 * 3. Interactive eyes track the cursor when resting and look forward during flight
 * 4. User scrolls down -> Character performs a graceful curved leap
 * 5. Soars high over "AL" and "EXPERIENCES THAT MATTER"
 * 6. Lands directly on top of the curvy letters of the marquee loop
 * 7. Fully reversible: Scrolling up returns the character along the same trajectory back to "T"
 * 8. High performance: Uses GPU transforms via RAF with zero React re-renders on scroll
 */
export function HeroScrollCharacter() {
  const wrapperRef = useRef(null);
  const shadowRef = useRef(null);
  const landingShadowRef = useRef(null);

  const [charSize, setCharSize] = useState(38);
  const [isWhiteTheme, setIsWhiteTheme] = useState(false);
  const [ballState, setBallState] = useState({
    flightAngle: 0,
    isFlying: false,
    squashX: 1,
    squashY: 1,
  });

  const animRef = useRef({
    currentProgress: 0,
    targetProgress: 0,
    rafId: null,
    lastTime: performance.now(),
    elapsed: 0,
    flightAngle: 0,
    isFlying: false,
    squashX: 1,
    squashY: 1,
  });

  // 1. Theme Detection
  useEffect(() => {
    const updateTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsWhiteTheme(theme === 'white');
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  // 2. Responsive Size
  useEffect(() => {
    const updateSize = () => {
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
      setCharSize(isMobile ? 30 : isTablet ? 34 : 38);
    };
    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 3. Scroll Listener & RAF Physics Loop (Zero React re-renders during scroll)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
      const threshold = isMobile ? 260 : isTablet ? 300 : 350;
      const progress = Math.max(0, Math.min(1, scrollY / threshold));
      animRef.current.targetProgress = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Cubic Bézier calculation
    const bezier = (t, p0, p1, p2, p3) => {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;
      return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3;
    };

    const lerp = (a, b, f) => a + (b - a) * f;

    const tick = (now) => {
      const dt = (now - animRef.current.lastTime) / 1000;
      animRef.current.lastTime = now;
      animRef.current.elapsed += dt;

      const tEl = document.querySelector('#hero-letter-t');
      const svgEl = document.querySelector('.curved-loop-svg');
      const pathEl = document.querySelector('.curved-loop-svg defs path') || document.querySelector('.curved-loop-svg path');

      if (!tEl || !svgEl || !pathEl || !wrapperRef.current) {
        animRef.current.rafId = requestAnimationFrame(tick);
        return;
      }

      const tRect = tEl.getBoundingClientRect();
      const svgRect = svgEl.getBoundingClientRect();

      // If user has scrolled way past the curved loop, hide to save GPU cycles
      if (tRect.bottom < -300 && svgRect.bottom < -200) {
        wrapperRef.current.style.opacity = '0';
        if (shadowRef.current) shadowRef.current.style.opacity = '0';
        if (landingShadowRef.current) landingShadowRef.current.style.opacity = '0';
        animRef.current.rafId = requestAnimationFrame(tick);
        return;
      }

      wrapperRef.current.style.opacity = '1';

      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
      const size = isMobile ? 30 : isTablet ? 34 : 38;

      // 1. Starting position (directly on the horizontal crossbar of "T" in "DIGITAL")
      const startX = tRect.left + (tRect.width / 2);
      const startY = tRect.top + (isMobile ? 12 : 24);
      const contactY = startY + (size * 0.42);

      // 2. Destination position (directly on top of the curvy letters)
      const scaleX = svgRect.width / 1440;
      const scaleY = svgRect.height / 320;
      const totalLen = typeof pathEl.getTotalLength === 'function' ? pathEl.getTotalLength() : 1677;
      const pt = typeof pathEl.getPointAtLength === 'function' ? pathEl.getPointAtLength(0.68 * totalLen) : { x: 1016, y: 157 };
      
      const destX = svgRect.left + (pt.x * scaleX);
      const destY = svgRect.top + ((pt.y - 48) * scaleY);
      const landingContactY = destY + (size * 0.42);

      // Smooth progress lerp
      const target = animRef.current.targetProgress;
      let curr = animRef.current.currentProgress;
      if (Math.abs(curr - target) > 0.25) {
        curr = target;
      } else {
        curr = lerp(curr, target, 0.24);
      }
      if (Math.abs(curr - target) < 0.001) curr = target;
      animRef.current.currentProgress = curr;

      const p = curr;
      const elapsed = animRef.current.elapsed;

      // Cubic Bézier Trajectory:
      const jumpHeight = isMobile ? 55 : isTablet ? 75 : 95;
      const p0 = { x: startX, y: startY };
      const p1 = { x: startX + (destX - startX) * 0.22, y: startY - jumpHeight };
      const p2 = { x: startX + (destX - startX) * 0.72, y: Math.min(startY, destY) - (jumpHeight * 0.40) };
      const p3 = { x: destX, y: destY };

      let posX = bezier(p, p0.x, p1.x, p2.x, p3.x);
      let posY = bezier(p, p0.y, p1.y, p2.y, p3.y);

      // --- PHYSICAL BOUNCING ON "T" & JUMP DYNAMICS ---
      let idleY = 0;
      let scaleX_trans = 1;
      let scaleY_trans = 1;
      let rotation = 0;
      let bounceShadowPulse = 1;
      let isFlying = p > 0.08 && p < 0.92;
      let flightAngle = 0;

      if (p < 0.08) {
        // ENERGETIC RHYTHMIC BOUNCE ON TOP OF "T"
        const bounceFactor = 1 - (p / 0.08);
        const bounceSpeed = 4.8; // ~80-90 rhythmic bounces per minute
        const bounceH = (isMobile ? 10 : 14) * bounceFactor;

        // Inverted absolute sine gives realistic parabolic gravity bounce
        const phase = (elapsed * bounceSpeed) % Math.PI;
        const normalizedH = Math.sin(phase); // 0 at T touchdown, 1 at apex

        idleY = -normalizedH * bounceH;

        if (normalizedH < 0.20) {
          // Touchdown / hitting the top of the T: squash against the crossbar!
          const squashP = (1 - (normalizedH / 0.20)) * bounceFactor;
          scaleY_trans = 1.0 - (0.22 * squashP);
          scaleX_trans = 1.0 + (0.20 * squashP);
          bounceShadowPulse = 1.35 * (1 + 0.2 * squashP);
        } else {
          // In the air: slight elongation upward
          const stretchP = ((normalizedH - 0.20) / 0.80) * bounceFactor;
          scaleY_trans = 1.0 + (0.08 * stretchP);
          scaleX_trans = 1.0 - (0.05 * stretchP);
          bounceShadowPulse = 1.0 - (0.45 * stretchP);
        }

        rotation = Math.sin(elapsed * 1.8) * 2.5 * bounceFactor;
      } else if (p < 0.20) {
        // Takeoff anticipation & stretch
        const takeoff = (p - 0.08) / 0.12;
        scaleY_trans = 1.0 + Math.sin(takeoff * Math.PI) * 0.12;
        scaleX_trans = 1.0 - Math.sin(takeoff * Math.PI) * 0.06;
      } else if (p > 0.90) {
        // Landed on curvy letters: subtle squash & gentle settling bounce
        const landP = (p - 0.90) / 0.10;
        const settlePhase = (elapsed * 4.0) % Math.PI;
        const settleH = Math.sin(settlePhase);
        idleY = -settleH * (isMobile ? 6 : 8) * landP;
        scaleY_trans = 1.0 - Math.sin(landP * Math.PI) * 0.08;
        scaleX_trans = 1.0 + Math.sin(landP * Math.PI) * 0.06;
      }

      // Flight tilt tangent along trajectory
      if (p >= 0.02 && p <= 0.94) {
        const deltaT = 0.01;
        const nextP = Math.min(1, p + deltaT);
        const prevP = Math.max(0, p - deltaT);
        const dx = bezier(nextP, p0.x, p1.x, p2.x, p3.x) - bezier(prevP, p0.x, p1.x, p2.x, p3.x);
        const dy = bezier(nextP, p0.y, p1.y, p2.y, p3.y) - bezier(prevP, p0.y, p1.y, p2.y, p3.y);
        flightAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        rotation = Math.max(-18, Math.min(24, flightAngle * 0.45));
      }

      // Apply GPU transform directly to wrapper
      wrapperRef.current.style.transform = `translate3d(${posX.toFixed(2)}px, ${(posY + idleY).toFixed(2)}px, 0) translate(-50%, -50%) rotate(${rotation.toFixed(2)}deg)`;

      // Pass state updates to ball when meaningful
      if (Math.abs(animRef.current.squashX - scaleX_trans) > 0.01 || Math.abs(animRef.current.flightAngle - flightAngle) > 1) {
        animRef.current.squashX = scaleX_trans;
        animRef.current.squashY = scaleY_trans;
        animRef.current.flightAngle = flightAngle;
        animRef.current.isFlying = isFlying;
        setBallState({
          flightAngle,
          isFlying,
          squashX: scaleX_trans,
          squashY: scaleY_trans,
        });
      }

      // Contact shadow on "T" with pulsating size & opacity synchronized with the bounce
      if (shadowRef.current) {
        if (p < 0.20) {
          const shadowP = 1 - (p / 0.20);
          const finalShadowScale = shadowP * (p < 0.08 ? bounceShadowPulse : 1 - (p * 4));
          const finalShadowOpacity = Math.max(0, shadowP * (p < 0.08 ? (bounceShadowPulse > 1 ? 0.85 : 0.40) : 0.65));

          shadowRef.current.style.transform = `translate3d(${startX.toFixed(2)}px, ${contactY.toFixed(2)}px, 0) translate(-50%, -50%) scale(${Math.max(0.1, finalShadowScale).toFixed(2)})`;
          shadowRef.current.style.opacity = finalShadowOpacity.toFixed(3);
        } else {
          shadowRef.current.style.opacity = '0';
        }
      }

      // Landing shadow on Curvy Letters
      if (landingShadowRef.current) {
        if (p > 0.75) {
          const landShadowP = (p - 0.75) / 0.25;
          const shadowScale = landShadowP * 0.90;
          landingShadowRef.current.style.transform = `translate3d(${destX.toFixed(2)}px, ${landingContactY.toFixed(2)}px, 0) translate(-50%, -50%) scale(${shadowScale.toFixed(2)})`;
          landingShadowRef.current.style.opacity = Math.max(0, landShadowP * 0.70).toFixed(3);
        } else {
          landingShadowRef.current.style.opacity = '0';
        }
      }

      animRef.current.rafId = requestAnimationFrame(tick);
    };

    animRef.current.rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animRef.current.rafId) cancelAnimationFrame(animRef.current.rafId);
    };
  }, []);

  // Theme-adaptive shadow color
  const shadowColor = isWhiteTheme
    ? 'rgba(0, 0, 0, 0.45)'
    : 'rgba(255, 255, 255, 0.45)';

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 45,
        overflow: 'visible',
      }}
    >
      {/* 1. Pulsating Contact Shadow on top of "T" */}
      <div
        ref={shadowRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${Math.round(charSize * 0.65)}px`,
          height: '6px',
          borderRadius: '50%',
          background: `radial-gradient(ellipse at center, ${shadowColor} 0%, rgba(0,0,0,0) 70%)`,
          opacity: 0.75,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
      />

      {/* 2. Landing Shadow on top of the Curvy Letters */}
      <div
        ref={landingShadowRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${Math.round(charSize * 0.75)}px`,
          height: '7px',
          borderRadius: '50%',
          background: `radial-gradient(ellipse at center, ${shadowColor} 0%, rgba(0,0,0,0) 70%)`,
          opacity: 0,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
      />

      {/* 3. The 2D Ball Character Container */}
      <div
        ref={wrapperRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${charSize}px`,
          height: `${charSize}px`,
          willChange: 'transform',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <DigitalBall2D
          size={charSize}
          isWhiteTheme={isWhiteTheme}
          flightAngle={ballState.flightAngle}
          isFlying={ballState.isFlying}
          squashX={ballState.squashX}
          squashY={ballState.squashY}
        />
      </div>
    </div>
  );
}

export default HeroScrollCharacter;
