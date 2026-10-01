import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export function WhatsAppQR({
  url,
  size = 120,
  className = '',
  style = {},
}) {
  const [svgContent, setSvgContent] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    QRCode.toString(url, {
      type: 'svg',
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((svg) => {
        if (isMounted) {
          setSvgContent(svg);
        }
      })
      .catch((err) => {
        console.error('Failed to generate WhatsApp QR code:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  const handleCopy = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }
  };

  return (
    <div
      className={`whatsapp-qr-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 20px',
        borderRadius: '16px',
        background: 'rgba(var(--glass-rgb), 0.03)',
        border: '1px solid var(--border)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        maxWidth: '180px',
        textAlign: 'center',
        userSelect: 'none',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style,
      }}
      aria-label="WhatsApp Desktop QR Connect"
    >
      {/* Header Label */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '10px',
          display: 'block',
        }}
      >
        SCAN TO CONNECT
      </span>

      {/* QR Code Frame */}
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          padding: '8px',
          background: '#ffffff',
          borderRadius: '10px',
          border: '1px solid rgba(var(--glass-rgb), 0.15)',
          boxShadow: '0 8px 24px rgba(var(--shadow-rgb), 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          transition: 'transform 0.3s ease',
        }}
        role="img"
        aria-label="Scan this QR code with your mobile camera to open WhatsApp chat with Kishore"
      >
        {svgContent ? (
          <div
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.04)',
              borderRadius: '6px',
              animation: 'pulse 1.5s infinite',
            }}
          />
        )}
      </div>

      {/* Footer Label & Quick Copy Action */}
      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.16em',
            color: 'var(--text-secondary)',
          }}
        >
          WHATSAPP
        </span>

        <button
          onClick={handleCopy}
          type="button"
          style={{
            background: 'none',
            border: 'none',
            padding: '2px 6px',
            color: copied ? 'var(--text)' : 'var(--text-dim)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            transition: 'color 0.2s ease',
            textDecoration: 'none',
          }}
          title="Click to copy WhatsApp direct link"
          aria-label="Copy WhatsApp direct link to clipboard"
        >
          {copied ? '✓ COPIED LINK' : 'CLICK TO COPY LINK'}
        </button>
      </div>
    </div>
  );
}

export default WhatsAppQR;
