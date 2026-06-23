export const typography = {
  display: "text-4xl font-bold",
  h1: "text-3xl font-bold",
  h2: "text-2xl font-semibold",
  h3: "text-xl font-semibold",
  body: "text-base",
  small: "text-sm",
  caption: "text-xs",
} as const

export type TypographyToken = keyof typeof typography
