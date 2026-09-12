import React, { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const cursorRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Detect touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
      return;
    }

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check hover targets
      const target = e.target;
      const isHoverable =
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.interactive') ||
        target.closest('[role="button"]') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA';

      setHovered(!!isHoverable);
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  if (isTouch || reducedMotion) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: hovered ? '36px' : '22px',
        height: hovered ? '36px' : '22px',
        borderRadius: '50%',
        border: '1px solid rgba(255, 255, 255, 0.65)',
        background: hovered ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) scale(${clicked ? 0.85 : 1})`,
        transition: 'width 0.2s ease-out, height 0.2s ease-out, transform 0.05s linear, background-color 0.2s ease',
        boxShadow: hovered ? '0 0 15px rgba(255, 255, 255, 0.2)' : 'none',
      }}
    />
  );
}
