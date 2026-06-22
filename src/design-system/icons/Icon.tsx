/**
 * Vemiq Icon Base Component
 * 
 * Consistent icon styling across all icons
 * Same stroke width, corner radius, and visual weight
 */

import React from 'react';

export interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export const createIcon = (
  displayName: string,
  path: React.ReactNode,
  viewBox: string = '0 0 24 24'
) => {
  const Icon = React.forwardRef<SVGSVGElement, IconProps>(
    ({ size = 24, className = '', strokeWidth = 1.5, ...props }, ref) => {
      return (
        <svg
          ref={ref}
          width={size}
          height={size}
          viewBox={viewBox}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          {...props}
        >
          {path}
        </svg>
      );
    }
  );

  Icon.displayName = displayName;
  return Icon;
};
