import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * KisaCharacter - Full Procedural 3D Interactive Companion for Kishore's Portfolio
 * 
 * Aesthetic Configuration:
 * - Ceramic white / light platinum metallic robot chassis
 * - Sleek frosted visor faceplate with subtle CRT scanlines
 * - Deep obsidian black digital circular eyes with fine scanlines
 * - Independent levitating floating side arms / pods
 * - Sleek floating egg/teardrop light body with obsidian black chest core
 * - Dual ear pivots with vertical titanium antenna pins
 * - Full 3D WebGL cursor tracking, natural head cocking, and eye pupil tracking
 * - Autonomous idle breathing, levitation, and natural eye blinks
 * - Synchronized state animations (idle, noticed, talking, click spin)
 * - Automatic lighting adaptation for Black / White themes
 */
export function KisaCharacter({
  state = 'idle', // 'idle' | 'noticed' | 'talking' | 'active'
  size = 130,     // Canvas width/height in px
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

    // --- 1. THREE.JS SCENE, CAMERA & RENDERER ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.05, 3.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(size, size);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // --- 2. THEME-ADAPTIVE LIGHTING SYSTEM ---
    const isThemeWhite = () => document.documentElement.getAttribute('data-theme') === 'white';

    const ambientLight = new THREE.AmbientLight(0xffffff, isThemeWhite() ? 0.75 : 0.90);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, isThemeWhite() ? 2.4 : 2.2);
    keyLight.position.set(2.5, 3.5, 3.5);
    scene.add(keyLight);

    const leftRimLight = new THREE.DirectionalLight(0xffffff, isThemeWhite() ? 1.6 : 1.4);
    leftRimLight.position.set(-3.5, 1.2, -2.2);
    scene.add(leftRimLight);

    const rightRimLight = new THREE.DirectionalLight(0xffffff, isThemeWhite() ? 1.4 : 1.2);
    rightRimLight.position.set(3.5, 1.2, -2.0);
    scene.add(rightRimLight);

    const topRimLight = new THREE.DirectionalLight(0xffffff, isThemeWhite() ? 1.8 : 1.6);
    topRimLight.position.set(0, 4.0, -2.2);
    scene.add(topRimLight);

    const bottomFillLight = new THREE.DirectionalLight(0xffffff, isThemeWhite() ? 0.6 : 0.5);
    bottomFillLight.position.set(0, -3.0, 2.5);
    scene.add(bottomFillLight);

    // --- 3. DYNAMIC PROCEDURAL TEXTURES ---
    // (a) Frosted Light CRT Visor Screen Texture
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 256;
    screenCanvas.height = 256;
    const sCtx = screenCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 140);
    sGrad.addColorStop(0, '#f2f5fa');
    sGrad.addColorStop(0.7, '#e4e8f0');
    sGrad.addColorStop(1, '#d5dae4');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);
    // Subtle scanlines
    sCtx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    for (let y = 0; y < 256; y += 4) {
      sCtx.fillRect(0, y, 256, 1.5);
    }
    const screenTex = new THREE.CanvasTexture(screenCanvas);

    // (b) Deep Obsidian Black Digital Eyes with fine scanlines
    const eyeCanvas = document.createElement('canvas');
    eyeCanvas.width = 128;
    eyeCanvas.height = 128;
    const eCtx = eyeCanvas.getContext('2d');
    const eGrad = eCtx.createRadialGradient(64, 64, 0, 64, 64, 54);
    eGrad.addColorStop(0, '#040608');
    eGrad.addColorStop(0.65, '#0c0f14');
    eGrad.addColorStop(0.88, '#181d26');
    eGrad.addColorStop(0.96, '#28303e');
    eGrad.addColorStop(1, 'rgba(40, 48, 62, 0)');
    eCtx.fillStyle = eGrad;
    eCtx.beginPath();
    eCtx.arc(64, 64, 54, 0, Math.PI * 2);
    eCtx.fill();
    // Fine digital scanlines across the black eyes
    eCtx.fillStyle = 'rgba(45, 55, 70, 0.45)';
    for (let y = 14; y < 114; y += 7) {
      eCtx.fillRect(10, y, 108, 2.5);
    }
    const eyeTex = new THREE.CanvasTexture(eyeCanvas);

    // (c) Obsidian Black Chest Reactor Core Lens
    const coreCanvas = document.createElement('canvas');
    coreCanvas.width = 128;
    coreCanvas.height = 128;
    const cCtx = coreCanvas.getContext('2d');
    const cGrad = cCtx.createRadialGradient(64, 64, 0, 64, 64, 52);
    cGrad.addColorStop(0, '#06080a');
    cGrad.addColorStop(0.6, '#10141a');
    cGrad.addColorStop(0.85, '#222834');
    cGrad.addColorStop(1, 'rgba(34, 40, 52, 0)');
    cCtx.fillStyle = cGrad;
    cCtx.beginPath();
    cCtx.arc(64, 64, 52, 0, Math.PI * 2);
    cCtx.fill();
    const coreTex = new THREE.CanvasTexture(coreCanvas);

    // --- 4. SHADERS & MATERIALS (LIGHT CERAMIC CHASSIS + BLACK EYES) ---
    // Ceramic white / platinum light chassis
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0xeff1f5,
      roughness: 0.28,
      metalness: 0.32,
    });

    // Brushed titanium / bright steel for ear pivots and antenna rods
    const earMat = new THREE.MeshStandardMaterial({
      color: 0xd6dae2,
      roughness: 0.18,
      metalness: 0.88,
    });

    // Satin metallic screen bezel
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0xc8cdd6,
      roughness: 0.34,
      metalness: 0.65,
    });

    // Light frosted screen material
    const screenMat = new THREE.MeshStandardMaterial({
      map: screenTex,
      roughness: 0.24,
      metalness: 0.18,
    });

    // Deep obsidian black digital eyes
    const eyeMat = new THREE.MeshBasicMaterial({
      map: eyeTex,
      transparent: true,
      opacity: 0.98,
      depthTest: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    // Deep black circular chest core
    const coreMat = new THREE.MeshBasicMaterial({
      map: coreTex,
      transparent: true,
      opacity: 0.98,
      depthTest: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    // --- 5. HIERARCHICAL 3D CHARACTER RIG ---
    const kisaRig = new THREE.Group();
    scene.add(kisaRig);

    // ==========================================
    // (A) HEAD GROUP (Levitating above body)
    // ==========================================
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.38, 0);
    kisaRig.add(headGroup);

    // 1. Head Chassis (Rounded squashed aerodynamic capsule, recessed in front)
    const headGeo = new THREE.SphereGeometry(0.70, 48, 36);
    headGeo.scale(1.15, 0.94, 0.80);
    const headMesh = new THREE.Mesh(headGeo, chassisMat);
    headGroup.add(headMesh);

    // 2. Inset Visor Screen Face (Curved dome projecting in front of head)
    const screenGeo = new THREE.SphereGeometry(0.66, 40, 32, Math.PI * 0.15, Math.PI * 0.70, Math.PI * 0.15, Math.PI * 0.70);
    screenGeo.scale(1.15, 0.88, 0.55);
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0.02, 0.25);
    headGroup.add(screenMesh);

    // 3. Monitor Screen Outer Bezel
    const bezelGeo = new THREE.TorusGeometry(0.52, 0.04, 16, 48);
    bezelGeo.scale(1.22, 0.90, 0.50);
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.set(0, 0.02, 0.56);
    headGroup.add(bezelMesh);

    // 4. Digital Black Eyes (Left & Right - sitting boldly on screen dome)
    const eyeGeo = new THREE.PlaneGeometry(0.30, 0.30);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.21, 0.05, 0.615);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.21, 0.05, 0.615);
    headGroup.add(rightEye);

    // 5. Left Ear Pivot & Antenna Rod
    const earPivotGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.14, 24);
    earPivotGeo.rotateZ(Math.PI / 2);

    const leftEarMesh = new THREE.Mesh(earPivotGeo, earMat);
    leftEarMesh.position.set(-0.82, 0.04, 0);
    headGroup.add(leftEarMesh);

    const antennaGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.62, 16);
    antennaGeo.translate(0, 0.31, 0); // Origin at base of antenna

    const leftAntenna = new THREE.Mesh(antennaGeo, earMat);
    leftAntenna.position.set(-0.82, 0.04, 0);
    headGroup.add(leftAntenna);

    // 6. Right Ear Pivot & Antenna Rod
    const rightEarMesh = new THREE.Mesh(earPivotGeo, earMat);
    rightEarMesh.position.set(0.82, 0.04, 0);
    headGroup.add(rightEarMesh);

    const rightAntenna = new THREE.Mesh(antennaGeo, earMat);
    rightAntenna.position.set(0.82, 0.04, 0);
    headGroup.add(rightAntenna);

    // ==========================================
    // (B) BODY GROUP (Floating below head)
    // ==========================================
    const bodyGroup = new THREE.Group();
    bodyGroup.position.set(0, -0.46, 0);
    kisaRig.add(bodyGroup);

    // Tapered egg/droplet body shape
    const bodyGeo = new THREE.SphereGeometry(0.50, 40, 32);
    const pos = bodyGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let vx = pos.getX(i);
      let vy = pos.getY(i);
      let vz = pos.getZ(i);

      // Downward taper factor
      const taper = 1.0 - Math.max(0, -vy * 0.42);
      pos.setX(i, vx * taper * 0.96);
      pos.setY(i, vy * 1.18);
      pos.setZ(i, vz * taper * 0.88);
    }
    bodyGeo.computeVertexNormals();
    const bodyMesh = new THREE.Mesh(bodyGeo, chassisMat);
    bodyGroup.add(bodyMesh);

    // Chest Circular Core Light (with dark outer bezel)
    const chestCoreBezelGeo = new THREE.TorusGeometry(0.082, 0.016, 16, 32);
    const chestCoreBezel = new THREE.Mesh(chestCoreBezelGeo, bezelMat);
    chestCoreBezel.position.set(0, 0.07, 0.44);
    bodyGroup.add(chestCoreBezel);

    const chestCoreGeo = new THREE.PlaneGeometry(0.16, 0.16);
    const chestCoreMesh = new THREE.Mesh(chestCoreGeo, coreMat);
    chestCoreMesh.position.set(0, 0.07, 0.455);
    bodyGroup.add(chestCoreMesh);

    // ==========================================
    // (C) LEVITATING FLOATING SIDE ARMS
    // ==========================================
    const armGeo = new THREE.SphereGeometry(0.28, 32, 24);
    armGeo.scale(0.52, 1.35, 0.64);
    armGeo.computeVertexNormals();

    // Left Floating Arm
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.76, -0.40, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, chassisMat);
    leftArmMesh.rotation.z = -0.24; // Subtle inward angle
    leftArmMesh.rotation.x = 0.12;
    leftArmGroup.add(leftArmMesh);
    kisaRig.add(leftArmGroup);

    // Right Floating Arm
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.76, -0.40, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, chassisMat);
    rightArmMesh.rotation.z = 0.24; // Subtle inward angle
    rightArmMesh.rotation.x = 0.12;
    rightArmGroup.add(rightArmMesh);
    kisaRig.add(rightArmGroup);

    // --- 6. INTERACTIVE TRACKING & PHYSICS STATE ---
    let mouse = { x: 0, y: 0 };
    let targetHeadRot = { x: 0, y: 0, z: 0 };
    let isHovered = false;
    let blinkTimer = 0;
    let nextBlink = 3.2;
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

      mouse.x = THREE.MathUtils.clamp(dx * 1.25, -0.75, 0.75);
      mouse.y = THREE.MathUtils.clamp(dy * 1.1, -0.55, 0.55);
    };

    const handleMouseEnter = () => {
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
      mouse.x = 0;
      mouse.y = 0;
    };

    const handleClickTrigger = (e) => {
      clickSpin = Math.PI * 2;
      if (onClick) onClick(e);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClickTrigger);

    // Dynamic Theme Observer
    const themeObserver = new MutationObserver(() => {
      const white = isThemeWhite();
      ambientLight.intensity = white ? 0.75 : 0.90;
      keyLight.intensity = white ? 2.4 : 2.2;
      leftRimLight.intensity = white ? 1.6 : 1.4;
      rightRimLight.intensity = white ? 1.4 : 1.2;
      topRimLight.intensity = white ? 1.8 : 1.6;
      bottomFillLight.intensity = white ? 0.6 : 0.5;
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // --- 7. ANIMATION RENDER LOOP ---
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const currentSt = stateRef.current;

      // (a) Sinusoidal Organic Floating Levitation
      const baseFloat = Math.sin(elapsed * 2.2) * 0.055;
      const breathingScale = 1.0 + Math.sin(elapsed * 1.8) * 0.012;
      kisaRig.position.y = baseFloat;
      kisaRig.scale.set(breathingScale, breathingScale, breathingScale);

      // (b) Zero-G Independent Harmonic Arm Levitation
      const leftArmFloat = Math.sin(elapsed * 2.6 + 0.6) * 0.035;
      const rightArmFloat = Math.sin(elapsed * 2.6 - 0.6) * 0.035;
      leftArmGroup.position.y = -0.40 + leftArmFloat;
      rightArmGroup.position.y = -0.40 + rightArmFloat;

      leftArmGroup.rotation.z = Math.sin(elapsed * 1.8) * 0.04;
      rightArmGroup.rotation.z = -Math.sin(elapsed * 1.8) * 0.04;

      // (c) 3D Cursor Look-At & Natural Head Cocking
      if (currentSt === 'noticed' || isHovered) {
        targetHeadRot.y = mouse.x * 0.85;
        targetHeadRot.x = mouse.y * 0.65;
        targetHeadRot.z = -mouse.x * 0.16; // Inquisitive tilt
      } else if (currentSt === 'talking') {
        // Expressive rhythm nodding & conversational bob
        targetHeadRot.y = Math.sin(elapsed * 4.8) * 0.14;
        targetHeadRot.x = Math.cos(elapsed * 5.2) * 0.09;
        targetHeadRot.z = 0;
      } else {
        // Gentle autonomous scanning
        const scan = Math.sin(elapsed * 0.45) * 0.08;
        targetHeadRot.y = scan + mouse.x * 0.35;
        targetHeadRot.x = mouse.y * 0.22;
        targetHeadRot.z = 0;
      }

      // Handle Click Spin Reaction
      if (clickSpin > 0) {
        const step = delta * 14;
        clickSpin = Math.max(0, clickSpin - step);
        kisaRig.rotation.y += step;
      }

      // Smooth damping interpolation (Lerp)
      headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetHeadRot.y, 0.09);
      headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetHeadRot.x, 0.09);
      headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, targetHeadRot.z, 0.09);

      // Body and arms subtly follow head rotation with lagging parallax
      bodyGroup.rotation.y = THREE.MathUtils.lerp(bodyGroup.rotation.y, targetHeadRot.y * 0.38, 0.07);
      bodyGroup.rotation.x = THREE.MathUtils.lerp(bodyGroup.rotation.x, targetHeadRot.x * 0.25, 0.07);

      // (d) Digital Eyes Micro-Tracking on Screen Face
      const eyeAimX = mouse.x * 0.035;
      const eyeAimY = -mouse.y * 0.025;
      leftEye.position.x = -0.21 + eyeAimX;
      leftEye.position.y = 0.05 + eyeAimY;
      rightEye.position.x = 0.21 + eyeAimX;
      rightEye.position.y = 0.05 + eyeAimY;

      // (e) Natural Blinking
      blinkTimer += delta;
      if (!isBlinking && blinkTimer > nextBlink) {
        isBlinking = true;
        blinkTimer = 0;
        blinkProgress = 0;
        nextBlink = 3.0 + Math.random() * 3.5;
      }

      if (isBlinking) {
        blinkProgress += delta * 15;
        if (blinkProgress <= 1.0) {
          const eyeScaleY = Math.max(0.06, 1.0 - Math.sin(blinkProgress * Math.PI));
          leftEye.scale.y = eyeScaleY;
          rightEye.scale.y = eyeScaleY;
        } else {
          isBlinking = false;
          leftEye.scale.y = 1.0;
          rightEye.scale.y = 1.0;
        }
      }

      // (f) Talking & Thinking Digital Pulse
      if (currentSt === 'talking') {
        const pulse = 0.85 + Math.sin(elapsed * 18) * 0.15;
        eyeMat.opacity = pulse;
        chestCoreMesh.scale.setScalar(1.0 + Math.sin(elapsed * 22) * 0.2);
      } else {
        eyeMat.opacity = 0.98;
        chestCoreMesh.scale.setScalar(1.0 + Math.sin(elapsed * 2.5) * 0.05);
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- 8. CLEANUP & TEARDOWN ---
    return () => {
      cancelAnimationFrame(animId);
      themeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClickTrigger);

      // Dispose Geometries & Textures
      [headGeo, screenGeo, bezelGeo, eyeGeo, earPivotGeo, antennaGeo, bodyGeo, chestCoreBezelGeo, chestCoreGeo, armGeo].forEach((g) => g.dispose());
      [screenTex, eyeTex, coreTex].forEach((t) => t.dispose());
      [chassisMat, earMat, bezelMat, screenMat, eyeMat, coreMat].forEach((m) => m.dispose());
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
      aria-label="KISA - Interactive 3D AI Portfolio Companion"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick(e);
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
