import React from 'react';
import GlowCursor from './components/GlowCursor/GlowCursor';
import { Navbar } from './components/navigation/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { CurvedLoopSection } from './components/sections/CurvedLoopSection';
import { AboutSection } from './components/sections/AboutSection';
import { CapabilitiesSection } from './components/sections/CapabilitiesSection';
import { SelectedWorkSection } from './components/sections/SelectedWorkSection';
import { MoreBuildsSection } from './components/sections/MoreBuildsSection';
import { LabSection } from './components/sections/LabSection';
import { GitHubSection } from './components/sections/GitHubSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/sections/Footer';

export function App() {
  return (
    <div style={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh', position: 'relative' }}>
      <GlowCursor
        color="#67E8F9"
        secondaryColor="#A78BFA"
        trailLength={40}
        trailWidth={8}
        trailTaper={0.8}
        followSpeed={0.16}
        glowIntensity={1.9}
        glowSpread={1.2}
        hotspot={0.65}
        brightness={1.25}
        opacity={1}
        pulseSpeed={1.1}
        noiseStrength={0.035}
        idleFade
        idleTimeout={700}
        fadeDuration={900}
        blendMode="screen"
      />
      <Navbar />
      <main>
        <HeroSection />
        <CurvedLoopSection />
        <AboutSection />
        <CapabilitiesSection />
        <SelectedWorkSection />
        <MoreBuildsSection />
        <LabSection />
        <GitHubSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
