import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FishRobot } from './FishRobot';
import { COMPANION_STATES, STATE_CONFIGS } from './companionStates';
import { PROJECT_REACTIONS, SECTION_REACTIONS, CLICK_REACTIONS, IDLE_THOUGHTS } from './companionReactions';
import './DigitalCompanion.css';

/**
 * DigitalCompanion - Interactive Robotic Fish AI Companion
 * 
 * Lives inside Kishore's portfolio as an ambient digital pet & companion.
 * Reacts to cursor movement, scrolling sections, project cards, and user clicks.
 */
export function DigitalCompanion() {
  const [currentState, setCurrentState] = useState(COMPANION_STATES.IDLE);
  const [activeSection, setActiveSection] = useState('hero');
  const [speechText, setSpeechText] = useState('');
  const [showSpeech, setShowSpeech] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const stateTimerRef = useRef(null);
  const speechTimerRef = useRef(null);
  const idleThoughtTimerRef = useRef(null);
  const companionRef = useRef(null);

  // Transition state with automatic return to IDLE after duration
  const triggerState = useCallback((newState, customMessage = null, customDuration = null) => {
    if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);

    setCurrentState(newState);

    if (customMessage) {
      setSpeechText(customMessage);
      setShowSpeech(true);
      const messageDuration = customDuration || 2800;
      speechTimerRef.current = setTimeout(() => {
        setShowSpeech(false);
      }, messageDuration);
    }

    const cfg = STATE_CONFIGS[newState];
    const duration = customDuration || (cfg ? cfg.duration : null);

    if (duration) {
      stateTimerRef.current = setTimeout(() => {
        setCurrentState(COMPANION_STATES.IDLE);
      }, duration);
    }
  }, []);

  // 1. SCROLL & SECTION AWARENESS
  useEffect(() => {
    const sectionIds = ['hero', 'about', 'capabilities', 'skills', 'work', 'more-builds', 'lab', 'github', 'contact'];
    let lastSection = 'hero';

    const handleScroll = () => {
      const scrollPos = window.scrollY + 280;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            if (id !== lastSection) {
              lastSection = id;
              setActiveSection(id);

              // Trigger section reaction
              const reaction = SECTION_REACTIONS[id];
              if (reaction) {
                // Occasional subtle speech bubble (35% probability or on key sections like work/contact)
                const shouldSpeak = id === 'work' || id === 'contact' || Math.random() < 0.35;
                triggerState(reaction.state, shouldSpeak ? reaction.message : null, 2400);
              }
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [triggerState]);

  // 2. PROJECT CARD INTERACTION LISTENER
  useEffect(() => {
    // Listen for custom project events or hover on elements with project attributes
    const handleProjectHover = (e) => {
      const projectName = e.detail?.project || e.detail?.title;
      if (projectName && PROJECT_REACTIONS[projectName]) {
        const reaction = PROJECT_REACTIONS[projectName];
        triggerState(reaction.state, reaction.message, 3000);
      }
    };

    window.addEventListener('companion-project-reaction', handleProjectHover);

    // Global listener for hovering over project items in the DOM
    const handleDocumentMouseOver = (e) => {
      const target = e.target.closest('[data-project], .project-card, [data-project-title]');
      if (!target) return;

      const title = target.getAttribute('data-project') || 
                    target.getAttribute('data-project-title') ||
                    target.querySelector('h3, h4')?.textContent?.trim();

      if (title) {
        // Find matching project reaction
        for (const [key, reaction] of Object.entries(PROJECT_REACTIONS)) {
          if (title.toLowerCase().includes(key.toLowerCase())) {
            triggerState(reaction.state, reaction.message, 2800);
            break;
          }
        }
      }
    };

    document.addEventListener('mouseover', handleDocumentMouseOver, { passive: true });

    return () => {
      window.removeEventListener('companion-project-reaction', handleProjectHover);
      document.removeEventListener('mouseover', handleDocumentMouseOver);
    };
  }, [triggerState]);

  // 3. KISA AI RELATIONSHIP (Reaction when KISA opens)
  useEffect(() => {
    const handleKisaOpen = () => {
      // Companion recognizes sister AI
      triggerState(COMPANION_STATES.HAPPY, "KISA online!", 2600);
    };

    window.addEventListener('open-portfolio-assistant', handleKisaOpen);
    return () => window.removeEventListener('open-portfolio-assistant', handleKisaOpen);
  }, [triggerState]);

  // 4. CLICK INTERACTION (Touched like a digital pet)
  const handleClick = () => {
    const randomIndex = Math.floor(Math.random() * CLICK_REACTIONS.length);
    const reaction = CLICK_REACTIONS[randomIndex];
    triggerState(reaction.state, reaction.message, 2400);
  };

  // 5. AMBIENT IDLE THOUGHTS (Rare, non-intrusive)
  useEffect(() => {
    const triggerRandomThought = () => {
      // Randomly display a quiet thought every 35-65 seconds if idle
      const delay = (35 + Math.random() * 30) * 1000;
      idleThoughtTimerRef.current = setTimeout(() => {
        if (currentState === COMPANION_STATES.IDLE && !showSpeech) {
          const thought = IDLE_THOUGHTS[Math.floor(Math.random() * IDLE_THOUGHTS.length)];
          setSpeechText(thought);
          setShowSpeech(true);
          setTimeout(() => setShowSpeech(false), 2400);
        }
        triggerRandomThought();
      }, delay);
    };

    triggerRandomThought();
    return () => {
      if (idleThoughtTimerRef.current) clearTimeout(idleThoughtTimerRef.current);
    };
  }, [currentState, showSpeech]);

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      if (idleThoughtTimerRef.current) clearTimeout(idleThoughtTimerRef.current);
    };
  }, []);

  return (
    <div
      ref={companionRef}
      className="digital-companion-anchor"
      role="button"
      tabIndex={0}
      aria-label="Digital Companion - Interactive Fish AI Robot"
      title="Digital Companion (Click to interact)"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Speech Bubble */}
      {showSpeech && (
        <div className="companion-speech-bubble" role="status" aria-live="polite">
          <span className="companion-bubble-dot" />
          <span className="companion-bubble-text">{speechText}</span>
        </div>
      )}

      {/* 3D Fish Robot */}
      <FishRobot
        state={currentState}
        size={115}
        interactive={true}
        onClick={handleClick}
        activeSection={activeSection}
      />

      {/* Minimal Laboratory HUD Pedestal */}
      <div className="companion-pedestal">
        <span className="companion-status-indicator" />
        <span className="companion-label">AQUA-AI</span>
        <span className="companion-state-tag">[{currentState}]</span>
      </div>
    </div>
  );
}

export default DigitalCompanion;
