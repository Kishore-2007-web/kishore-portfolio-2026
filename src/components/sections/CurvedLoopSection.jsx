import React from 'react';
import { CurvedLoop } from '../three/CurvedLoop';

export function CurvedLoopSection() {
  return (
    <section style={{ width: '100%', background: '#000000', overflow: 'hidden' }}>
      <CurvedLoop />
    </section>
  );
}

export default CurvedLoopSection;
