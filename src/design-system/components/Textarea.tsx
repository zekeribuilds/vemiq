/**
 * Vemiq Textarea Component
 * 
 * Consistent textarea styling matching Input component
 * Identical focus states and visual behavior
 */

import React from 'react';
import { colors, radius, spacing, typography, shadows } from '../tokens';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      fullWidth = false,
      resize = 'vertical',
      disabled,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const textareaStyles: React.CSSProperties = {
      width: fullWidth ? '100%' : 'auto',
      minHeight: '120px',
      padding: spacing[16],
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
      resize,
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

    return (
      <div style={{ width: fullWidth ? '100%' : 'auto' }} className={className}>
        {label && <label style={labelStyles}>{label}</label>}
        <textarea
          ref={ref}
          disabled={disabled}
          style={{
            ...textareaStyles,
            ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
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
        {error && <div style={errorStyles}>{error}</div>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
