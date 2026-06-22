/**
 * Vemiq Shadow System
 * 
 * Minimal shadows with preference for border + contrast
 * Premium, subtle depth without giant shadows
 */

export const shadows = {
  // No shadow (use borders instead)
  none: 'none',
  
  // Subtle shadow for small elements
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  
  // Default shadow for cards
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
  
  // Larger shadow for modals
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
  
  // Extra large for dropdowns
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
  
  // Inner shadow for inputs
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
  
  // Purple glow for focus states
  glow: '0 0 20px rgba(134, 97, 255, 0.3)',
  
  // Larger purple glow
  glowLg: '0 0 40px rgba(134, 97, 255, 0.4)',
} as const;

// CSS Variable mappings
export const cssVariables = {
  '--shadow-none': shadows.none,
  '--shadow-sm': shadows.sm,
  '--shadow-md': shadows.md,
  '--shadow-lg': shadows.lg,
  '--shadow-xl': shadows.xl,
  '--shadow-inner': shadows.inner,
  '--shadow-glow': shadows.glow,
  '--shadow-glow-lg': shadows.glowLg,
};

// Type exports
export type ShadowKey = keyof typeof shadows;
