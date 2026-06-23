import {
  NAV_ICONS,
  ACTION_ICONS,
  DATA_ICONS,
  CONTENT_ICONS,
  STATUS_ICONS,
  EMPTY_ICONS,
} from "./registry"

const ICON_MAP = {
  nav: NAV_ICONS,
  action: ACTION_ICONS,
  data: DATA_ICONS,
  content: CONTENT_ICONS,
  status: STATUS_ICONS,
  empty: EMPTY_ICONS,
} as const

export type IconCategoryKey = keyof typeof ICON_MAP

export function getIcon(
  category: IconCategoryKey,
  key: string
): string {
  const set = ICON_MAP[category]

  if (!(key in set)) {
    throw new Error(
      `Invalid icon key "${key}" for category "${category}". Must use registry.` 
    )
  }

  return set[key as keyof typeof set]
}
