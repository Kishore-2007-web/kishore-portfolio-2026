import React, { useState, useEffect } from 'react';
import { siteConfig } from '../../data/site';
import { GlassPanel } from '../ui/GlassPanel';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Active section detection
      const sections = siteConfig.navLinks.map((link) => link.href.substring(1));
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: '20px',
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 16px',
        pointerEvents: 'none',
      }}
    >
      <GlassPanel
        style={{
          width: '100%',
          maxWidth: '1080px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          pointerEvents: 'auto',
          borderRadius: '9999px',
          borderColor: scrolled ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.1)',
          background: scrolled ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.035)',
        }}
      >
        {/* Brand Logo */}
        <a
          href="#hero"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.125rem',
            letterSpacing: '0.12em',
            color: '#ffffff',
            textDecoration: 'none',
          }}
        >
          KISHORE™
        </a>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
          className="desktop-nav"
        >
          <style>{`
            @media (max-width: 768px) {
              .desktop-nav { display: none !important; }
              .mobile-toggle { display: flex !important; }
            }
            @media (min-width: 769px) {
              .mobile-toggle { display: none !important; }
            }
          `}</style>
          
          {siteConfig.navLinks.map((link) => {
            const sectionId = link.href.substring(1);
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  textDecoration: 'none',
                  position: 'relative',
                  padding: '4px 0',
                  transition: 'color 0.2s ease',
                }}
              >
                {link.label}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      borderRadius: '1px',
                      background: '#ffffff',
                      boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
                    }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-toggle"
          aria-label="Toggle Navigation Menu"
          style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </GlassPanel>

      {/* Mobile Menu Modal Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '84px',
            left: '16px',
            right: '16px',
            pointerEvents: 'auto',
            zIndex: 99,
          }}
        >
          <GlassPanel
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              borderRadius: '20px',
              background: 'rgba(5, 5, 5, 0.95)',
            }}
          >
            {siteConfig.navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                {link.label}
              </a>
            ))}
          </GlassPanel>
        </div>
      )}
    </header>
  );
}
