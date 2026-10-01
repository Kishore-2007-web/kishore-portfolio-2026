import React, { useState, useEffect, useRef } from 'react';
import { sendAIMessage, AI_CONFIG } from '../../services/aiService';
import { MarkdownRenderer } from './MarkdownRenderer';
import {
  MessageSquare,
  Sparkles,
  Send,
  X,
  RotateCcw,
  Bot,
  User,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Terminal
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  "Who is Kishore?",
  "Show me his projects",
  "Tell me about USBShield",
  "What is Kisa AI?",
  "What technologies does Kishore use?",
  "What is Rise of Aran?",
  "What 3D software does Kishore use?",
  "How can I contact Kishore?"
];

export function PortfolioAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionContext, setSessionContext] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen]);

  // Keyboard shortcut: Escape to close & Custom event to open from anywhere
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    const handleOpenEvent = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-portfolio-assistant', handleOpenEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-portfolio-assistant', handleOpenEvent);
    };
  }, [isOpen]);

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
      if (response.sessionContext) {
        setSessionContext(response.sessionContext);
      }
    } catch (err) {
      console.error('AI query error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: "I'm having a brief connection issue. You can still explore Kishore's projects on the page or connect directly via WhatsApp.",
          isError: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
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
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Floating Launcher Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="kisa-launcher-btn"
        aria-label="Ask Kishore's AI Portfolio Assistant"
        title="Open Kishore's AI Assistant"
        type="button"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 95,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 20px',
          borderRadius: '9999px',
          background: 'rgba(var(--glass-rgb), 0.08)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 12px 36px rgba(var(--shadow-rgb), 0.35)',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.8125rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--text)',
            boxShadow: '0 0 10px rgba(var(--glass-rgb), 0.8)',
            display: 'inline-block',
            animation: 'kisaPulse 2s infinite ease-in-out',
          }}
        />
        <span>KISA // ASK AI</span>
        <Sparkles size={14} style={{ opacity: 0.8 }} />
      </button>

      <style>{`
        @keyframes kisaPulse {
          0%, 100% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes kisaSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .kisa-launcher-btn:hover {
          background: rgba(var(--glass-rgb), 0.14) !important;
          border-color: var(--border-hover) !important;
          transform: translateY(-2px);
          box-shadow: 0 16px 44px rgba(var(--shadow-rgb), 0.5) !important;
        }
        .kisa-chip-btn:hover {
          background: rgba(var(--glass-rgb), 0.08) !important;
          border-color: var(--border-hover) !important;
          color: var(--text) !important;
          transform: translateY(-1px);
        }
      `}</style>

      {/* Slide-over / Modal Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="kisa-assistant-title"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(var(--shadow-rgb), 0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: 'clamp(12px, 3vw, 24px)',
            animation: 'kisaFade 0.2s ease-out',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '460px',
              height: 'min(720px, calc(100vh - 48px))',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '24px',
              overflow: 'hidden',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              boxShadow: '0 24px 70px rgba(var(--shadow-rgb), 0.65)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              animation: 'kisaSlideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid rgba(var(--glass-rgb), 0.08)',
                background: 'rgba(var(--glass-rgb), 0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: 'rgba(var(--glass-rgb), 0.06)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text)',
                  }}
                >
                  <Bot size={17} />
                </div>
                <div>
                  <h3
                    id="kisa-assistant-title"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.9375rem',
                      fontWeight: 800,
                      color: 'var(--text)',
                      letterSpacing: '0.04em',
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    KISA // PORTFOLIO AI
                  </h3>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.06em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
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
                    LOCAL INTELLIGENCE ACTIVE
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {messages.length > 0 && (
                  <button
                    onClick={handleClearChat}
                    type="button"
                    title="Reset conversation"
                    aria-label="Reset conversation"
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
                  onClick={() => setIsOpen(false)}
                  type="button"
                  title="Close assistant"
                  aria-label="Close assistant"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {/* Empty State Greetings & Suggestion Chips */}
              {messages.length === 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '16px',
                    margin: 'auto 0',
                  }}
                >
                  <div
                    style={{
                      padding: '16px',
                      borderRadius: '16px',
                      background: 'rgba(var(--glass-rgb), 0.03)',
                      border: '1px solid var(--border)',
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        marginBottom: '8px',
                        letterSpacing: '0.08em',
                      }}
                    >
                      <Terminal size={14} />
                      <span>KISHORE'S PORTFOLIO ASSISTANT</span>
                    </div>

                    <p
                      style={{
                        fontSize: '0.9375rem',
                        lineHeight: 1.6,
                        color: 'var(--text)',
                        marginBottom: '6px',
                        fontWeight: 500,
                      }}
                    >
                      Hi, I'm Kishore's portfolio assistant. Ask me about his projects, skills, education, experience, or direct contact methods.
                    </p>

                    <span
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      Grounded strictly in verified portfolio data.
                    </span>
                  </div>

                  {/* Suggested Question Chips */}
                  <div style={{ width: '100%' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        marginBottom: '10px',
                      }}
                    >
                      Suggested Inquiries
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      {SUGGESTED_QUESTIONS.map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(question)}
                          type="button"
                          className="kisa-chip-btn"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            background: 'rgba(var(--glass-rgb), 0.035)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-secondary)',
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.8125rem',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <span>{question}</span>
                          <ChevronRight size={14} style={{ opacity: 0.6 }} />
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
                  {/* Sender Label */}
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

                  {/* Message Bubble */}
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
                      <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.5 }}>
                        {msg.content}
                      </p>
                    ) : (
                      <MarkdownRenderer content={msg.content} />
                    )}
                  </div>
                </div>
              ))}

              {/* Loading State */}
              {loading && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    background: 'rgba(var(--glass-rgb), 0.03)',
                    border: '1px solid var(--border)',
                    maxWidth: '160px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--text)',
                      animation: 'kisaDot 1s infinite alternate',
                    }}
                  />
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--text)',
                      animation: 'kisaDot 1s infinite 0.2s alternate',
                    }}
                  />
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--text)',
                      animation: 'kisaDot 1s infinite 0.4s alternate',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      marginLeft: '4px',
                    }}
                  >
                    Thinking...
                  </span>
                </div>
              )}

              <style>{`
                @keyframes kisaDot {
                  from { opacity: 0.3; transform: scale(0.8); }
                  to { opacity: 1; transform: scale(1.2); }
                }
              `}</style>

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div
              style={{
                padding: '16px 20px',
                borderTop: '1px solid rgba(var(--glass-rgb), 0.08)',
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
                  placeholder="Ask about Kishore's projects, skills..."
                  aria-label="Ask about Kishore's portfolio"
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
                <span>ESC to close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PortfolioAssistant;
