import React from 'react';
import CurvedLoop from '../ui/CurvedLoop/CurvedLoop';

export function CurvedLoopSection() {
  return (
    <section style={{ width: '100%', background: '#000000', overflow: 'hidden', padding: '1rem 0' }}>
      <CurvedLoop
        marqueeText="WEB • SOFTWARE • AI • GAME DEVELOPMENT • 3D • BUILD WITH PURPOSE • "
        speed={1.5}
        curveAmount={300}
        direction="left"
        interactive={true}
        className="curved-loop-text"
      />
    </section>
  );
}

export default CurvedLoopSection;
