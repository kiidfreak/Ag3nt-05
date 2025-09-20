/**
 * Modern Card Component
 * Reusable card with multiple variants and animations
 */

import React from 'react';
import { variants, borderRadius, shadows, animations } from '../../design-system';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  hover?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  hover = false,
  children,
  className = '',
  ...props
}) => {
  const variantStyles = variants.card[variant];
  
  const baseStyles = {
    padding: '1.5rem',
    borderRadius: variantStyles.radius,
    border: `1px solid ${variantStyles.border}`,
    boxShadow: variantStyles.shadow,
    backgroundColor: variantStyles.bg,
    transition: `all ${animations.duration.normal} ${animations.easing.easeInOut}`,
  };

  const hoverStyles = hover ? {
    transform: 'translateY(-2px)',
    boxShadow: shadows.lg,
  } : {};

  return (
    <div
      style={{
        ...baseStyles,
        ...hoverStyles,
      }}
      className={`
        group relative overflow-hidden
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
      
      {/* Subtle gradient overlay on hover */}
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div
    className={`mb-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3
    className={`text-lg font-semibold text-gray-900 ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p
    className={`text-sm text-gray-600 mt-1 ${className}`}
    {...props}
  >
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div
    className={`${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div
    className={`mt-4 pt-4 border-t border-gray-200 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
