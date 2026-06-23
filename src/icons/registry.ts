export const NAV_ICONS = {
  dashboard: "layout-dashboard",
  logbook: "book-open",
  reports: "file-text",
  uploads: "upload",
  activity: "activity",
  notifications: "bell",
  profile: "user",
  settings: "settings",
  help: "help-circle",
  chat: "message-square",
} as const

export const ACTION_ICONS = {
  create: "plus",
  edit: "pencil",
  delete: "trash",
  save: "save",
  upload: "upload",
  download: "download",
  send: "send",
  add: "plus-circle",
  remove: "x",
  close: "x",
  search: "search",
  filter: "filter",
  refresh: "refresh-cw",
  copy: "copy",
} as const

export const DATA_ICONS = {
  chart: "bar-chart-3",
  analytics: "line-chart",
  database: "database",
  report: "file-bar-chart",
  stats: "trending-up",
  timeline: "clock",
  calendar: "calendar",
  progress: "loader",
} as const

export const CONTENT_ICONS = {
  text: "type",
  voice: "mic",
  image: "image",
  file: "file",
  document: "file-text",
  attachment: "paperclip",
  scan: "scan-line",
} as const

export const STATUS_ICONS = {
  success: "check-circle",
  error: "alert-circle",
  warning: "alert-triangle",
  info: "info",
  loading: "loader",
  pending: "clock",
  completed: "check",
  failed: "x-circle",
} as const

export const EMPTY_ICONS = {
  no_data: "inbox",
  no_reports: "file-x",
  no_logbook: "book-x",
  no_uploads: "upload-cloud",
  no_activity: "activity",
  no_search: "search-x",
  no_notifications: "bell-off",
} as const

export type NavIconKey = keyof typeof NAV_ICONS
export type ActionIconKey = keyof typeof ACTION_ICONS
export type DataIconKey = keyof typeof DATA_ICONS
export type ContentIconKey = keyof typeof CONTENT_ICONS
export type StatusIconKey = keyof typeof STATUS_ICONS
export type EmptyIconKey = keyof typeof EMPTY_ICONS

export type AllIconKey =
  | NavIconKey
  | ActionIconKey
  | DataIconKey
  | ContentIconKey
  | StatusIconKey
  | EmptyIconKey
