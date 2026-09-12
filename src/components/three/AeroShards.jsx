import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import * as vgpu from 'vgpu';
import { useInView } from '../../hooks/useInView';
import { useWindowSize } from '../../hooks/useWindowSize';
import './AeroShards.css';

export function AeroShards({
  backgroundColor = '#120F17',
  shardColor = '#ffffff',
  accentColor = '#ffffff',
  placement = 'full',
  flow = 'stream',
  material = 'pearl',
  detail = 'balanced',
  effect = 'none',
  scale = 1,
  spread = 1,
  depth = 1,
  speed = 1,
  spin = 1,
  interaction = 'repel',
  density = 1.5,
  shardSize = 1.1,
  stretch = 1,
  turbulence = 1,
  glow = 1,
  edgeSoftness = 2,
  bloom = 0.5,
  grain = 0.05,
  chromaticAberration = 0.0075,
  transitionDuration = 1,
  interactionRadius = 1.5,
  interactionStrength = 0.5,
  rippleIntensity = 1,
  holdToGather = true,
  paused = false,
  className = '',
  onError,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [inViewRef, isInView] = useInView({ threshold: 0.05 });
  const { isMobile } = useWindowSize();

  const count = Math.round((isMobile ? 12 : 32) * density);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animId;
    let renderer;
    let scene;
    let camera;
    let shards = [];
    let shardMaterial;

    const runRenderEngine = () => {
      try {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(
          45,
          container.clientWidth / container.clientHeight,
          0.1,
          100
        );
        camera.position.set(0, 0, 10 / scale);

        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const group = new THREE.Group();
        scene.add(group);

        const primaryColor = new THREE.Color(shardColor);
        const highlightColor = new THREE.Color(accentColor);

        let metalness = 0.85;
        let roughness = 0.15;
        let transmission = 0.5;

        if (material === 'chrome') {
          metalness = 0.95;
          roughness = 0.05;
          transmission = 0.2;
        } else if (material === 'satin') {
          metalness = 0.4;
          roughness = 0.6;
          transmission = 0.7;
        }

        shardMaterial = new THREE.MeshPhysicalMaterial({
          color: primaryColor,
          metalness,
          roughness,
          transmission,
          thickness: 1.2 * edgeSoftness,
          transparent: true,
          opacity: 0.85,
          reflectivity: 0.9,
          clearcoat: 1.0,
        });

        for (let i = 0; i < count; i++) {
          const radius = (0.25 + Math.random() * 0.45) * shardSize;
          const height = (1.0 + Math.random() * 1.4) * stretch;
          const geom = new THREE.ConeGeometry(radius, height, 3);
          const mesh = new THREE.Mesh(geom, shardMaterial);

          const pos = new THREE.Vector3(
            (Math.random() - 0.5) * 9 * spread,
            (Math.random() - 0.5) * 7 * spread,
            (Math.random() - 0.5) * 5 * depth
          );

          mesh.position.copy(pos);
          mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          );

          const rotSpeed = {
            x: (Math.random() - 0.5) * 0.008 * spin * speed,
            y: (Math.random() - 0.5) * 0.012 * spin * speed,
            z: (Math.random() - 0.5) * 0.008 * spin * speed,
          };

          shards.push({ mesh, basePos: pos.clone(), rotSpeed, phase: Math.random() * Math.PI * 2 });
          group.add(mesh);
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4 * glow);
        scene.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(primaryColor, 1.5);
        dirLight1.position.set(5, 5, 5);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(highlightColor, 0.9);
        dirLight2.position.set(-5, -5, 2);
        scene.add(dirLight2);

        const mouse = new THREE.Vector2(-999, -999);
        const targetMouse = new THREE.Vector2(-999, -999);

        const onMouseMove = (e) => {
          const rect = container.getBoundingClientRect();
          targetMouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
          targetMouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', onMouseMove);

        const clock = new THREE.Clock();

        const animate = () => {
          if (!isInView || paused) {
            animId = requestAnimationFrame(animate);
            return;
          }

          const elapsed = clock.getElapsedTime();
          mouse.x += (targetMouse.x - mouse.x) * 0.05 * interactionStrength;
          mouse.y += (targetMouse.y - mouse.y) * 0.05 * interactionStrength;

          if (interaction === 'repel') {
            group.rotation.y = mouse.x * 0.3 * interactionRadius;
            group.rotation.x = -mouse.y * 0.3 * interactionRadius;
          } else if (interaction === 'attract') {
            group.rotation.y = -mouse.x * 0.3 * interactionRadius;
            group.rotation.x = mouse.y * 0.3 * interactionRadius;
          }

          shards.forEach((s) => {
            s.mesh.rotation.x += s.rotSpeed.x;
            s.mesh.rotation.y += s.rotSpeed.y;
            s.mesh.rotation.z += s.rotSpeed.z;

            const turb = turbulence * 0.15;
            s.mesh.position.y = s.basePos.y + Math.sin(elapsed * speed * 0.8 + s.phase) * (0.25 + turb);
            s.mesh.position.x = s.basePos.x + Math.cos(elapsed * speed * 0.5 + s.phase) * (0.15 + turb);
          });

          renderer.render(scene, camera);
          animId = requestAnimationFrame(animate);
        };

        animate();
        setIsReady(true);

        const handleResize = () => {
          if (!container || !renderer) return;
          camera.aspect = container.clientWidth / container.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(container.clientWidth, container.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('resize', handleResize);
          cancelAnimationFrame(animId);
          if (shardMaterial) shardMaterial.dispose();
          shards.forEach((s) => s.mesh.geometry.dispose());
          if (renderer) renderer.dispose();
        };
      } catch (err) {
        if (onError) onError(err);
      }
    };

    const cleanup = runRenderEngine();

    return () => {
      if (cleanup) cleanup();
    };
  }, [
    count,
    isInView,
    backgroundColor,
    shardColor,
    accentColor,
    scale,
    spread,
    depth,
    speed,
    spin,
    interaction,
    density,
    shardSize,
    stretch,
    turbulence,
    glow,
    edgeSoftness,
    interactionRadius,
    interactionStrength,
    material,
    paused,
    onError,
  ]);

  return (
    <div
      ref={inViewRef}
      className={`aero-shards ${className}`}
      data-ready={isReady ? 'true' : 'false'}
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
        <canvas ref={canvasRef} className="aero-shards__canvas" />
      </div>
    </div>
  );
}

export default AeroShards;
