/**
 * Vemiq Typography System
 * 
 * Roboto font family with clear hierarchy
 * Optimized for long-form academic reading
 */

export const typography = {
  fontFamily: {
    sans: 'Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, Monaco, Consolas, monospace',
  },

  // Font sizes
  fontSize: {
    display: '48px',
    h1: '36px',
    h2: '30px',
    h3: '24px',
    body: '16px',
    caption: '14px',
    small: '12px',
  },

  // Font weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line heights
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.75',
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
  },
} as const;

// Typography variants
export const textVariants = {
  display: {
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },

  h1: {
    fontSize: typography.fontSize.h1,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },

  h2: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },

  h3: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },

  body: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.relaxed,
    letterSpacing: typography.letterSpacing.normal,
  },

  bodyMedium: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.relaxed,
    letterSpacing: typography.letterSpacing.normal,
  },

  caption: {
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },

  small: {
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
} as const;

// CSS Variable mappings
export const cssVariables = {
  '--font-sans': typography.fontFamily.sans,
  '--font-serif': typography.fontFamily.serif,
  '--font-mono': typography.fontFamily.mono,
  '--font-size-display': typography.fontSize.display,
  '--font-size-h1': typography.fontSize.h1,
  '--font-size-h2': typography.fontSize.h2,
  '--font-size-h3': typography.fontSize.h3,
  '--font-size-body': typography.fontSize.body,
  '--font-size-caption': typography.fontSize.caption,
  '--font-size-small': typography.fontSize.small,
};

// Type exports
export type FontSizeKey = keyof typeof typography.fontSize;
export type FontWeightKey = keyof typeof typography.fontWeight;
export type TextVariantKey = keyof typeof textVariants;
