/**
 * Vemiq Glass Component
 * 
 * Subtle glass effect for floating elements
 * Used sparingly: nav, command palette, dropdowns, modals, AI surfaces
 * NOT for entire pages or every card
 */

import React from 'react';
import { colors, radius, spacing } from '../tokens';

export interface GlassProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  blur?: 'sm' | 'md' | 'lg';
}

export const Glass = React.forwardRef<HTMLDivElement, GlassProps>(
  ({ children, className = '', style, blur = 'md', ...props }, ref) => {
    const blurAmounts = {
      sm: '12px',
      md: '20px',
      lg: '32px',
    };

    const glassStyles: React.CSSProperties = {
      backgroundColor: 'rgba(15, 15, 20, 0.8)',
      backdropFilter: `blur(${blurAmounts[blur]})`,
      WebkitBackdropFilter: `blur(${blurAmounts[blur]})`,
      border: `1px solid ${colors.border.DEFAULT}`,
      borderRadius: radius[12],
      ...style,
    };

    return (
      <div ref={ref} className={className} style={glassStyles} {...props}>
        {children}
      </div>
    );
  }
);

Glass.displayName = 'Glass';

export default Glass;
