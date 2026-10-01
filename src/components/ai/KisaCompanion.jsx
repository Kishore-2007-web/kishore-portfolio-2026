import React, { useState, useEffect, useRef } from 'react';
import { KisaCharacter } from './KisaCharacter';
import { sendAIMessage, AI_CONFIG } from '../../services/aiService';
import { MarkdownRenderer } from './MarkdownRenderer';
import {
  Send,
  X,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Cpu,
  Compass
} from 'lucide-react';

const SUGGESTED_QUESTIONS_DEFAULT = [
  "Who is Kishore?",
  "Show me his projects",
  "Tell me about USBShield",
  "What is Kisa AI?",
  "What technologies does Kishore use?",
  "What is Rise of Aran?",
  "What 3D software does Kishore use?",
  "How can I contact Kishore?"
];

const SECTION_PROMPT_MAP = {
  hero: "Who is Kishore and what does he build?",
  about: "Tell me about Kishore's background and education.",
  capabilities: "What domains and engineering areas does Kishore focus on?",
  skills: "What are Kishore's technical skills across Web, 3D, and AI?",
  work: "Tell me about Kishore's featured projects like USBShield and Kisa AI.",
  'more-builds': "What other builds and software tools has Kishore made?",
  lab: "What experimental prototypes and 3D projects are in the Lab?",
  github: "What open-source repositories has Kishore built?",
  contact: "How can I contact Kishore or message him on WhatsApp?"
};

export function KisaCompanion() {
  const [isOpen, setIsOpen] = useState(false);
  const [characterState, setCharacterState] = useState('idle'); // 'idle' | 'noticed' | 'talking' | 'active'
  const [speechBubbleText, setSpeechBubbleText] = useState('');
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionContext, setSessionContext] = useState({});
  const [activeSection, setActiveSection] = useState('hero');
  const [isProximity, setIsProximity] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const companionRef = useRef(null);
  const bubbleTimeoutRef = useRef(null);

  // 1. SECTION AWARENESS (IntersectionObserver / Scroll)
  useEffect(() => {
    const sectionIds = ['hero', 'about', 'capabilities', 'skills', 'work', 'more-builds', 'lab', 'github', 'contact'];
    
    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. PROXIMITY DETECTION & CURSOR AWARENESS
  useEffect(() => {
    if (isOpen) return;

    const handleMouseMove = (e) => {
      if (!companionRef.current) return;
      const rect = companionRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

      // Within 220px proximity: KISA notices the visitor
      if (dist < 220) {
        if (!isProximity) {
          setIsProximity(true);
          setCharacterState('noticed');
          
          // Contextual greetings based on section
          let greeting = "Hi. Ask me about Kishore.";
          if (activeSection === 'work') greeting = "Exploring projects? Ask me about USBShield.";
          else if (activeSection === 'skills') greeting = "Curious about Kishore's tech stack?";
          else if (activeSection === 'contact') greeting = "Want to connect or WhatsApp Kishore?";
          else if (activeSection === 'lab') greeting = "Discovering the 3D lab experiments?";

          setSpeechBubbleText(greeting);
          setShowSpeechBubble(true);
        }
      } else {
        if (isProximity) {
          setIsProximity(false);
          setCharacterState('idle');
          if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
          bubbleTimeoutRef.current = setTimeout(() => setShowSpeechBubble(false), 600);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    };
  }, [isOpen, isProximity, activeSection]);

  // 3. AUTO-SCROLL CONVERSATION
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen]);

  // 4. KEYBOARD SHORTCUT (ESC to close) & GLOBAL EVENT HOOK
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setCharacterState('idle');
      }
    };
    const handleOpenEvent = () => {
      setIsOpen(true);
      setCharacterState('active');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-portfolio-assistant', handleOpenEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-portfolio-assistant', handleOpenEvent);
    };
  }, [isOpen]);

  // 5. INTERACTION HANDLER: OPEN KISA
  const handleOpenCompanion = () => {
    setCharacterState('active');
    setShowSpeechBubble(false);
    setIsOpen(true);
  };

  const handleCloseCompanion = () => {
    setIsOpen(false);
    setCharacterState('idle');
  };

  // 6. SEND MESSAGE HANDLER
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userMessageObj = {
      id: Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessageObj]);
    setInputMessage('');
    setLoading(true);
    setCharacterState('talking'); // KISA enters talking/processing state

    try {
      const response = await sendAIMessage(query, messages, sessionContext);

      const aiMessageObj = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.reply,
        provider: response.provider,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMessageObj]);

      // Update contextual references if returned
      if (response.updatedContext) {
        setSessionContext(response.updatedContext);
      }
    } catch (err) {
      console.error('KISA AI error:', err);
      const errorMessageObj = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Looks like my local intelligence is offline right now. You can still explore Kishore's projects, skills, and contact information directly across the portfolio.",
        provider: 'fallback',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessageObj]);
    } finally {
      setLoading(false);
      setCharacterState('active'); // Return to attentive listening
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setSessionContext({});
    setCharacterState('active');
  };

  return (
    <>
      <style>{`
        @keyframes kisaFloatPedestal {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes kisaBubbleIn {
          from { opacity: 0; transform: translateY(8px) scale(0.94); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes kisaModalSlideUp {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes kisaPulseRing {
          0% { transform: scale(0.85); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 0.2; }
          100% { transform: scale(0.85); opacity: 0.8; }
        }
        .kisa-chip-btn:hover {
          background: rgba(var(--glass-rgb), 0.1) !important;
          border-color: var(--border-hover) !important;
          color: var(--text) !important;
          transform: translateY(-1px);
        }
        .kisa-companion-anchor:hover .kisa-pedestal-ring {
          border-color: rgba(var(--glass-rgb), 0.4) !important;
          box-shadow: 0 0 20px rgba(var(--glass-rgb), 0.15);
        }
        @media (max-width: 640px) {
          .kisa-modal-container {
            width: 100% !important;
            max-width: 100% !important;
            height: 94vh !important;
            border-radius: 20px 20px 0 0 !important;
            margin: 0 !important;
          }
          .kisa-companion-anchor {
            bottom: 16px !important;
            right: 16px !important;
          }
        }
      `}</style>

      {/* ========================================================
          1. COMPANION CHARACTER (DESKTOP & MOBILE AMBIENT DOCK)
          ======================================================== */}
      {!isOpen && (
        <div
          ref={companionRef}
          className="kisa-companion-anchor"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '28px',
            zIndex: 95,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={handleOpenCompanion}
        >
          {/* Proximity / Hover Speech Bubble */}
          {showSpeechBubble && (
            <div
              style={{
                position: 'absolute',
                bottom: '128px',
                right: '0',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '10px 14px',
                color: 'var(--text)',
                boxShadow: '0 16px 36px rgba(var(--shadow-rgb), 0.4)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                animation: 'kisaBubbleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--text)',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                }}
              >
                {speechBubbleText}
              </span>
            </div>
          )}

          {/* 3D KISA Character Viewport */}
          <div
            style={{
              position: 'relative',
              animation: 'kisaFloatPedestal 4s infinite ease-in-out',
            }}
          >
            <KisaCharacter
              state={characterState}
              size={120}
              interactive={true}
              onClick={handleOpenCompanion}
              activeSection={activeSection}
            />
          </div>

          {/* Laboratory Pedestal & Status HUD */}
          <div
            className="kisa-pedestal-ring"
            style={{
              marginTop: '-16px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 8px 24px rgba(var(--shadow-rgb), 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.25s ease',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--text)',
                boxShadow: '0 0 8px rgba(var(--glass-rgb), 0.8)',
                display: 'inline-block',
                animation: 'kisaPulseRing 2.4s infinite ease-in-out',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: 'var(--text)',
              }}
            >
              KISA
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                color: 'var(--text-dim)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              [{activeSection}]
            </span>
          </div>
        </div>
      )}

      {/* ========================================================
          2. CONVERSATION INTERFACE (ORIGINATING FROM KISA)
          ======================================================== */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="kisa-assistant-title"
          onClick={handleCloseCompanion}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(var(--shadow-rgb), 0.65)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: 'clamp(12px, 3vw, 28px)',
          }}
        >
          <div
            className="kisa-modal-container"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '470px',
              height: 'min(740px, calc(100vh - 48px))',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '26px',
              overflow: 'hidden',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              boxShadow: '0 28px 80px rgba(var(--shadow-rgb), 0.7)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              animation: 'kisaModalSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Header: Visual Connection to KISA 3D Character */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'rgba(var(--glass-rgb), 0.03)',
                position: 'relative',
              }}
            >
              {/* KISA Perched In Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <KisaCharacter
                    state={characterState}
                    size={72}
                    interactive={true}
                    activeSection={activeSection}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3
                      id="kisa-assistant-title"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.9375rem',
                        fontWeight: 800,
                        color: 'var(--text)',
                        letterSpacing: '0.06em',
                        margin: 0,
                      }}
                    >
                      KISA
                    </h3>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: 'rgba(var(--glass-rgb), 0.08)',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.08em',
                      }}
                    >
                      COMPANION AI
                    </span>
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.04em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      marginTop: '2px',
                    }}
                  >
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: 'var(--text)',
                        display: 'inline-block',
                      }}
                    />
                    {loading ? 'PROCESSING QUERY...' : `OBSERVING [${activeSection.toUpperCase()}]`}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {messages.length > 0 && (
                  <button
                    onClick={handleClearChat}
                    type="button"
                    title="Reset session"
                    aria-label="Reset session"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    <RotateCcw size={16} />
                  </button>
                )}

                <button
                  onClick={handleCloseCompanion}
                  type="button"
                  title="Close conversation"
                  aria-label="Close conversation"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s ease',
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable Conversation Area */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {/* Empty State: KISA Greeting & Suggested Prompts */}
              {messages.length === 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    margin: 'auto 0',
                    padding: '16px 8px',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'rgba(var(--glass-rgb), 0.05)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text)',
                      marginBottom: '12px',
                    }}
                  >
                    <Sparkles size={20} />
                  </div>

                  <h4
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.0625rem',
                      fontWeight: 700,
                      color: 'var(--text)',
                      margin: '0 0 6px 0',
                    }}
                  >
                    Hi. I'm KISA.
                  </h4>

                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.84375rem',
                      lineHeight: 1.5,
                      color: 'var(--text-muted)',
                      maxWidth: '360px',
                      margin: '0 0 18px 0',
                    }}
                  >
                    I am Kishore's portfolio companion. Ask me anything about his projects, skills, game development, education, or how to reach him.
                  </p>

                  {/* Section Contextual Suggestion Banner */}
                  {SECTION_PROMPT_MAP[activeSection] && (
                    <button
                      onClick={() => handleSendMessage(SECTION_PROMPT_MAP[activeSection])}
                      className="kisa-chip-btn"
                      type="button"
                      style={{
                        width: '100%',
                        maxWidth: '380px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: 'rgba(var(--glass-rgb), 0.05)',
                        border: '1px dashed var(--border)',
                        color: 'var(--text)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        marginBottom: '16px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Compass size={14} style={{ opacity: 0.8 }} />
                        <span>Section topic: "{SECTION_PROMPT_MAP[activeSection]}"</span>
                      </span>
                      <ChevronRight size={14} style={{ opacity: 0.6 }} />
                    </button>
                  )}

                  {/* Suggested Question Chips */}
                  <div style={{ width: '100%', textAlign: 'left' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        letterSpacing: '0.08em',
                        color: 'var(--text-dim)',
                        marginBottom: '8px',
                        paddingLeft: '4px',
                      }}
                    >
                      SUGGESTED INQUIRIES:
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                      }}
                    >
                      {SUGGESTED_QUESTIONS_DEFAULT.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSendMessage(q)}
                          className="kisa-chip-btn"
                          type="button"
                          style={{
                            background: 'rgba(var(--glass-rgb), 0.04)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-muted)',
                            padding: '6px 12px',
                            borderRadius: '9999px',
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <span>{q}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Conversation Messages */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '100%',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      letterSpacing: '0.08em',
                      color: 'var(--text-dim)',
                      marginBottom: '4px',
                      padding: '0 4px',
                    }}
                  >
                    {msg.role === 'user' ? 'YOU' : 'KISA'} • {msg.timestamp}
                  </span>

                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.role === 'user' ? 'rgba(var(--glass-rgb), 0.08)' : 'rgba(var(--glass-rgb), 0.03)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      maxWidth: '92%',
                      wordBreak: 'break-word',
                      boxShadow: '0 4px 20px rgba(var(--shadow-rgb), 0.1)',
                    }}
                  >
                    {msg.role === 'user' ? (
                      <p style={{ margin: 0, fontSize: '0.90625rem', lineHeight: 1.5 }}>
                        {msg.content}
                      </p>
                    ) : (
                      <MarkdownRenderer content={msg.content} />
                    )}
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {loading && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    maxWidth: '100%',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      letterSpacing: '0.08em',
                      color: 'var(--text-dim)',
                      marginBottom: '4px',
                      padding: '0 4px',
                    }}
                  >
                    KISA • THINKING
                  </span>

                  <div
                    style={{
                      padding: '12px 18px',
                      borderRadius: '16px 16px 16px 4px',
                      background: 'rgba(var(--glass-rgb), 0.03)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--text)',
                          opacity: 0.6,
                          animation: 'kisaPulseRing 1.2s infinite ease-in-out',
                        }}
                      />
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--text)',
                          opacity: 0.8,
                          animation: 'kisaPulseRing 1.2s infinite ease-in-out 0.2s',
                        }}
                      />
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--text)',
                          opacity: 1,
                          animation: 'kisaPulseRing 1.2s infinite ease-in-out 0.4s',
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Consulting portfolio intelligence...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div
              style={{
                padding: '14px 18px',
                borderTop: '1px solid var(--border-subtle)',
                background: 'rgba(var(--glass-rgb), 0.02)',
              }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(var(--glass-rgb), 0.04)',
                  border: '1px solid var(--border)',
                  borderRadius: '9999px',
                  padding: '6px 8px 6px 18px',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask KISA about Kishore's projects, skills..."
                  aria-label="Ask KISA about Kishore's portfolio"
                  disabled={loading}
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                  }}
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || loading}
                  aria-label="Send message"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: inputMessage.trim() && !loading ? 'var(--text)' : 'rgba(var(--glass-rgb), 0.1)',
                    color: inputMessage.trim() && !loading ? 'var(--bg)' : 'var(--text-dim)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputMessage.trim() && !loading ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Send size={15} />
                </button>
              </form>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  padding: '0 4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  color: 'var(--text-dim)',
                }}
              >
                <span>Local AI · Grounded in Kishore's Portfolio</span>
                <span>ESC to minimize</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default KisaCompanion;
