import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * KisaCharacter - Procedural 3D Interactive Companion for Kishore's Portfolio
 * 
 * Aesthetic: Cinematic Digital Laboratory
 * Features:
 * - Geometric cybernetic chassis (floating head, curved visor, magnetic neck gap, gyro ring, core reactor)
 * - Expressive animated digital visor eyes (blinking, cursor tracking, thinking waveform pulse)
 * - Autonomous idle floating (sinusoidal levitation) & head glance
 * - Responsive cursor look-at tracking with smooth lerp damping
 * - Instant automatic adaptation to Black / White portfolio themes
 */
export function KisaCharacter({
  state = 'idle', // 'idle' | 'noticed' | 'talking' | 'active'
  size = 130,     // Canvas diameter in px
  interactive = true,
  onClick,
  activeSection = 'hero',
}) {
  const mountRef = useRef(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- SCENE & CAMERA SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.1, 3.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
    rimLight.position.set(-3, -1, -2);
    scene.add(rimLight);

    const bottomFill = new THREE.DirectionalLight(0xffffff, 0.4);
    bottomFill.position.set(0, -3, 2);
    scene.add(bottomFill);

    // --- CHARACTER PALETTE (CERAMIC WHITE CHASSIS + DARK MIRROR VISOR) ---
    const getThemeColors = () => {
      return {
        isWhite: true,
        chassis: 0xededf2,      // Ceramic white chassis
        chassisRough: 0.32,
        chassisMetal: 0.45,
        visor: 0x111114,        // Dark mirror visor faceplate
        visorRough: 0.08,
        visorMetal: 0.95,
        metalAccents: 0x9898a0, // Brushed chrome / titanium accents
        eyes: 0xffffff,         // Luminescent white sensor slits
        corePulse: 0xffffff     // Pure white core reactor light
      };
    };

    let theme = getThemeColors();

    // --- MATERIALS ---
    const chassisMat = new THREE.MeshStandardMaterial({
      color: theme.chassis,
      roughness: theme.chassisRough,
      metalness: theme.chassisMetal,
    });

    const visorMat = new THREE.MeshStandardMaterial({
      color: theme.visor,
      roughness: theme.visorRough,
      metalness: theme.visorMetal,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: theme.metalAccents,
      roughness: 0.2,
      metalness: 0.9,
    });

    const eyeMat = new THREE.MeshBasicMaterial({
      color: theme.eyes,
      transparent: true,
      opacity: 0.95,
    });

    const coreMat = new THREE.MeshBasicMaterial({
      color: theme.corePulse,
    });

    // --- ROOT RIG GROUP ---
    const kisaRig = new THREE.Group();
    scene.add(kisaRig);

    // --- HEAD GROUP ---
    const headGroup = new THREE.Group();
    headGroup.position.y = 0.32;
    kisaRig.add(headGroup);

    // Head Chassis (Aerodynamic smooth squashed capsule)
    const headGeo = new THREE.SphereGeometry(0.68, 36, 28);
    headGeo.scale(1.15, 0.88, 1.0);
    const headMesh = new THREE.Mesh(headGeo, chassisMat);
    headGroup.add(headMesh);

    // Visor Faceplate (Recessed curved digital shield)
    const visorGeo = new THREE.SphereGeometry(0.62, 32, 24, 0, Math.PI, 0, Math.PI);
    visorGeo.scale(1.08, 0.78, 0.75);
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.rotation.y = -Math.PI / 2;
    visorMesh.position.set(0, 0.02, 0.22);
    headGroup.add(visorMesh);

    // Eye Optics: Left & Right Expressive Sensor Slits
    const eyeGeo = new THREE.PlaneGeometry(0.18, 0.055);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.22, 0.04, 0.72);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.22, 0.04, 0.72);
    headGroup.add(rightEye);

    // Audio/Telemetry Ear Sensor Nodes
    const earGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.18, 20);
    earGeo.rotateZ(Math.PI / 2);
    const leftEar = new THREE.Mesh(earGeo, accentMat);
    leftEar.position.set(-0.80, 0.02, 0);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, accentMat);
    rightEar.position.set(0.80, 0.02, 0);
    headGroup.add(rightEar);

    // Antenna / Top Sensor Crest
    const crestGeo = new THREE.BoxGeometry(0.08, 0.14, 0.45);
    const crestMesh = new THREE.Mesh(crestGeo, accentMat);
    crestMesh.position.set(0, 0.60, -0.05);
    headGroup.add(crestMesh);

    // Magnetic Neck Levitation Emitter
    const neckCoreGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const neckCore = new THREE.Mesh(neckCoreGeo, coreMat);
    neckCore.position.set(0, -0.42, 0);
    headGroup.add(neckCore);

    // --- BODY GROUP ---
    const bodyGroup = new THREE.Group();
    bodyGroup.position.y = -0.45;
    kisaRig.add(bodyGroup);

    // Torso Chassis (Tapered geometric core)
    const torsoGeo = new THREE.CylinderGeometry(0.42, 0.18, 0.58, 24);
    const torsoMesh = new THREE.Mesh(torsoGeo, chassisMat);
    bodyGroup.add(torsoMesh);

    // Chest Reactor Aperture
    const chestCoreGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 16);
    chestCoreGeo.rotateX(Math.PI / 2);
    const chestCore = new THREE.Mesh(chestCoreGeo, coreMat);
    chestCore.position.set(0, 0.08, 0.32);
    bodyGroup.add(chestCore);

    // Levitation Gyroscope Halo Ring
    const ringGeo = new THREE.TorusGeometry(0.72, 0.025, 16, 48);
    ringGeo.rotateX(Math.PI / 2.3);
    const gyroRing = new THREE.Mesh(ringGeo, accentMat);
    bodyGroup.add(gyroRing);

    // Micro Thruster Cone
    const thrusterGeo = new THREE.ConeGeometry(0.14, 0.22, 16);
    thrusterGeo.rotateX(Math.PI);
    const thrusterMesh = new THREE.Mesh(thrusterGeo, accentMat);
    thrusterMesh.position.set(0, -0.38, 0);
    bodyGroup.add(thrusterMesh);

    // --- INTERACTIVE TRACKING STATE ---
    let mouse = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0, z: 0 };
    let isHovered = false;
    let blinkTimer = 0;
    let nextBlink = 3.0;
    let isBlinking = false;
    let blinkProgress = 0;
    let clickSpin = 0;

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      
      const dx = (e.clientX - cx) / (window.innerWidth * 0.5);
      const dy = (e.clientY - cy) / (window.innerHeight * 0.5);
      
      // Clamp rotation angles for natural movement
      mouse.x = THREE.MathUtils.clamp(dx * 1.2, -0.65, 0.65);
      mouse.y = THREE.MathUtils.clamp(dy * 1.0, -0.45, 0.45);
    };

    const handleMouseEnter = () => {
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
      mouse.x = 0;
      mouse.y = 0;
    };

    const handleClickTrigger = () => {
      clickSpin = Math.PI * 2;
      if (onClick) onClick();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClickTrigger);

    // Theme Change Observer
    const observer = new MutationObserver(() => {
      const t = getThemeColors();
      chassisMat.color.setHex(t.chassis);
      chassisMat.roughness = t.chassisRough;
      chassisMat.metalness = t.chassisMetal;
      visorMat.color.setHex(t.visor);
      accentMat.color.setHex(t.metalAccents);
      eyeMat.color.setHex(t.eyes);
      coreMat.color.setHex(t.corePulse);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // --- ANIMATION LOOP ---
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // 1. Idle Sinusoidal Floating & Breathing
      const floatOffset = Math.sin(elapsed * 2.2) * 0.08;
      const breathScale = 1 + Math.sin(elapsed * 1.6) * 0.015;
      kisaRig.position.y = floatOffset;
      kisaRig.scale.set(breathScale, breathScale, breathScale);

      // Gyroscope Ring Gentle Rotation
      gyroRing.rotation.z = elapsed * 0.8;
      gyroRing.rotation.y = Math.sin(elapsed * 1.1) * 0.25;

      // 2. Cursor Tracking & Head Aiming
      const activeState = stateRef.current;
      if (activeState === 'noticed' || isHovered) {
        targetRotation.y = mouse.x * 0.9;
        targetRotation.x = mouse.y * 0.7;
        targetRotation.z = -mouse.x * 0.18; // Natural head tilt
      } else if (activeState === 'talking') {
        // Expressive talking motion: slight nodding and frequency bob
        targetRotation.y = Math.sin(elapsed * 4.5) * 0.15;
        targetRotation.x = Math.cos(elapsed * 5.0) * 0.10;
        targetRotation.z = 0;
      } else {
        // Idle gentle observation scan
        const idleScan = Math.sin(elapsed * 0.5) * 0.22;
        targetRotation.y = idleScan + mouse.x * 0.4;
        targetRotation.x = mouse.y * 0.25;
        targetRotation.z = 0;
      }

      // Handle Click Spin Acknowledgment
      if (clickSpin > 0) {
        clickSpin = Math.max(0, clickSpin - delta * 12);
        kisaRig.rotation.y += delta * 12;
      }

      // Smooth Lerping
      headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetRotation.y, 0.08);
      headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetRotation.x, 0.08);
      headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, targetRotation.z, 0.08);

      bodyGroup.rotation.y = THREE.MathUtils.lerp(bodyGroup.rotation.y, targetRotation.y * 0.45, 0.06);

      // 3. Eye Blinking & Waveform Animation
      blinkTimer += delta;
      if (!isBlinking && blinkTimer > nextBlink) {
        isBlinking = true;
        blinkTimer = 0;
        blinkProgress = 0;
        nextBlink = 3.2 + Math.random() * 3.5;
      }

      if (isBlinking) {
        blinkProgress += delta * 14;
        if (blinkProgress <= 1) {
          const eyeScaleY = Math.max(0.08, 1 - Math.sin(blinkProgress * Math.PI));
          leftEye.scale.y = eyeScaleY;
          rightEye.scale.y = eyeScaleY;
        } else {
          isBlinking = false;
          leftEye.scale.y = 1;
          rightEye.scale.y = 1;
        }
      }

      // 4. Talking & Processing Waveform Pulse
      if (activeState === 'talking') {
        const pulse = 0.7 + Math.sin(elapsed * 16) * 0.35;
        eyeMat.opacity = pulse;
        neckCore.scale.setScalar(1 + Math.sin(elapsed * 20) * 0.3);
      } else {
        eyeMat.opacity = isHovered ? 1.0 : 0.92;
        neckCore.scale.setScalar(1 + Math.sin(elapsed * 3) * 0.1);
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- TEARDOWN ---
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClickTrigger);

      // Dispose Geometries and Materials
      [headGeo, visorGeo, eyeGeo, earGeo, crestGeo, neckCoreGeo, torsoGeo, chestCoreGeo, ringGeo, thrusterGeo].forEach(g => g.dispose());
      [chassisMat, visorMat, accentMat, eyeMat, coreMat].forEach(m => m.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size, interactive, onClick]);

  return (
    <div
      ref={mountRef}
      role="button"
      tabIndex={0}
      aria-label="KISA - Interactive AI Portfolio Companion"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick();
        }
      }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        cursor: 'pointer',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    />
  );
}

export default KisaCharacter;
