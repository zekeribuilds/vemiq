/**
 * Vemiq Spacing System
 * 
 * Consistent spacing tokens across the entire application
 * No arbitrary spacing values
 */

export const spacing = {
  4: '4px',
  8: '8px',
  12: '12px',
  16: '16px',
  24: '24px',
  32: '32px',
  48: '48px',
  64: '64px',
} as const;

// Semantic spacing mappings
export const space = {
  // Micro spacing
  xs: spacing[4],
  
  // Small spacing
  sm: spacing[8],
  
  // Default spacing
  md: spacing[12],
  
  // Medium spacing
  lg: spacing[16],
  
  // Large spacing
  xl: spacing[24],
  
  // Extra large spacing
  '2xl': spacing[32],
  
  // Section spacing
  '3xl': spacing[48],
  
  // Container spacing
  '4xl': spacing[64],
} as const;

// CSS Variable mappings
export const cssVariables = {
  '--spacing-xs': spacing[4],
  '--spacing-sm': spacing[8],
  '--spacing-md': spacing[12],
  '--spacing-lg': spacing[16],
  '--spacing-xl': spacing[24],
  '--spacing-2xl': spacing[32],
  '--spacing-3xl': spacing[48],
  '--spacing-4xl': spacing[64],
};

// Type exports
export type SpacingKey = keyof typeof spacing;
export type SpaceKey = keyof typeof space;
