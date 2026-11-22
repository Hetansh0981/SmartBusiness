import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'accent';
  size?: 'sm' | 'md';
}

export function Badge({
  className = '',
  variant = 'neutral',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded select-none';

  const variants = {
    neutral: 'bg-fog/15 text-fog border border-hairline',
    brand: 'bg-accent/10 text-accent border border-accent/20',
    success: 'bg-success/15 text-success border border-success/20',
    warning: 'bg-warning/15 text-warning border border-warning/20',
    danger: 'bg-danger/15 text-danger border border-danger/20',
    accent: 'bg-accent/15 text-accent border border-accent/20',
  };

  const sizes = {
    sm: 'text-[11px] h-5 px-1.5 gap-1',
    md: 'text-xs h-6 px-2.5 gap-1.5',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  );
}