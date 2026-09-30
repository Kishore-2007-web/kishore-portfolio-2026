import React from 'react';

export function GlassButton({
  children,
  href,
  onClick,
  variant = 'secondary', // 'primary' | 'secondary'
  className = '',
  target,
  rel,
  style = {},
  size = 'md',
  ...props
}) {
  const isPrimary = variant === 'primary';
  const sizeClass = size === 'sm' ? 'glass-button-sm' : size === 'lg' ? 'glass-button-lg' : '';
  const baseClass = `glass-button ${isPrimary ? 'glass-button-primary' : ''} ${sizeClass} ${className}`.trim();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetEl = document.querySelector(href);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (href) {
    return (
      <a
        href={href}
        className={baseClass}
        style={style}
        onClick={handleClick}
        target={target || (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('https://wa.me') ? '_blank' : undefined)}
        rel={rel || (href.startsWith('http') ? 'noopener noreferrer' : undefined)}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button onClick={handleClick} className={baseClass} style={style} {...props}>
      {children}
    </button>
  );
}

export default GlassButton;
