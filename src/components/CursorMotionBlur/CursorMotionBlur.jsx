import React, { useEffect, useRef } from 'react';
import './CursorMotionBlur.css';

/**
 * CursorMotionBlur
 * Faithful JavaScript/Canvas port of the Windhawk C++ "Cursor Motion Blur" mod by TheatriChris.
 * 
 * Features:
 * - Dynamic velocity calculation with smearing hysteresis (trigger & stop velocities).
 * - Chaikin subdivision: Mathematically curves rigid mouse coordinates into a dense bezier curve.
 * - Procedural mesh generation: Perpendicular normal ribbon generation with outer outline and inner core.
 * - Perfectly rounded head caps matching the cursor origin.
 * - Unified winding geometry rendering to eliminate overlapping opacity seams.
 * - Frame-rate independent scaling for 60Hz, 120Hz, 144Hz, and 240Hz displays.
 */
export default function CursorMotionBlur({
  triggerVelocity = 25.0,
  stopVelocity = 10.0,
  tailOffsetX = 6,
  tailOffsetY = 10,
  tailLength = 10,
  outlineWidth = 10.0,
  coreWidth = 6.0,
  outlineColor = 'rgba(0, 0, 0, 0.86)',
  coreColor = 'rgba(255, 255, 255, 0.86)',
  accentGlow = false,
  accentColor = '#67E8F9',
  accentWidth = 2.0,
  blendMode = 'normal',
  zIndex = 999999
}) {
  const canvasRef = useRef(null);
  const mousePosRef = useRef({ x: -1000, y: -1000 });
  const lastPosRef = useRef({ x: -1000, y: -1000 });
  const historyRef = useRef([]);
  const isSmearingRef = useRef(false);
  const lowVelocityFramesRef = useRef(0);
  const needsClearRef = useRef(false);
  const lastTimeRef = useRef(0);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function handleMouseMove(e) {
      mousePosRef.current.x = e.clientX;
      mousePosRef.current.y = e.clientY;

      if (!hasMovedRef.current) {
        lastPosRef.current.x = e.clientX;
        lastPosRef.current.y = e.clientY;
        hasMovedRef.current = true;
      }
    }

    function handleMouseLeave() {
      isSmearingRef.current = false;
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleMouseLeave);

    let animId;

    function animate(currentTime) {
      animId = requestAnimationFrame(animate);

      if (!hasMovedRef.current) return;

      const pt = mousePosRef.current;
      const last = lastPosRef.current;
      const dx = pt.x - last.x;
      const dy = pt.y - last.y;
      const rawVelocity = Math.hypot(dx, dy);
      lastPosRef.current = { x: pt.x, y: pt.y };

      // Normalize velocity to 60fps tick rate (~16.67ms) so high refresh monitors (120/144/240Hz)
      // trigger identically to standard 60Hz.
      const dt = lastTimeRef.current ? Math.min(Math.max(currentTime - lastTimeRef.current, 4), 60) : 16.667;
      lastTimeRef.current = currentTime;
      const velocity = rawVelocity * (16.667 / dt);

      // Trigger / hysteresis logic exactly from Windhawk C++ mod:
      if (velocity > triggerVelocity && !isSmearingRef.current) {
        isSmearingRef.current = true;
        lowVelocityFramesRef.current = 0;
      } else if (velocity < stopVelocity && isSmearingRef.current) {
        lowVelocityFramesRef.current++;
        if (lowVelocityFramesRef.current > 2) {
          isSmearingRef.current = false;
        }
      } else if (velocity >= stopVelocity && isSmearingRef.current) {
        lowVelocityFramesRef.current = 0;
      }

      const history = historyRef.current;
      if (isSmearingRef.current) {
        history.unshift({ x: pt.x, y: pt.y });
        while (history.length > tailLength) {
          history.pop();
        }
      } else {
        if (history.length > 0) {
          history.pop();
          if (history.length > 0) {
            history.pop();
          }
        }
      }

      const isDrawing = (isSmearingRef.current || history.length > 0) && history.length >= 2;

      if (isDrawing) {
        // CHAIKIN SUBDIVISION: Mathematically curve the rigid mouse coordinates into a dense bezier curve
        let smoothed = history.map(p => ({
          x: p.x + tailOffsetX,
          y: p.y + tailOffsetY
        }));

        for (let iter = 0; iter < 2; iter++) {
          if (smoothed.length < 3) break;
          const next_s = [smoothed[0]];
          for (let i = 0; i < smoothed.length - 1; i++) {
            const p0 = smoothed[i];
            const p1 = smoothed[i + 1];
            next_s.push({
              x: 0.75 * p0.x + 0.25 * p1.x,
              y: 0.75 * p0.y + 0.25 * p1.y
            });
            next_s.push({
              x: 0.25 * p0.x + 0.75 * p1.x,
              y: 0.25 * p0.y + 0.75 * p1.y
            });
          }
          next_s.push(smoothed[smoothed.length - 1]);
          smoothed = next_s;
        }

        // PROCEDURAL MESH GENERATION: Calculate perpendicular normals to build the left and right walls of the streak
        const s_len = smoothed.length;
        const leftOutline = [];
        const rightOutline = [];
        const leftCore = [];
        const rightCore = [];

        for (let i = 0; i < s_len; i++) {
          let tDx, tDy;
          if (i === 0) {
            tDx = smoothed[0].x - smoothed[1].x;
            tDy = smoothed[0].y - smoothed[1].y;
          } else if (i === s_len - 1) {
            tDx = smoothed[i - 1].x - smoothed[i].x;
            tDy = smoothed[i - 1].y - smoothed[i].y;
          } else {
            tDx = smoothed[i - 1].x - smoothed[i + 1].x;
            tDy = smoothed[i - 1].y - smoothed[i + 1].y;
          }
          const len = Math.hypot(tDx, tDy);
          if (len > 0) {
            tDx /= len;
            tDy /= len;
          } else {
            tDx = 1;
            tDy = 0;
          }

          const nx = -tDy;
          const ny = tDx;

          const ratio = i / (s_len - 1);
          let outW = outlineWidth - (outlineWidth * ratio); // Outer shadow layer tapers to 0
          let coreW = coreWidth - (coreWidth * ratio);       // Inner light layer tapers to 0
          if (i === s_len - 1) {
            outW = 0.0;
            coreW = 0.0;
          }

          leftOutline.push({ x: smoothed[i].x + nx * outW, y: smoothed[i].y + ny * outW });
          rightOutline.push({ x: smoothed[i].x - nx * outW, y: smoothed[i].y - ny * outW });
          leftCore.push({ x: smoothed[i].x + nx * coreW, y: smoothed[i].y + ny * coreW });
          rightCore.push({ x: smoothed[i].x - nx * coreW, y: smoothed[i].y - ny * coreW });
        }

        // Clear canvas for drawing
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        // Optional Accent Glow (Subtle cyber/cinematic enhancement if configured)
        if (accentGlow) {
          ctx.save();
          ctx.shadowColor = accentColor;
          ctx.shadowBlur = 12;
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = accentWidth;
          ctx.beginPath();
          ctx.moveTo(smoothed[0].x, smoothed[0].y);
          for (let i = 1; i < smoothed.length; i++) {
            ctx.lineTo(smoothed[i].x, smoothed[i].y);
          }
          ctx.stroke();
          ctx.restore();
        }

        // 1. SOLID OUTLINE LAYER (Outer polygon mesh + round head cap)
        // Using winding non-zero rule so overlapping geometry melts seamlessly without stacking opacity
        ctx.fillStyle = outlineColor;
        ctx.beginPath();
        ctx.moveTo(leftOutline[0].x, leftOutline[0].y);
        for (let i = 1; i < leftOutline.length; i++) {
          ctx.lineTo(leftOutline[i].x, leftOutline[i].y);
        }
        for (let i = rightOutline.length - 1; i >= 0; i--) {
          ctx.lineTo(rightOutline[i].x, rightOutline[i].y);
        }
        ctx.closePath();
        // Head cap circle
        ctx.moveTo(smoothed[0].x + outlineWidth, smoothed[0].y);
        ctx.arc(smoothed[0].x, smoothed[0].y, outlineWidth, 0, Math.PI * 2);
        ctx.fill();

        // 2. SOLID CORE LAYER (Inner light polygon mesh + round head cap)
        ctx.fillStyle = coreColor;
        ctx.beginPath();
        ctx.moveTo(leftCore[0].x, leftCore[0].y);
        for (let i = 1; i < leftCore.length; i++) {
          ctx.lineTo(leftCore[i].x, leftCore[i].y);
        }
        for (let i = rightCore.length - 1; i >= 0; i--) {
          ctx.lineTo(rightCore[i].x, rightCore[i].y);
        }
        ctx.closePath();
        // Head cap circle
        ctx.moveTo(smoothed[0].x + coreWidth, smoothed[0].y);
        ctx.arc(smoothed[0].x, smoothed[0].y, coreWidth, 0, Math.PI * 2);
        ctx.fill();

        needsClearRef.current = true;
      } else if (needsClearRef.current) {
        // Clear once when returning to idle rest state
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        needsClearRef.current = false;
      }
    }

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleMouseLeave);
    };
  }, [
    triggerVelocity,
    stopVelocity,
    tailOffsetX,
    tailOffsetY,
    tailLength,
    outlineWidth,
    coreWidth,
    outlineColor,
    coreColor,
    accentGlow,
    accentColor,
    accentWidth
  ]);

  return (
    <div
      className="cursor-motion-blur-container"
      style={{ mixBlendMode: blendMode, zIndex }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="cursor-motion-blur-canvas" />
    </div>
  );
}
