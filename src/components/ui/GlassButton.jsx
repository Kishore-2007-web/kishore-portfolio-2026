import React from 'react';

export function GlassButton({
  children,
  href,
  onClick,
  variant = 'secondary', // 'primary' | 'secondary'
  className = '',
  target,
  rel,
  ...props
}) {
  const baseClass = `glass-button ${variant === 'primary' ? 'glass-button-primary' : ''} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={baseClass}
        target={target || (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('https://wa.me') ? '_blank' : undefined)}
        rel={rel || (href.startsWith('http') ? 'noopener noreferrer' : undefined)}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClass} {...props}>
      {children}
    </button>
  );
}
