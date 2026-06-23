/**
 * Vemiq Input Component
 * 
 * Consistent input styling with focus states
 * Identical height, radius, and focus behavior across all inputs
 */

import React from 'react';
import { colors, spacing } from '../tokens/index';

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
      padding: `${spacing.sm} ${spacing.md}`,
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px',
      fontWeight: '400',
      color: colors.text.primary,
      backgroundColor: colors.background.surface,
      border: `1px solid ${error ? colors.danger : colors.border}`,
      borderRadius: '8px',
      outline: 'none',
      transition: 'all 0.2s ease',
      cursor: disabled ? 'not-allowed' : 'text',
      ...(leftIcon && { paddingLeft: spacing.xl }),
      ...(rightIcon && { paddingRight: spacing.xl }),
    };

    const labelStyles: React.CSSProperties = {
      display: 'block',
      marginBottom: spacing.sm,
      fontFamily: 'system-ui, sans-serif',
      fontSize: '12px',
      fontWeight: '500',
      color: error ? colors.danger : colors.text.secondary,
    };

    const errorStyles: React.CSSProperties = {
      marginTop: spacing.sm,
      fontFamily: 'system-ui, sans-serif',
      fontSize: '12px',
      fontWeight: '400',
      color: colors.danger,
    };

    const iconStyles: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      color: colors.text.muted,
      pointerEvents: 'none',
    };

    return (
      <div style={{ width: fullWidth ? '100%' : 'auto' }} className={className}>
        {label && <label style={labelStyles}>{label}</label>}
        <div style={{ position: 'relative', display: 'inline-block', width: fullWidth ? '100%' : 'auto' }}>
          {leftIcon && (
            <div style={{ ...iconStyles, left: spacing.sm }}>{leftIcon}</div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            style={{
              ...inputStyles,
              ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
              ...style,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.primary;
              e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary}33`;
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error ? colors.danger : colors.border;
              e.currentTarget.style.boxShadow = 'none';
              props.onBlur?.(e);
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.currentTarget.style.borderColor = colors.text.secondary;
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled) {
                e.currentTarget.style.borderColor = error ? colors.danger : colors.border;
              }
            }}
            {...props}
          />
          {rightIcon && (
            <div style={{ ...iconStyles, right: spacing.sm }}>{rightIcon}</div>
          )}
        </div>
        {error && <div style={errorStyles}>{error}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
