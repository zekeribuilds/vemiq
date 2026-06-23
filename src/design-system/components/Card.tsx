/**
 * Vemiq Card Components
 * 
 * Context Card - Profile information
 * Action Card - Clickable actions
 * Content Card - Reports, logs, uploads
 * Activity Card - Timeline events
 */

import React from 'react';
import { colors, spacing } from '../tokens/index';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Base Card Component
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', style, ...props }, ref) => {
    const cardStyles: React.CSSProperties = {
      backgroundColor: colors.background.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: '12px',
      padding: spacing.lg,
      ...style,
    };

    return (
      <div ref={ref} className={className} style={cardStyles} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Context Card - Profile information
export interface ContextCardProps extends CardProps {
  title?: string;
  subtitle?: string;
  avatar?: React.ReactNode;
}

export const ContextCard = React.forwardRef<HTMLDivElement, ContextCardProps>(
  ({ title, subtitle, avatar, children, className = '', style, ...props }, ref) => {
    return (
      <Card ref={ref} className={className} style={style} {...props}>
        {(title || subtitle || avatar) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
            {avatar && (
              <div style={{ flexShrink: 0 }}>{avatar}</div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              {title && (
                <div style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: colors.text.primary,
                  marginBottom: spacing.xs,
                }}>
                  {title}
                </div>
              )}
              {subtitle && (
                <div style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '12px',
                  fontWeight: '400',
                  color: colors.text.muted,
                }}>
                  {subtitle}
                </div>
              )}
            </div>
          </div>
        )}
        {children}
      </Card>
    );
  }
);

ContextCard.displayName = 'ContextCard';

// Action Card - Clickable actions
export interface ActionCardProps extends CardProps {
  onClick?: () => void;
  hoverable?: boolean;
  disabled?: boolean;
}

export const ActionCard = React.forwardRef<HTMLDivElement, ActionCardProps>(
  ({ onClick, hoverable = true, disabled = false, children, className = '', style, ...props }, ref) => {
    const cardStyles: React.CSSProperties = {
      backgroundColor: colors.background.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: '12px',
      padding: spacing.lg,
      cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
      opacity: disabled ? 0.5 : 1,
      ...style,
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!disabled && hoverable && onClick) {
        e.currentTarget.style.borderColor = colors.text.secondary;
        e.currentTarget.style.backgroundColor = colors.background.elevated;
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!disabled && hoverable && onClick) {
        e.currentTarget.style.borderColor = colors.border;
        e.currentTarget.style.backgroundColor = colors.background.surface;
      }
    };

    return (
      <div
        ref={ref}
        className={className}
        style={cardStyles}
        onClick={!disabled ? onClick : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ActionCard.displayName = 'ActionCard';

// Content Card - Reports, logs, uploads
export interface ContentCardProps extends CardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const ContentCard = React.forwardRef<HTMLDivElement, ContentCardProps>(
  ({ title, subtitle, action, icon, children, className = '', style, ...props }, ref) => {
    return (
      <Card ref={ref} className={className} style={style} {...props}>
        {(title || subtitle || icon || action) && (
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.md }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flex: 1, minWidth: 0 }}>
              {icon && (
                <div style={{ flexShrink: 0, color: colors.primary }}>{icon}</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                {title && (
                  <div style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '20px',
                    fontWeight: '600',
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                  }}>
                    {title}
                  </div>
                )}
                {subtitle && (
                  <div style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '12px',
                    fontWeight: '400',
                    color: colors.text.muted,
                  }}>
                    {subtitle}
                  </div>
                )}
              </div>
            </div>
            {action && (
              <div style={{ flexShrink: 0, marginLeft: spacing.sm }}>{action}</div>
            )}
          </div>
        )}
        {children}
      </Card>
    );
  }
);

ContentCard.displayName = 'ContentCard';

// Activity Card - Timeline events
export interface ActivityCardProps extends CardProps {
  timestamp?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export const ActivityCard = React.forwardRef<HTMLDivElement, ActivityCardProps>(
  ({ timestamp, type = 'info', children, className = '', style, ...props }, ref) => {
    const typeColors = {
      info: colors.info,
      success: colors.success,
      warning: colors.warning,
      error: colors.danger,
    };

    return (
      <Card ref={ref} className={className} style={{ padding: spacing.md, ...style }} {...props}>
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: typeColors[type],
            flexShrink: 0,
            marginTop: '6px',
          }} />
          <div style={{ flex: 1 }}>
            {children}
            {timestamp && (
              <div style={{
                marginTop: spacing.sm,
                fontFamily: 'system-ui, sans-serif',
                fontSize: '12px',
                fontWeight: '400',
                color: colors.text.muted,
              }}>
                {timestamp}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }
);

ActivityCard.displayName = 'ActivityCard';

export default Card;
