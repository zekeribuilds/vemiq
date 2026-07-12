'use client';

import * as LucideIcons from "lucide-react"
import { getIcon, toLucideComponentName } from "@/icons/resolver"

type Props = {
  category: "nav" | "action" | "data" | "content" | "status" | "empty"
  name: string
  size?: number
  className?: string
}

export function VemiqIcon({ category, name, size = 20, className }: Props) {
  const lucideName = getIcon(category, name)
  const componentName = toLucideComponentName(lucideName)
  const IconComponent = LucideIcons[componentName as keyof typeof LucideIcons] as React.ComponentType<{ size?: number; className?: string }>

  if (!IconComponent) {
    throw new Error(`Icon "${lucideName}" (${componentName}) not found in lucide-react`)
  }

  return <IconComponent size={size} className={className} />
}
