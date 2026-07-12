/**
 * Vemiq Input Component
 * 
 * Consistent input styling with focus states
 * Identical height, radius, and focus behavior across all inputs
 */

import React from 'react';
import { colors, radius, spacing, typography, shadows } from '../tokens';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const inputStyles: React.CSSProperties = {
      width: fullWidth ? '100%' : 'auto',
      minHeight: '40px',
      padding: `${spacing[12]} ${spacing[16]}`,
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.regular,
      color: colors.text.primary,
      backgroundColor: colors.background.surface,
      border: `1px solid ${error ? colors.error.DEFAULT : colors.border.DEFAULT}`,
      borderRadius: radius[8],
      outline: 'none',
      transition: 'all 0.2s ease',
      cursor: disabled ? 'not-allowed' : 'text',
      ...(leftIcon && { paddingLeft: spacing[48] }),
      ...(rightIcon && { paddingRight: spacing[48] }),
    };

    const focusStyles: React.CSSProperties = {
      borderColor: colors.border.focus,
      boxShadow: shadows.glow,
    };

    const hoverStyles: React.CSSProperties = {
      borderColor: colors.border.hover,
    };

    const disabledStyles: React.CSSProperties = {
      opacity: 0.5,
      cursor: 'not-allowed',
    };

    const labelStyles: React.CSSProperties = {
      display: 'block',
      marginBottom: spacing[8],
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.caption,
      fontWeight: typography.fontWeight.medium,
      color: error ? colors.error.DEFAULT : colors.text.secondary,
    };

    const errorStyles: React.CSSProperties = {
      marginTop: spacing[8],
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.regular,
      color: colors.error.DEFAULT,
    };

    const iconStyles: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      color: colors.text.tertiary,
      pointerEvents: 'none',
    };

    return (
      <div style={{ width: fullWidth ? '100%' : 'auto' }} className={className}>
        {label && <label style={labelStyles}>{label}</label>}
        <div style={{ position: 'relative', display: 'inline-block', width: fullWidth ? '100%' : 'auto' }}>
          {leftIcon && (
            <div style={{ ...iconStyles, left: spacing[12] }}>{leftIcon}</div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            style={{
              ...inputStyles,
              ...(disabled ? disabledStyles : {}),
              ...style,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.border.focus;
              e.currentTarget.style.boxShadow = shadows.glow;
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error ? colors.error.DEFAULT : colors.border.DEFAULT;
              e.currentTarget.style.boxShadow = 'none';
              props.onBlur?.(e);
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.currentTarget.style.borderColor = colors.border.hover;
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled) {
                e.currentTarget.style.borderColor = error ? colors.error.DEFAULT : colors.border.DEFAULT;
              }
            }}
            {...props}
          />
          {rightIcon && (
            <div style={{ ...iconStyles, right: spacing[12] }}>{rightIcon}</div>
          )}
        </div>
        {error && <div style={errorStyles}>{error}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
