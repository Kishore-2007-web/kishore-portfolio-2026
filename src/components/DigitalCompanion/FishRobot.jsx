import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STATE_CONFIGS, COMPANION_STATES } from './companionStates';

/**
 * FishRobot - Procedural 3D Fish AI Robot Companion
 * 
 * Aesthetic: Cinematic Digital Laboratory
 * Design: Cute robotic fish + AI companion + digital pet
 * Palette: Ceramic white chassis with dark mirror visor and luminous white eye optics
 */
export function FishRobot({
  state = COMPANION_STATES.IDLE,
  size = 130,
  interactive = true,
  onClick,
  activeSection = 'hero'
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
    camera.position.set(0, 0.15, 3.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // --- THEME ADAPTIVE LIGHTING & MATERIALS ---
    const isThemeWhite = () => document.documentElement.getAttribute('data-theme') === 'white';

    const ambientLight = new THREE.AmbientLight(0xffffff, isThemeWhite() ? 1.4 : 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, isThemeWhite() ? 2.8 : 2.4);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, isThemeWhite() ? 1.8 : 1.6);
    rimLight.position.set(-3, 0, -2);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, isThemeWhite() ? 0.8 : 0.5);
    fillLight.position.set(0, -3, 2);
    scene.add(fillLight);

    // --- MATERIALS (THEME ADAPTIVE) ---
    const chassisMat = new THREE.MeshStandardMaterial({
      color: isThemeWhite() ? 0xf5f7fb : 0xededf2, // Luminous Pearl White
      roughness: isThemeWhite() ? 0.22 : 0.3,
      metalness: isThemeWhite() ? 0.12 : 0.45,
    });

    const visorMat = new THREE.MeshStandardMaterial({
      color: isThemeWhite() ? 0xd0d5df : 0x111114, // Frosted Platinum in light / Obsidian Glass in dark
      roughness: isThemeWhite() ? 0.28 : 0.08,
      metalness: isThemeWhite() ? 0.35 : 0.95,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: isThemeWhite() ? 0xc8cdd8 : 0x9898a0,
      roughness: isThemeWhite() ? 0.2 : 0.22,
      metalness: isThemeWhite() ? 0.65 : 0.9,
    });

    const eyeMat = new THREE.MeshBasicMaterial({
      color: isThemeWhite() ? 0x0a0c10 : 0xffffff, // Deep black digital eyes in light / Luminous white in dark
      transparent: true,
      opacity: 0.98,
    });

    const thrusterMat = new THREE.MeshBasicMaterial({
      color: isThemeWhite() ? 0x00b4d8 : 0xffffff,
      transparent: true,
      opacity: 0.85,
    });

    const handleThemeChange = () => {
      const white = isThemeWhite();
      ambientLight.intensity = white ? 1.4 : 0.9;
      keyLight.intensity = white ? 2.8 : 2.4;
      rimLight.intensity = white ? 1.8 : 1.6;
      fillLight.intensity = white ? 0.8 : 0.5;

      chassisMat.color.setHex(white ? 0xf5f7fb : 0xededf2);
      chassisMat.roughness = white ? 0.22 : 0.3;
      chassisMat.metalness = white ? 0.12 : 0.45;

      visorMat.color.setHex(white ? 0xd0d5df : 0x111114);
      visorMat.roughness = white ? 0.28 : 0.08;
      visorMat.metalness = white ? 0.35 : 0.95;

      chromeMat.color.setHex(white ? 0xc8cdd8 : 0x9898a0);
      chromeMat.roughness = white ? 0.2 : 0.22;
      chromeMat.metalness = white ? 0.65 : 0.9;

      eyeMat.color.setHex(white ? 0x0a0c10 : 0xffffff);
      thrusterMat.color.setHex(white ? 0x00b4d8 : 0xffffff);
    };

    const themeObserver = new MutationObserver(handleThemeChange);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    // --- ROOT RIG GROUP ---
    const fishRig = new THREE.Group();
    scene.add(fishRig);

    // --- MAIN BODY HULL (Streamlined Fish Torpedo) ---
    const bodyGroup = new THREE.Group();
    fishRig.add(bodyGroup);

    // Main Torso Sphere (tapered & squashed along Z/Y)
    const bodyGeo = new THREE.SphereGeometry(0.72, 36, 28);
    bodyGeo.scale(0.85, 0.78, 1.25);
    const bodyMesh = new THREE.Mesh(bodyGeo, chassisMat);
    bodyMesh.position.set(0, 0, 0);
    bodyGroup.add(bodyMesh);

    // Mechanical Seam Ring around mid-body
    const seamGeo = new THREE.TorusGeometry(0.64, 0.015, 12, 40);
    seamGeo.rotateY(Math.PI / 2);
    const seamMesh = new THREE.Mesh(seamGeo, chromeMat);
    seamMesh.position.set(0, 0, -0.05);
    bodyGroup.add(seamMesh);

    // --- VISOR COCKPIT (Front Curved Faceplate) ---
    const visorGeo = new THREE.SphereGeometry(0.66, 32, 24, 0, Math.PI, 0, Math.PI);
    visorGeo.scale(0.78, 0.70, 0.75);
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.rotation.y = -Math.PI / 2;
    visorMesh.position.set(0, 0.04, 0.42);
    bodyGroup.add(visorMesh);

    // --- LARGE EXPRESSIVE DIGITAL EYES ---
    // Left Eye
    const eyeGeo = new THREE.CircleGeometry(0.16, 32);
    const leftEyeGroup = new THREE.Group();
    leftEyeGroup.position.set(-0.35, 0.12, 0.72);
    leftEyeGroup.rotation.y = -0.32;
    const leftEyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
    leftEyeGroup.add(leftEyeMesh);
    bodyGroup.add(leftEyeGroup);

    // Right Eye
    const rightEyeGroup = new THREE.Group();
    rightEyeGroup.position.set(0.35, 0.12, 0.72);
    rightEyeGroup.rotation.y = 0.32;
    const rightEyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
    rightEyeGroup.add(rightEyeMesh);
    bodyGroup.add(rightEyeGroup);

    // Inner Pupil Highlights (Left & Right)
    const pupilGeo = new THREE.CircleGeometry(0.06, 16);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0e });
    const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
    leftPupil.position.set(0.03, 0.03, 0.01);
    leftEyeMesh.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
    rightPupil.position.set(-0.03, 0.03, 0.01);
    rightEyeMesh.add(rightPupil);

    // --- DORSAL FIN (Top Crest / Antenna) ---
    const dorsalShape = new THREE.Shape();
    dorsalShape.moveTo(0, 0);
    dorsalShape.quadraticCurveTo(0.1, 0.38, -0.25, 0.42);
    dorsalShape.lineTo(-0.45, 0);
    dorsalShape.closePath();

    const dorsalExtrudeSettings = { depth: 0.04, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.01, bevelThickness: 0.01 };
    const dorsalGeo = new THREE.ExtrudeGeometry(dorsalShape, dorsalExtrudeSettings);
    dorsalGeo.center();
    const dorsalMesh = new THREE.Mesh(dorsalGeo, chromeMat);
    dorsalMesh.position.set(0, 0.68, -0.15);
    bodyGroup.add(dorsalMesh);

    // Dorsal Micro-Beacon
    const beaconGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const beaconMesh = new THREE.Mesh(beaconGeo, eyeMat);
    beaconMesh.position.set(-0.15, 0.88, -0.15);
    bodyGroup.add(beaconMesh);

    // --- PECTORAL FINS (Left & Right Swimming Flippers) ---
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.quadraticCurveTo(0.35, 0.1, 0.48, -0.22);
    finShape.quadraticCurveTo(0.25, -0.32, 0, -0.05);
    finShape.closePath();

    const finExtrudeSettings = { depth: 0.02, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.008, bevelThickness: 0.008 };
    const finGeo = new THREE.ExtrudeGeometry(finShape, finExtrudeSettings);

    // Left Fin
    const leftFinGroup = new THREE.Group();
    leftFinGroup.position.set(-0.54, -0.12, 0.12);
    leftFinGroup.rotation.y = -Math.PI / 2.8;
    const leftFinMesh = new THREE.Mesh(finGeo, chromeMat);
    leftFinGroup.add(leftFinMesh);
    bodyGroup.add(leftFinGroup);

    // Right Fin
    const rightFinGroup = new THREE.Group();
    rightFinGroup.position.set(0.54, -0.12, 0.12);
    rightFinGroup.rotation.y = Math.PI / 2.8;
    const rightFinMesh = new THREE.Mesh(finGeo, chromeMat);
    rightFinMesh.scale.x = -1; // Mirror for right side
    rightFinGroup.add(rightFinMesh);
    bodyGroup.add(rightFinGroup);

    // --- ARTICULATED MECHANICAL TAIL ---
    // Tail Segment 1 (Peduncle)
    const tailPeduncle = new THREE.Group();
    tailPeduncle.position.set(0, 0, -0.85);
    bodyGroup.add(tailPeduncle);

    const peduncleGeo = new THREE.CylinderGeometry(0.24, 0.14, 0.42, 16);
    peduncleGeo.rotateX(Math.PI / 2);
    const peduncleMesh = new THREE.Mesh(peduncleGeo, chassisMat);
    tailPeduncle.add(peduncleMesh);

    // Tail Segment 2 (Hinge to Fluke)
    const tailHinge = new THREE.Group();
    tailHinge.position.set(0, 0, -0.32);
    tailPeduncle.add(tailHinge);

    const hingeGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const hingeMesh = new THREE.Mesh(hingeGeo, chromeMat);
    tailHinge.add(hingeMesh);

    // Caudal Fin (Tail Flukes)
    const caudalShape = new THREE.Shape();
    caudalShape.moveTo(0, 0);
    caudalShape.quadraticCurveTo(-0.15, 0.35, -0.42, 0.52);
    caudalShape.quadraticCurveTo(-0.25, 0.1, -0.15, 0);
    caudalShape.quadraticCurveTo(-0.25, -0.1, -0.42, -0.52);
    caudalShape.quadraticCurveTo(-0.15, -0.35, 0, 0);
    caudalShape.closePath();

    const caudalGeo = new THREE.ExtrudeGeometry(caudalShape, { depth: 0.02, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.005, bevelThickness: 0.005 });
    caudalGeo.center();
    const caudalMesh = new THREE.Mesh(caudalGeo, chromeMat);
    caudalMesh.rotation.y = Math.PI / 2;
    caudalMesh.position.set(0, 0, -0.3);
    tailHinge.add(caudalMesh);

    // Bioluminescent Thruster Glow at Tail Joint
    const thrusterGlowGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const thrusterGlow = new THREE.Mesh(thrusterGlowGeo, thrusterMat);
    thrusterGlow.position.set(0, 0, -0.1);
    tailPeduncle.add(thrusterGlow);

    // --- CURSOR TRACKING & INTERACTIVE STATE ---
    let mouse = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0, z: 0 };
    let isHovered = false;
    let blinkTimer = 0;
    let nextBlink = 3.2;
    let isBlinking = false;
    let blinkProgress = 0;
    let clickReactionTimer = 0;

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = (e.clientX - cx) / (window.innerWidth * 0.5);
      const dy = (e.clientY - cy) / (window.innerHeight * 0.5);

      // Clamp angles for natural fluid fish tracking
      mouse.x = THREE.MathUtils.clamp(dx * 1.1, -0.55, 0.55);
      mouse.y = THREE.MathUtils.clamp(dy * 0.9, -0.4, 0.4);
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
      clickReactionTimer = 1.0;
      if (onClick) onClick();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClickTrigger);

    // --- ANIMATION LOOP ---
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Retrieve Current State Parameters
      const currentState = stateRef.current || COMPANION_STATES.IDLE;
      const cfg = STATE_CONFIGS[currentState] || STATE_CONFIGS[COMPANION_STATES.IDLE];

      // 1. Sinusoidal Swimming Motion & Buoyancy Float
      const floatY = Math.sin(elapsed * cfg.floatSpeed) * cfg.floatHeight;
      const breathScale = 1 + Math.sin(elapsed * 2.0) * 0.012;
      fishRig.position.y = floatY;
      fishRig.scale.set(breathScale, breathScale, breathScale);

      // 2. Articulated Tail Undulation (Fluid Sinusoidal Fish Swimming Stroke)
      const tailOsc = Math.sin(elapsed * cfg.tailSpeed) * cfg.tailAmplitude;
      tailPeduncle.rotation.y = tailOsc * 0.7;
      tailHinge.rotation.y = Math.sin(elapsed * cfg.tailSpeed - 0.7) * cfg.tailAmplitude * 1.2;

      // Pectoral Fins Flapping Rhythm
      const finOsc = Math.sin(elapsed * cfg.finSpeed) * 0.35;
      leftFinGroup.rotation.z = finOsc;
      rightFinGroup.rotation.z = -finOsc;

      // Counter-phase Body Yaw (Real Fish Swimming Physics)
      const bodyYaw = -Math.sin(elapsed * cfg.tailSpeed) * 0.08;

      // 3. Cursor Tracking & Head Aiming
      if (isHovered || currentState === COMPANION_STATES.CURIOUS) {
        targetRotation.y = mouse.x * 0.85 + bodyYaw;
        targetRotation.x = mouse.y * 0.65;
        targetRotation.z = -mouse.x * 0.25 + cfg.headTilt; // Banking into the turn
      } else if (currentState === COMPANION_STATES.HAPPY || currentState === COMPANION_STATES.EXCITED) {
        targetRotation.y = Math.sin(elapsed * 4.0) * 0.2 + bodyYaw;
        targetRotation.x = -0.15; // Joyful upward tilt
        targetRotation.z = Math.sin(elapsed * 3.0) * 0.15;
      } else if (currentState === COMPANION_STATES.SURPRISED) {
        targetRotation.y = bodyYaw;
        targetRotation.x = 0.25; // Reared backward
        targetRotation.z = 0;
      } else {
        // Idle ambient scanning
        const idleDrift = Math.sin(elapsed * 0.6) * 0.18;
        targetRotation.y = idleDrift + mouse.x * 0.35 + bodyYaw;
        targetRotation.x = mouse.y * 0.25;
        targetRotation.z = cfg.headTilt;
      }

      // Smooth Rotation Lerping
      bodyGroup.rotation.y = THREE.MathUtils.lerp(bodyGroup.rotation.y, targetRotation.y, 0.08);
      bodyGroup.rotation.x = THREE.MathUtils.lerp(bodyGroup.rotation.x, targetRotation.x, 0.08);
      bodyGroup.rotation.z = THREE.MathUtils.lerp(bodyGroup.rotation.z, targetRotation.z, 0.08);

      // 4. Expression Morphing (Eye Shape & Scale)
      let targetEyeScaleX = cfg.eyeScaleX;
      let targetEyeScaleY = cfg.eyeScaleY;
      let targetPupilScale = cfg.pupilScale;

      // Eye Blinking Cycle
      blinkTimer += delta;
      if (!isBlinking && blinkTimer > nextBlink) {
        isBlinking = true;
        blinkTimer = 0;
        blinkProgress = 0;
        nextBlink = 3.0 + Math.random() * 3.5;
      }

      if (isBlinking) {
        blinkProgress += delta * 14;
        if (blinkProgress <= 1) {
          const blinkFactor = Math.max(0.08, 1 - Math.sin(blinkProgress * Math.PI));
          targetEyeScaleY *= blinkFactor;
        } else {
          isBlinking = false;
        }
      }

      // Handle Click Reaction Recoil
      if (clickReactionTimer > 0) {
        clickReactionTimer = Math.max(0, clickReactionTimer - delta * 3.0);
        fishRig.position.z = -clickReactionTimer * 0.2;
      }

      // Smoothly Lerp Eye Scales
      leftEyeGroup.scale.x = THREE.MathUtils.lerp(leftEyeGroup.scale.x, targetEyeScaleX, 0.12);
      leftEyeGroup.scale.y = THREE.MathUtils.lerp(leftEyeGroup.scale.y, targetEyeScaleY, 0.12);
      rightEyeGroup.scale.x = THREE.MathUtils.lerp(rightEyeGroup.scale.x, targetEyeScaleX, 0.12);
      rightEyeGroup.scale.y = THREE.MathUtils.lerp(rightEyeGroup.scale.y, targetEyeScaleY, 0.12);

      leftPupil.scale.setScalar(THREE.MathUtils.lerp(leftPupil.scale.x, targetPupilScale, 0.12));
      rightPupil.scale.setScalar(THREE.MathUtils.lerp(rightPupil.scale.x, targetPupilScale, 0.12));

      // Thruster Pulse
      const thrusterPulse = 0.65 + Math.sin(elapsed * cfg.tailSpeed * 2.0) * 0.35;
      thrusterMat.opacity = thrusterPulse;

      renderer.render(scene, camera);
    };

    animate();

    // --- TEARDOWN ---
    return () => {
      themeObserver.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClickTrigger);

      // Clean Geometries & Materials
      [bodyGeo, seamGeo, visorGeo, eyeGeo, pupilGeo, dorsalGeo, beaconGeo, finGeo, peduncleGeo, hingeGeo, caudalGeo, thrusterGlowGeo].forEach(g => g.dispose());
      [chassisMat, visorMat, chromeMat, eyeMat, pupilMat, thrusterMat].forEach(m => m.dispose());
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
      aria-label="Digital Companion - Interactive AI Fish Robot"
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

export default FishRobot;
