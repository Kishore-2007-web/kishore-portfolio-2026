import React from 'react';
import { MaskedHeading } from '../three/MaskedHeading';
import { CircularGallery } from '../three/CircularGallery';
import { WebGLErrorBoundary } from '../ui/WebGLErrorBoundary';

export function LabSection() {
  return (
    <section
      id="lab"
      style={{
        padding: '80px 0',
        background: '#000000',
      }}
    >
      <div className="container">
        <div className="section-tag">05 — THE LAB</div>

        <MaskedHeading text="THE LAB" />

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', maxWidth: '640px', marginBottom: '24px' }}>
          Experimental prototypes, 3D modeling studies, WebGL shaders, and creative technology explorations.
        </p>

        <WebGLErrorBoundary height="360px">
          <CircularGallery />
        </WebGLErrorBoundary>
      </div>
    </section>
  );
}
