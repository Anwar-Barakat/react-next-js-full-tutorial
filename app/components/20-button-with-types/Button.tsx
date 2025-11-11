import React from 'react';

type ButtonProps = {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
} & Omit<React.ComponentProps<'button'>, 'children'>;

export const Button = ({ variant, children, ...rest }: ButtonProps) => {
  const baseClasses = 'px-4 py-2 rounded-md text-white';
  const variantClasses = variant === 'primary' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600';

  return (
    <button className={`${baseClasses} ${variantClasses}`} {...rest}>
      {children}
    </button>
  );
};