import React from 'react';
import { featuredProjects } from '../../data/projects';
import { InfiniteMenu } from '../three/InfiniteMenu';

export function SelectedWorkSection() {
  return (
    <section
      id="work"
      style={{
        padding: '80px 0',
        background: '#000000',
      }}
    >
      <div className="container">
        <div className="section-tag">03 — SELECTED WORK</div>

        <h2 className="section-heading">
          FEATURED PROJECTS.
        </h2>

        <InfiniteMenu items={featuredProjects} />
      </div>
    </section>
  );
}
