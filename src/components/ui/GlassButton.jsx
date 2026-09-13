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
      style={style}
      size={size}
      radius={9999}
      tint="#ffffff"
      tintOpacity={isPrimary ? 0.12 : 0.04}
      blur={12}
      textColor="#ffffff"
      lineColor="#ffffff"
      baseColor={isPrimary ? '#aaaaaa' : '#525252'}
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
