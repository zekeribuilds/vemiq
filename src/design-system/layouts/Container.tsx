/**
 * Vemiq Container Component
 * 
 * Controls max width consistently across the application
 * Replaces arbitrary max-width values
 */

import React from 'react';
import { spacing } from '../tokens/index';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      size = 'lg',
      centered = true,
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const sizeMap = {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      full: '100%',
    };

    const containerStyles: React.CSSProperties = {
      width: '100%',
      maxWidth: sizeMap[size],
      margin: centered ? '0 auto' : '0',
      padding: `0 ${spacing.sm}`,
      ...style,
      '@media (min-width: 640px)': {
        padding: `0 ${spacing.md}`,
      },
      '@media (min-width: 1024px)': {
        padding: `0 ${spacing.lg}`,
      },
    };

    return (
      <div ref={ref} className={className} style={containerStyles} {...props}>
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export default Container;
