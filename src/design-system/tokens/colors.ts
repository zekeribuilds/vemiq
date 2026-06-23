export const colors = {
  primary: "#6C63FF",

  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
  purple: "#8B5CF6",

  background: {
    base: "#0B0B10",
    surface: "#111827",
    elevated: "#1F2937",
  },

  text: {
    primary: "#FFFFFF",
    secondary: "#9CA3AF",
    muted: "#6B7280",
    disabled: "#6B7280",
  },

  border: "#2A2F3A",
} as const

export type ColorToken = keyof typeof colors
export type BackgroundToken = keyof typeof colors.background
export type TextToken = keyof typeof colors.text
