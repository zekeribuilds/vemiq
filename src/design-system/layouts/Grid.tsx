/**
 * Vemiq Grid Component
 * 
 * Consistent grid layout with columns and gap
 * Replaces arbitrary Tailwind grid classes
 */

import React from 'react';
import { spacing } from '../tokens/index';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  gap?: keyof typeof spacing;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      columns = 2,
      gap = 'md',
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const gridStyles: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      gap: spacing[gap],
      ...style,
    };

    return (
      <div ref={ref} className={className} style={gridStyles} {...props}>
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

export default Grid;
