import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useInView } from '../../hooks/useInView';
import { useWindowSize } from '../../hooks/useWindowSize';
import cardImg from '../../assets/lanyard/card.png';

function CardMesh() {
  const meshRef = useRef();
  const bandRef = useRef();
  const texture = useTexture(cardImg);
  const [dragged, setDragged] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const targetRot = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Mouse tilt calculations
    targetRot.current.x = state.pointer.y * 0.4;
    targetRot.current.y = state.pointer.x * 0.5;

    currentRot.current.x += (targetRot.current.x - currentRot.current.x) * 0.1;
    currentRot.current.y += (targetRot.current.y - currentRot.current.y) * 0.1;

    meshRef.current.rotation.x = currentRot.current.x;
    meshRef.current.rotation.y = currentRot.current.y;
    meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.05;

    // Subtle floating y motion
    meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.08 - 0.2;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Lanyard Rope / Strap */}
      <mesh ref={bandRef} position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 3, 16]} />
        <meshStandardMaterial color="#333333" roughness={0.5} />
      </mesh>

      {/* Clip Ring */}
      <mesh position={[0, 0.8, 0]}>
        <torusGeometry args={[0.1, 0.025, 16, 32]} />
        <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* ID Card Mesh */}
      <mesh
        ref={meshRef}
        position={[0, -0.2, 0]}
        onPointerOver={() => (document.body.style.cursor = 'grab')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <planeGeometry args={[1.75, 2.6]} />
        <meshStandardMaterial
          map={texture}
          transparent={true}
          side={THREE.DoubleSide}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

export function Lanyard() {
  const [containerRef, isInView] = useInView({ threshold: 0.1 });
  const { isMobile } = useWindowSize();

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: isMobile ? '320px' : '420px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isInView && (
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 45 }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 5, 5]} intensity={1.8} />
          <directionalLight position={[-5, -5, -2]} intensity={0.5} color="#409cff" />
          <React.Suspense fallback={null}>
            <CardMesh />
          </React.Suspense>
        </Canvas>
      )}
    </div>
  );
}
