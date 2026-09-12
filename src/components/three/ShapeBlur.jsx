import React, { useEffect, useRef } from 'react';
import { useInView } from '../../hooks/useInView';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './ShapeBlur.css';

export function ShapeBlur({ className = '' }) {
  const canvasRef = useRef(null);
  const [inViewRef, isInView] = useInView({ threshold: 0.05 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Subtle fluid shapes behind contact content
    const shapes = [
      { x: canvas.width * 0.3, y: canvas.height * 0.4, r: 180, vx: 0.4, vy: 0.3, color: 'rgba(64, 156, 255, 0.25)' },
      { x: canvas.width * 0.7, y: canvas.height * 0.6, r: 220, vx: -0.3, vy: -0.4, color: 'rgba(168, 85, 247, 0.2)' },
      { x: canvas.width * 0.5, y: canvas.height * 0.5, r: 160, vx: 0.2, vy: -0.2, color: 'rgba(0, 229, 255, 0.18)' },
    ];

    const render = () => {
      if (!isInView || reducedMotion) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shapes.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < 0 || s.x > canvas.width) s.vx *= -1;
        if (s.y < 0 || s.y > canvas.height) s.vy *= -1;

        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
        grad.addColorStop(0, s.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [isInView, reducedMotion]);

  return (
    <div ref={inViewRef} className={`shape-blur-container ${className}`}>
      <canvas ref={canvasRef} className="shape-blur-canvas" />
    </div>
  );
}
