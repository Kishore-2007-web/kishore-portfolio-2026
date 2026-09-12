import React from 'react';
import { StrokeText } from '../three/StrokeText';

export function CurvedLoopSection() {
  return (
    <section style={{ width: '100%', background: '#000000', overflow: 'hidden' }}>
      <StrokeText
        text="PURPOSE OVER FANCY."
        strokeColor="#ffffff"
        fillColor="#F8FAFC"
        strokeWidth={1.4}
        drawDuration={1.6}
        fillDelay={0.2}
        stagger={0.05}
        ease="power2.out"
        trigger="mount"
        fillMode="wipe"
        fontSize={128}
        fontWeight={800}
        letterSpacing={-4}
      />
    </section>
  );
}

export default CurvedLoopSection;
