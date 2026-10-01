import React from 'react';
import CursorMotionBlur from './components/CursorMotionBlur/CursorMotionBlur';
import { Navbar } from './components/navigation/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { CurvedLoopSection } from './components/sections/CurvedLoopSection';
import { AboutSection } from './components/sections/AboutSection';
import { CapabilitiesSection } from './components/sections/CapabilitiesSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { SelectedWorkSection } from './components/sections/SelectedWorkSection';
import { MoreBuildsSection } from './components/sections/MoreBuildsSection';
import { LabSection } from './components/sections/LabSection';
import { GitHubSection } from './components/sections/GitHubSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/sections/Footer';
import { KisaCompanion } from './components/ai/KisaCompanion';
import { DigitalCompanion } from './components/DigitalCompanion/DigitalCompanion';

export function App() {
  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', position: 'relative' }}>
      <CursorMotionBlur
        triggerVelocity={25}
        stopVelocity={10}
        tailOffsetX={6}
        tailOffsetY={10}
        tailLength={10}
        outlineWidth={10}
        coreWidth={6}
        outlineColor="rgba(0, 0, 0, 0.86)"
        coreColor="rgba(255, 255, 255, 0.90)"
      />
      <Navbar />
      <main>
        <HeroSection />
        <CurvedLoopSection />
        <AboutSection />
        <CapabilitiesSection />
        <SkillsSection />
        <SelectedWorkSection />
        <MoreBuildsSection />
        <LabSection />
        <GitHubSection />
        <ContactSection />
      </main>
      <Footer />
      <KisaCompanion />
      <DigitalCompanion />
    </div>
  );
}

export default App;
