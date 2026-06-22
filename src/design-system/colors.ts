/**
 * Vemiq Color System
 * 
 * Premium dark theme with purple branding (#8661ff)
 * Mobile-first, academic operating system aesthetic
 */

export const colors = {
  // Primary Brand Colors
  primary: {
    DEFAULT: '#8661ff',
    hover: '#7A55E6',
    active: '#6E4ACF',
    light: '#A78BFF',
    dark: '#5C3FD6',
  },

  // Accent Colors
  accent: {
    DEFAULT: '#8B84FF',
    hover: '#7F78E6',
    active: '#736CCF',
  },

  // Background Hierarchy (Darkest to Lightest)
  background: {
    base: '#08080B',      // Deepest background
    surface: '#0F0F14',   // Card backgrounds
    elevated: '#151520',  // Raised elements
    overlay: '#1B1B2A',   // Modals, dropdowns
  },

  // Text Hierarchy
  text: {
    primary: '#FFFFFF',    // Headlines, important text
    secondary: '#E4E4E7',  // Body text
    tertiary: '#A1A1AA',   // Secondary labels
    quaternary: '#71717A', // Disabled, hints
  },

  // Border Colors
  border: {
    DEFAULT: 'rgba(255, 255, 255, 0.08)',
    hover: 'rgba(255, 255, 255, 0.12)',
    focus: 'rgba(134, 97, 255, 0.5)',
  },

  // Semantic Colors
  success: {
    DEFAULT: '#22C55E',
    hover: '#16A34A',
    bg: 'rgba(34, 197, 94, 0.1)',
  },

  warning: {
    DEFAULT: '#F59E0B',
    hover: '#D97706',
    bg: 'rgba(245, 158, 11, 0.1)',
  },

  error: {
    DEFAULT: '#EF4444',
    hover: '#DC2626',
    bg: 'rgba(239, 68, 68, 0.1)',
  },

  info: {
    DEFAULT: '#3B82F6',
    hover: '#2563EB',
    bg: 'rgba(59, 130, 246, 0.1)',
  },
} as const;

// CSS Variable mappings for Tailwind
export const cssVariables = {
  '--color-primary': colors.primary.DEFAULT,
  '--color-primary-hover': colors.primary.hover,
  '--color-primary-active': colors.primary.active,
  '--color-accent': colors.accent.DEFAULT,
  '--color-accent-hover': colors.accent.hover,
  '--color-accent-active': colors.accent.active,
  '--color-background-base': colors.background.base,
  '--color-background-surface': colors.background.surface,
  '--color-background-elevated': colors.background.elevated,
  '--color-background-overlay': colors.background.overlay,
  '--color-text-primary': colors.text.primary,
  '--color-text-secondary': colors.text.secondary,
  '--color-text-tertiary': colors.text.tertiary,
  '--color-text-quaternary': colors.text.quaternary,
  '--color-border': colors.border.DEFAULT,
  '--color-border-hover': colors.border.hover,
  '--color-border-focus': colors.border.focus,
  '--color-success': colors.success.DEFAULT,
  '--color-warning': colors.warning.DEFAULT,
  '--color-error': colors.error.DEFAULT,
  '--color-info': colors.info.DEFAULT,
};

// Type exports
export type ColorKey = keyof typeof colors;
export type PrimaryColor = keyof typeof colors.primary;
export type BackgroundColor = keyof typeof colors.background;
export type TextColor = keyof typeof colors.text;
