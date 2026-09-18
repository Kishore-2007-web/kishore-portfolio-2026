import React, { useState, useEffect } from 'react';
import { archiveProjects } from '../../data/projects';
import DriftWall from '../reactbits/DriftWall/DriftWall';
import { ProjectArchiveModal } from '../ui/ProjectArchiveModal';

export function MoreBuildsSection() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute responsive configuration for DriftWall
  const wallConfig = React.useMemo(() => {
    if (windowWidth < 640) {
      return {
        columns: 2,
        tileWidth: 140,
        tileHeight: 92,
        gap: 12,
        height: '440px',
      };
    } else if (windowWidth < 1024) {
      return {
        columns: 3,
        tileWidth: 170,
        tileHeight: 112,
        gap: 14,
        height: '520px',
      };
    }
    return {
      columns: 5,
      tileWidth: 200,
      tileHeight: 132,
      gap: 18,
      height: '600px',
    };
  }, [windowWidth]);

  // Map archiveProjects into DriftWall items
  const driftItems = React.useMemo(() => {
    return archiveProjects.map((project) => ({
      image: project.image,
      title: project.title,
      href: '#',
      project: project,
    }));
  }, []);

  return (
    <section
      id="more-builds"
      style={{
        padding: '80px 0 100px 0',
        background: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <div className="section-tag" style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
          04 — MORE BUILDS
        </div>

        <h2 className="section-heading" style={{ marginBottom: '8px', color: '#ffffff' }}>
          SECONDARY ARCHIVE.
        </h2>

        <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1rem', marginBottom: '28px', maxWidth: '600px' }}>
          A visual archive of selected projects and experiments. Click any tile to inspect details.
        </p>

        <div
          className="archive-driftwall"
          style={{
            height: wallConfig.height,
            width: '100%',
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            background: '#000000',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 0 40px rgba(255, 255, 255, 0.05)',
          }}
        >
          <DriftWall
            items={driftItems}
            columns={wallConfig.columns}
            tileWidth={wallConfig.tileWidth}
            tileHeight={wallConfig.tileHeight}
            gap={wallConfig.gap}
            tilt={0}
            turn={0}
            perspective={1200}
            depth={0}
            speed={28}
            direction="up"
            variance={0.2}
            parallax={0.3}
            lift={28}
            fade={0.4}
            dim={0.85}
            grayscale={true}
            overlayColor="#000000"
            onTileClick={(item) => setSelectedProject(item.project)}
          />
        </div>
      </div>

      {/* Interactive Project Details Modal */}
      <ProjectArchiveModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}

export default MoreBuildsSection;
