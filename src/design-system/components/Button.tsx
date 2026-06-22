/**
 * Vemiq Button Component
 * 
 * Primary, Secondary, Ghost, and Danger variants
 * Consistent sizing and states across the application
 */

import React from 'react';
import { colors, radius, spacing, typography } from '../tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[8],
      fontFamily: typography.fontFamily.sans,
      fontWeight: typography.fontWeight.medium,
      borderRadius: radius[8],
      border: 'none',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      width: fullWidth ? '100%' : 'auto',
    };

    const sizeStyles = {
      sm: {
        padding: `${spacing[8]} ${spacing[16]}`,
        fontSize: typography.fontSize.caption,
        minHeight: '32px',
      },
      md: {
        padding: `${spacing[12]} ${spacing[24]}`,
        fontSize: typography.fontSize.body,
        minHeight: '40px',
      },
      lg: {
        padding: `${spacing[16]} ${spacing[32]}`,
        fontSize: typography.fontSize.body,
        minHeight: '48px',
      },
    };

    const variantStyles = {
      primary: {
        backgroundColor: disabled ? colors.text.quaternary : colors.primary.DEFAULT,
        color: colors.text.primary,
        '&:hover:not(:disabled)': {
          backgroundColor: colors.primary.hover,
        },
        '&:active:not(:disabled)': {
          backgroundColor: colors.primary.active,
        },
      },
      secondary: {
        backgroundColor: colors.background.elevated,
        color: colors.text.secondary,
        border: `1px solid ${colors.border.DEFAULT}`,
        '&:hover:not(:disabled)': {
          backgroundColor: colors.background.overlay,
          borderColor: colors.border.hover,
        },
        '&:active:not(:disabled)': {
          backgroundColor: colors.background.overlay,
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.text.secondary,
        '&:hover:not(:disabled)': {
          backgroundColor: colors.background.elevated,
        },
        '&:active:not(:disabled)': {
          backgroundColor: colors.background.overlay,
        },
      },
      danger: {
        backgroundColor: disabled ? colors.text.quaternary : colors.error.DEFAULT,
        color: colors.text.primary,
        '&:hover:not(:disabled)': {
          backgroundColor: colors.error.hover,
        },
        '&:active:not(:disabled)': {
          backgroundColor: colors.error.hover,
        },
      },
    };

    const style = {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        style={style as React.CSSProperties}
        className={className}
        {...props}
      >
        {isLoading ? (
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-spin"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
