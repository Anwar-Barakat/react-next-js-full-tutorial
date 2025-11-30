import React from 'react';

type ButtonProps = {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
} & Omit<React.ComponentProps<'button'>, 'children'>;

export const Button = ({ variant, children, ...rest }: ButtonProps) => {
  const variantClass = variant === 'primary' ? 'btn-primary' : 'btn-muted';
  
  return (
    <button className={`btn ${variantClass}`} {...rest}>
      {children}
    </button>
  );
};