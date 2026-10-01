import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

function CodeBlock({ code, language = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        margin: '12px 0',
        borderRadius: '8px',
        overflow: 'hidden',
        background: 'rgba(var(--shadow-rgb), 0.65)',
        border: '1px solid rgba(var(--glass-rgb), 0.12)',
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '0.8125rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          background: 'rgba(var(--glass-rgb), 0.04)',
          borderBottom: '1px solid rgba(var(--glass-rgb), 0.08)',
          color: 'var(--text-dim)',
          fontSize: '0.6875rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        <span>{language || 'CODE'}</span>
        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy code to clipboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            color: copied ? 'var(--text)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.6875rem',
            fontFamily: 'inherit',
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <pre
        style={{
          padding: '12px 14px',
          margin: 0,
          overflowX: 'auto',
          color: 'var(--text-primary)',
          lineHeight: 1.5,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Parses inline formatting: bold, italic, inline code, and links
 */
function parseInline(text) {
  const elements = [];
  let remaining = text;
  let keyIdx = 0;

  // Pattern matches:
  // 1. [text](url)
  // 2. `code`
  // 3. **bold**
  // 4. *italic*
  const pattern = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*)/;

  while (remaining.length > 0) {
    const match = remaining.match(pattern);
    if (!match) {
      elements.push(remaining);
      break;
    }

    const matchIndex = match.index;
    if (matchIndex > 0) {
      elements.push(remaining.slice(0, matchIndex));
    }

    const fullMatch = match[0];

    // Link: [text](url)
    if (match[2] && match[3]) {
      const linkText = match[2];
      const linkUrl = match[3];
      elements.push(
        <a
          key={`link-${keyIdx++}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--text)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          {linkText}
          <ExternalLink size={12} style={{ display: 'inline', opacity: 0.7 }} />
        </a>
      );
    }
    // Inline code: `code`
    else if (match[4]) {
      elements.push(
        <code
          key={`code-${keyIdx++}`}
          style={{
            background: 'rgba(var(--glass-rgb), 0.08)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.85em',
            color: 'var(--text-primary)',
            border: '1px solid rgba(var(--glass-rgb), 0.1)',
          }}
        >
          {match[4]}
        </code>
      );
    }
    // Bold: **bold**
    else if (match[5]) {
      elements.push(
        <strong key={`bold-${keyIdx++}`} style={{ fontWeight: 700, color: 'var(--text)' }}>
          {match[5]}
        </strong>
      );
    }
    // Italic: *italic*
    else if (match[6]) {
      elements.push(
        <em key={`italic-${keyIdx++}`} style={{ fontStyle: 'italic', opacity: 0.9 }}>
          {match[6]}
        </em>
      );
    }

    remaining = remaining.slice(matchIndex + fullMatch.length);
  }

  return elements;
}

/**
 * Safe, fast Markdown Parser and Renderer
 */
export function MarkdownRenderer({ content = '', className = '', style = {} }) {
  if (!content) return null;

  const lines = content.split('\n');
  const renderedElements = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let codeLang = '';
  let listBuffer = [];
  let listType = null; // 'ul' | 'ol'

  const flushList = () => {
    if (listBuffer.length > 0) {
      if (listType === 'ul') {
        renderedElements.push(
          <ul
            key={`list-${renderedElements.length}`}
            style={{
              paddingLeft: '20px',
              margin: '8px 0 12px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {listBuffer.map((item, idx) => (
              <li key={idx} style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                {parseInline(item)}
              </li>
            ))}
          </ul>
        );
      }
      listBuffer = [];
      listType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Fenced code block toggles
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        renderedElements.push(
          <CodeBlock
            key={`code-block-${renderedElements.length}`}
            code={codeBuffer.join('\n')}
            language={codeLang}
          />
        );
        codeBuffer = [];
        codeLang = '';
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Unordered List item: - item or * item
    const ulMatch = line.match(/^(\s*)[-*]\s+(.+)$/);
    if (ulMatch) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      listBuffer.push(ulMatch[2]);
      continue;
    }

    // Numbered List item: 1. item
    const olMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);
    if (olMatch) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      listBuffer.push(olMatch[2]);
      continue;
    }

    flushList();

    // Empty line / paragraph break
    if (line.trim() === '') {
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      renderedElements.push(
        <h4
          key={`h4-${renderedElements.length}`}
          style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: '0.04em',
            margin: '14px 0 6px 0',
          }}
        >
          {parseInline(line.slice(4))}
        </h4>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      renderedElements.push(
        <h3
          key={`h3-${renderedElements.length}`}
          style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontSize: '1.0625rem',
            fontWeight: 800,
            color: 'var(--text)',
            letterSpacing: '0.02em',
            margin: '16px 0 8px 0',
          }}
        >
          {parseInline(line.slice(3))}
        </h3>
      );
      continue;
    }

    // Blockquote: > quote
    if (line.startsWith('> ')) {
      renderedElements.push(
        <blockquote
          key={`quote-${renderedElements.length}`}
          style={{
            borderLeft: '2px solid var(--text)',
            paddingLeft: '12px',
            margin: '10px 0',
            fontStyle: 'italic',
            color: 'var(--text-secondary)',
            background: 'rgba(var(--glass-rgb), 0.02)',
            padding: '8px 12px',
            borderRadius: '0 8px 8px 0',
          }}
        >
          {parseInline(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Regular paragraph
    renderedElements.push(
      <p
        key={`p-${renderedElements.length}`}
        style={{
          margin: '0 0 10px 0',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
        }}
      >
        {parseInline(line)}
      </p>
    );
  }

  flushList();

  return (
    <div className={`markdown-body ${className}`} style={{ fontSize: '0.9375rem', ...style }}>
      {renderedElements}
    </div>
  );
}

export default MarkdownRenderer;
