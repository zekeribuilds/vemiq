/**
 * Vemiq Stack Component
 * 
 * Vertical stacking with consistent spacing
 * Replaces arbitrary div nesting for layout
 */

import React from 'react';
import { spacing } from '../tokens/index';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: keyof typeof spacing;
  direction?: 'vertical' | 'horizontal';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  fullWidth?: boolean;
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      spacing: spacingProp = 'md',
      direction = 'vertical',
      align = 'start',
      justify = 'start',
      fullWidth = false,
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const stackStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: direction === 'vertical' ? 'column' : 'row',
      gap: spacing[spacingProp],
      alignItems: align,
      justifyContent: justify,
      width: fullWidth ? '100%' : 'auto',
      ...style,
    };

    return (
      <div ref={ref} className={className} style={stackStyles} {...props}>
        {children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';

export default Stack;
