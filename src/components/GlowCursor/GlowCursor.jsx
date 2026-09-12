import React, { useEffect, useRef } from 'react';
import './GlowCursor.css';

function parseHex(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(char => char + char).join('');
  }
  const num = parseInt(c, 16);
  return [
    (num >> 16) & 255,
    (num >> 8) & 255,
    num & 255
  ];
}

function lerpColor(c1, c2, t) {
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * t),
    Math.round(c1[1] + (c2[1] - c1[1]) * t),
    Math.round(c1[2] + (c2[2] - c1[2]) * t)
  ];
}

export default function GlowCursor({
  color = '#67E8F9',
  secondaryColor = '#A78BFA',
  trailLength = 40,
  trailWidth = 8,
  trailTaper = 0.8,
  followSpeed = 0.16,
  glowIntensity = 1.9,
  glowSpread = 1.2,
  hotspot = 0.65,
  brightness = 1.25,
  opacity = 1,
  pulseSpeed = 1.1,
  noiseStrength = 0.035,
  idleFade = true,
  idleTimeout = 700,
  fadeDuration = 900,
  blendMode = 'screen',
  showHead = false
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -500, y: -500 });
  const headRef = useRef({ x: -500, y: -500 });
  const trailRef = useRef([]);
  const lastMoveTimeRef = useRef(Date.now());
  const currentOpacityRef = useRef(0);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rgb1 = parseHex(color);
    const rgb2 = parseHex(secondaryColor);

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function handleMouseMove(e) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      lastMoveTimeRef.current = Date.now();

      if (!isInitializedRef.current) {
        headRef.current.x = e.clientX;
        headRef.current.y = e.clientY;
        trailRef.current = Array.from({ length: trailLength }, () => ({
          x: e.clientX,
          y: e.clientY
        }));
        isInitializedRef.current = true;
      }
    }

    window.addEventListener('mousemove', handleMouseMove);

    let animId;
    let startTime = Date.now();

    function animate() {
      animId = requestAnimationFrame(animate);

      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      if (!isInitializedRef.current) return;

      const now = Date.now();
      const elapsed = (now - startTime) * 0.001;

      // Mouse lerp
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;
      headRef.current.x += (targetX - headRef.current.x) * followSpeed;
      headRef.current.y += (targetY - headRef.current.y) * followSpeed;

      // Update trail points
      const trail = trailRef.current;
      if (trail.length !== trailLength) {
        trailRef.current = Array.from({ length: trailLength }, () => ({
          x: headRef.current.x,
          y: headRef.current.y
        }));
      }

      trail[0].x = headRef.current.x;
      trail[0].y = headRef.current.y;

      for (let i = 1; i < trail.length; i++) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * 0.48;
        trail[i].y += (trail[i - 1].y - trail[i].y) * 0.48;
      }

      // Idle Fade calculation
      let targetOpacity = opacity;
      if (idleFade) {
        const timeSinceMove = now - lastMoveTimeRef.current;
        if (timeSinceMove > idleTimeout) {
          const fadeProgress = (timeSinceMove - idleTimeout) / fadeDuration;
          targetOpacity = Math.max(0, opacity * (1 - fadeProgress));
        }
      }

      currentOpacityRef.current += (targetOpacity - currentOpacityRef.current) * 0.12;
      const masterAlpha = currentOpacityRef.current;

      if (masterAlpha <= 0.005) return;

      // Time-based pulsing
      const pulse = 1.0 + 0.14 * Math.sin(elapsed * pulseSpeed * 3.5);

      // Draw Trail Ribbon Segments
      for (let i = trail.length - 1; i >= 1; i--) {
        const p1 = trail[i];
        const p2 = trail[i - 1];
        const progress = i / trail.length;

        const segWidth = Math.max(0.5, trailWidth * (1 - progress * trailTaper) * pulse);
        const rgb = lerpColor(rgb1, rgb2, progress);
        const segAlpha = Math.max(0, (1 - progress * 0.75) * masterAlpha * (brightness * 0.8));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${segAlpha})`;
        ctx.lineWidth = segWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Subtle segment glow
        if (glowIntensity > 0 && i % 2 === 0) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${segAlpha * 0.25 * glowIntensity})`;
          ctx.lineWidth = segWidth * 2.2 * glowSpread;
          ctx.stroke();
        }
      }

      // Draw Head Glow & Hotspot Core (Optional via showHead prop)
      if (showHead) {
        const head = trail[0];
        const headRadius = trailWidth * 2.5 * glowSpread * pulse;

        // Outer Radial Glow
        const outerGrad = ctx.createRadialGradient(
          head.x, head.y, 0,
          head.x, head.y, Math.max(1, headRadius * 2.5)
        );
        const glowAlpha = Math.min(1, masterAlpha * 0.6 * glowIntensity * brightness);
        outerGrad.addColorStop(0, `rgba(${rgb1[0]}, ${rgb1[1]}, ${rgb1[2]}, ${glowAlpha})`);
        outerGrad.addColorStop(0.5, `rgba(${rgb2[0]}, ${rgb2[1]}, ${rgb2[2]}, ${glowAlpha * 0.4})`);
        outerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(head.x, head.y, Math.max(1, headRadius * 2.5), 0, Math.PI * 2);
        ctx.fillStyle = outerGrad;
        ctx.fill();

        // Hotspot Inner Core
        const coreRadius = Math.max(1, trailWidth * hotspot * pulse);
        const coreGrad = ctx.createRadialGradient(
          head.x, head.y, 0,
          head.x, head.y, coreRadius
        );
        const coreAlpha = Math.min(1, masterAlpha * brightness);
        coreGrad.addColorStop(0, `rgba(255, 255, 255, ${coreAlpha})`);
        coreGrad.addColorStop(0.6, `rgba(${rgb1[0]}, ${rgb1[1]}, ${rgb1[2]}, ${coreAlpha * 0.9})`);
        coreGrad.addColorStop(1, `rgba(${rgb1[0]}, ${rgb1[1]}, ${rgb1[2]}, 0)`);

        ctx.beginPath();
        ctx.arc(head.x, head.y, coreRadius, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();
      }

      // Noise shimmer particles
      if (noiseStrength > 0 && Math.random() < 0.6) {
        const particleAngle = Math.random() * Math.PI * 2;
        const particleDist = Math.random() * headRadius * 0.8;
        const px = head.x + Math.cos(particleAngle) * particleDist;
        const py = head.y + Math.sin(particleAngle) * particleDist;
        const pSize = Math.random() * 1.8 + 0.5;

        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${masterAlpha * noiseStrength * 15})`;
        ctx.fill();
      }
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [
    color,
    secondaryColor,
    trailLength,
    trailWidth,
    trailTaper,
    followSpeed,
    glowIntensity,
    glowSpread,
    hotspot,
    brightness,
    opacity,
    pulseSpeed,
    noiseStrength,
    idleFade,
    idleTimeout,
    fadeDuration,
    showHead
  ]);

  return (
    <div
      className="glow-cursor-container"
      style={{ mixBlendMode: blendMode }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
