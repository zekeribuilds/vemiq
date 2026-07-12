/**
 * Vemiq Grid Component
 * 
 * Consistent grid layout with columns and gap
 * Replaces arbitrary Tailwind grid classes
 */

import React from 'react';
import { spacing } from '../tokens/index';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: keyof typeof spacing;
  useTailwindGrid?: boolean;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      columns = 2,
      gap = 'md',
      useTailwindGrid = false,
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const gridStyles: React.CSSProperties = {
      display: 'grid',
      gap: spacing[gap],
      ...style,
      ...(useTailwindGrid !== true && columns !== undefined && {
        gridTemplateColumns: typeof columns === 'number' 
          ? `repeat(${columns}, minmax(0, 1fr))`
          : `repeat(${(columns as any)?.sm || 1}, minmax(0, 1fr))`,
      }),
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
