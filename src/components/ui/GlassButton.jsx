import React from 'react';
import SpecularButton from '../reactbits/SpecularButton/SpecularButton';

export function GlassButton({
  children,
  href,
  onClick,
  variant = 'secondary',
  className = '',
  target,
  rel,
  style = {},
  size = 'md',
  ...props
}) {
  const isPrimary = variant === 'primary';

  return (
    <SpecularButton
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      className={className}
      style={{
        background: isPrimary ? '#ffffff' : 'rgba(255, 255, 255, 0.06)',
        border: isPrimary ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: isPrimary ? '#000000' : '#ffffff',
        fontWeight: isPrimary ? 700 : 600,
        boxShadow: isPrimary
          ? '0 4px 20px rgba(255, 255, 255, 0.3)'
          : '0 4px 20px rgba(0, 0, 0, 0.4)',
        ...style
      }}
      size={size}
      radius={9999}
      tint="#ffffff"
      tintOpacity={isPrimary ? 0.2 : 0.04}
      blur={12}
      textColor={isPrimary ? '#000000' : '#ffffff'}
      lineColor={isPrimary ? '#ffffff' : '#ffffff'}
      baseColor={isPrimary ? '#dddddd' : '#444444'}
      intensity={isPrimary ? 1.4 : 1.0}
      shineSize={isPrimary ? 20 : 12}
      shineFade={35}
      thickness={1.2}
      speed={0.4}
      followMouse={true}
      proximity={300}
      autoAnimate={true}
      {...props}
    >
      {children}
    </SpecularButton>
  );
}

export default GlassButton;
