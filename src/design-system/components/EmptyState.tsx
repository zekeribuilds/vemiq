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
import { colors, spacing } from '../tokens/index';
import { VemiqIcon } from '@/components/VemiqIcon';

export interface EmptyStateProps {
  icon?: string; // Icon key from EMPTY_ICONS registry
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, actionLabel, onAction, className = '', style, ...props }, ref) => {
    const containerStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: spacing.xl,
      gap: spacing.md,
      backgroundColor: colors.background.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: '16px',
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
      marginBottom: spacing.md,
    };

    const iconStyles: React.CSSProperties = {
      color: colors.text.muted,
    };

    const titleStyles: React.CSSProperties = {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px',
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: spacing.xs,
    };

    const descriptionStyles: React.CSSProperties = {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px',
      fontWeight: '400',
      color: colors.text.muted,
      maxWidth: '400px',
      lineHeight: '1.5',
      marginBottom: spacing.lg,
    };

    const buttonStyles: React.CSSProperties = {
      padding: `${spacing.sm} ${spacing.lg}`,
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px',
      fontWeight: '500',
      color: colors.text.primary,
      backgroundColor: colors.primary,
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    };

    if (typeof motion === 'undefined') {
      return (
        <div ref={ref} className={className} style={containerStyles} {...props}>
          {icon && (
            <div style={iconContainerStyles}>
              <div style={iconStyles}>
                <VemiqIcon category="empty" name={icon} size={32} />
              </div>
            </div>
          )}
          <div style={titleStyles}>{title}</div>
          <div style={descriptionStyles}>{description}</div>
          {actionLabel && onAction && (
            <button
              style={buttonStyles}
              onClick={onAction}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.primary}CC`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
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
            <div style={iconStyles}>
              <VemiqIcon category="empty" name={icon} size={32} />
            </div>
          </div>
        )}
        <div style={titleStyles}>{title}</div>
        <div style={descriptionStyles}>{description}</div>
        {actionLabel && onAction && (
          <button
            style={buttonStyles}
            onClick={onAction}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${colors.primary}CC`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
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
