'use client';

import * as LucideIcons from "lucide-react"
import { getIcon } from "@/icons/resolver"

type Props = {
  category: "nav" | "action" | "data" | "content" | "status" | "empty"
  name: string
  size?: number
  className?: string
}

export function VemiqIcon({ category, name, size = 20, className }: Props) {
  const iconName = getIcon(category, name)
  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{ size?: number; className?: string }>

  if (!IconComponent) {
    throw new Error(`Icon "${iconName}" not found in lucide-react`)
  }

  return <IconComponent size={size} className={className} />
}
