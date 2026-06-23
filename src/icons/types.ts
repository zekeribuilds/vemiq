export type IconCategory =
  | "nav"
  | "action"
  | "data"
  | "content"
  | "status"
  | "empty"

export type IconRegistry = Record<string, Record<string, string>>
