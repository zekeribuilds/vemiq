/**
 * Vemiq Border Radius System
 * 
 * Consistent corner rounding across all components
 * No inconsistent rounding values
 */

export const radius = {
  8: '8px',
  12: '12px',
  16: '16px',
  20: '20px',
  24: '24px',
} as const;

// Semantic radius mappings
export const borderRadius = {
  // Small elements (buttons, inputs)
  sm: radius[8],
  
  // Default elements (cards, containers)
  md: radius[12],
  
  // Large elements (modals, panels)
  lg: radius[16],
  
  // Extra large elements (hero sections)
  xl: radius[20],
  
  // Full rounded (avatars, badges)
  full: radius[24],
} as const;

// CSS Variable mappings
export const cssVariables = {
  '--radius-sm': radius[8],
  '--radius-md': radius[12],
  '--radius-lg': radius[16],
  '--radius-xl': radius[20],
  '--radius-full': radius[24],
};

// Type exports
export type RadiusKey = keyof typeof radius;
export type BorderRadiusKey = keyof typeof borderRadius;
