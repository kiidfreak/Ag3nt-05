/**
 * Modern Button Component
 * Reusable button with multiple variants and states
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { variants, typography, spacing, borderRadius, shadows, animations } from '../../design-system';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = variants.button[variant];
  
  const sizeStyles = {
    sm: {
      padding: `${spacing[2]} ${spacing[3]}`,
      fontSize: typography.fontSize.sm,
      height: '32px',
    },
    md: {
      padding: `${spacing[3]} ${spacing[4]}`,
      fontSize: typography.fontSize.base,
      height: '40px',
    },
    lg: {
      padding: `${spacing[4]} ${spacing[6]}`,
      fontSize: typography.fontSize.lg,
      height: '48px',
    },
  };

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    border: 'none',
    borderRadius: borderRadius.md,
    fontWeight: typography.fontWeight.semibold,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: `all ${animations.duration.normal} ${animations.easing.easeInOut}`,
    opacity: disabled || loading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    position: 'relative' as const,
    overflow: 'hidden',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    ...sizeStyles[size],
    ...variantStyles,
  };

  const hoverStyles = {
    transform: disabled || loading ? 'none' : 'translateY(-1px)',
    boxShadow: disabled || loading ? variantStyles.shadow : shadows.lg,
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...hoverStyles,
      }}
      className={`
        group relative overflow-hidden
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-black before:to-transparent
        before:opacity-0 before:transition-opacity before:duration-300
        hover:before:opacity-5
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      
      {!loading && leftIcon && (
        <span className="flex-shrink-0">{leftIcon}</span>
      )}
      
      <span className="flex-1 text-center">{children}</span>
      
      {!loading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
      
      {/* Ripple effect */}
      <span className="absolute inset-0 bg-black opacity-0 group-active:opacity-10 transition-opacity duration-150" />
    </button>
  );
};

export default Button;
