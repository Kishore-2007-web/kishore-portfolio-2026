import React from 'react';

export function GlassPanel({ children, className = '', style = {}, ...props }) {
  return (
    <div className={`glass-panel ${className}`} style={style} {...props}>
      {children}
    </div>
  );
}
