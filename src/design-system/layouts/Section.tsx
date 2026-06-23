/**
 * Vemiq Section Component
 * 
 * Standardized spacing and heading structure
 * Replaces arbitrary section divs
 */

import React from 'react';
import { spacing, colors } from '../tokens/index';

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  spacing?: keyof typeof spacing;
}

export const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  (
    {
      title,
      subtitle,
      spacing: spacingProp = 'xl',
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const sectionStyles: React.CSSProperties = {
      padding: `${spacing[spacingProp]} 0`,
      ...style,
    };

    const headerStyles: React.CSSProperties = {
      marginBottom: spacing.md,
    };

    const titleStyles: React.CSSProperties = {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '24px',
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: spacing.xs,
    };

    const subtitleStyles: React.CSSProperties = {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px',
      fontWeight: '400',
      color: colors.text.secondary,
    };

    return (
      <section ref={ref} className={className} style={sectionStyles} {...props}>
        {(title || subtitle) && (
          <div style={headerStyles}>
            {title && <h2 style={titleStyles}>{title}</h2>}
            {subtitle && <p style={subtitleStyles}>{subtitle}</p>}
          </div>
        )}
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';

export default Section;
