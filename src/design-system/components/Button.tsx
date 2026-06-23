/**
 * Vemiq Button Component
 * 
 * Primary, Secondary, Ghost, and Danger variants
 * Consistent sizing and states across the application
 */

import React from 'react';
import { colors, spacing } from '../tokens/index';
import { VemiqIcon } from '@/components/VemiqIcon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: string; // Icon key from registry
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      fontFamily: 'system-ui, sans-serif',
      fontWeight: '500',
      borderRadius: '8px',
      border: 'none',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      width: fullWidth ? '100%' : 'auto',
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: {
        padding: `${spacing.xs} ${spacing.md}`,
        fontSize: '12px',
        minHeight: '32px',
      },
      md: {
        padding: `${spacing.sm} ${spacing.lg}`,
        fontSize: '16px',
        minHeight: '40px',
      },
      lg: {
        padding: `${spacing.md} ${spacing.xl}`,
        fontSize: '16px',
        minHeight: '48px',
      },
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        backgroundColor: disabled ? colors.text.disabled : colors.primary,
        color: colors.text.primary,
      },
      secondary: {
        backgroundColor: colors.background.elevated,
        color: colors.text.secondary,
        border: `1px solid ${colors.border}`,
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.text.secondary,
      },
      danger: {
        backgroundColor: disabled ? colors.text.disabled : colors.danger,
        color: colors.text.primary,
      },
    };

    const style: React.CSSProperties = {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        style={style}
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
            {icon && iconPosition === 'left' && (
              <VemiqIcon category="action" name={icon} size={16} />
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <VemiqIcon category="action" name={icon} size={16} />
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
