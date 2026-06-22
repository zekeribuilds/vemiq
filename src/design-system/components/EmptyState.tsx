'use client';

/**
 * Vemiq Empty State Component
 * 
 * Every empty state must:
 * 1. Explain what is missing
 * 2. Explain why it matters
 * 3. Provide next action
 */

import React from 'react';
import { motion } from 'framer-motion';
import { colors, spacing, typography } from '../tokens';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, actionLabel, onAction, className = '', style, ...props }, ref) => {
    console.log('[EMPTY_STATE] Rendering EmptyState with title:', title);
    
    const containerStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: spacing[32],
      gap: spacing[16],
      backgroundColor: colors.background.surface,
      border: `1px solid ${colors.border.DEFAULT}`,
      borderRadius: spacing[16],
      ...style,
    };

    const iconContainerStyles: React.CSSProperties = {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      backgroundColor: colors.background.elevated,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing[16],
    };

    const iconStyles: React.CSSProperties = {
      color: colors.text.quaternary,
    };

    const titleStyles: React.CSSProperties = {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.h3,
      fontWeight: typography.fontWeight.semibold,
      color: colors.text.primary,
      marginBottom: spacing[8],
    };

    const descriptionStyles: React.CSSProperties = {
      fontFamily: typography.fontFamily.sans,
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.regular,
      color: colors.text.tertiary,
      maxWidth: '400px',
      lineHeight: typography.lineHeight.relaxed,
      marginBottom: spacing[24],
    };
    
    if (typeof motion === 'undefined') {
      console.error('[EMPTY_STATE] motion is undefined - framer-motion not loaded correctly');
      return (
        <div ref={ref} className={className} style={containerStyles} {...props}>
          {icon && (
            <div style={iconContainerStyles}>
              <div style={iconStyles}>{icon}</div>
            </div>
          )}
          <div style={titleStyles}>{title}</div>
          <div style={descriptionStyles}>{description}</div>
          {actionLabel && onAction && (
            <button
              style={{
                padding: `${spacing[12]} ${spacing[24]}`,
                fontFamily: typography.fontFamily.sans,
                fontSize: typography.fontSize.body,
                fontWeight: typography.fontWeight.medium,
                color: colors.text.primary,
                backgroundColor: colors.primary.DEFAULT,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={onAction}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary.DEFAULT;
              }}
            >
              {actionLabel}
            </button>
          )}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={className}
        style={containerStyles}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {icon && (
          <div style={iconContainerStyles}>
            <div style={iconStyles}>{icon}</div>
          </div>
        )}
        <div style={titleStyles}>{title}</div>
        <div style={descriptionStyles}>{description}</div>
        {actionLabel && onAction && (
          <button
            style={{
              padding: `${spacing[12]} ${spacing[24]}`,
              fontFamily: typography.fontFamily.sans,
              fontSize: typography.fontSize.body,
              fontWeight: typography.fontWeight.medium,
              color: colors.text.primary,
              backgroundColor: colors.primary.DEFAULT,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={onAction}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary.DEFAULT;
            }}
          >
            {actionLabel}
          </button>
        )}
      </motion.div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export default EmptyState;
