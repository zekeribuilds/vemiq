import { IconRequestWithStatus, getAllRequests } from "./icon-registry-expansion"
import { validateIconRequest } from "./icon-approval-workflow"

export type RegistryMergeResult = {
  success: boolean
  mergedIcons: Array<{ category: string; key: string; lucideIcon: string }>
  errors: Array<{ requestId: string; reason: string }>
  warnings: string[]
}

export function mergeApprovedIcons(): RegistryMergeResult {
  const allRequests = getAllRequests()
  const approvedRequests = allRequests.filter(req => req.status === "approved")
  
  const result: RegistryMergeResult = {
    success: true,
    mergedIcons: [],
    errors: [],
    warnings: []
  }
  
  for (const request of approvedRequests) {
    // Validate before merging
    const validation = validateIconRequest(request)
    if (!validation.valid) {
      result.errors.push({
        requestId: request.id,
        reason: validation.reason || "Validation failed"
      })
      result.success = false
      continue
    }
    
    // Add to merged list
    result.mergedIcons.push({
      category: request.category,
      key: request.suggestedKey,
      lucideIcon: request.recommendedLucide
    })
  }
  
  if (result.errors.length > 0) {
    result.warnings.push(`${result.errors.length} approved requests failed validation and were not merged`)
  }
  
  return result
}

export function generateRegistryUpdateCode(result: RegistryMergeResult): string {
  if (result.mergedIcons.length === 0) {
    return "// No icons to merge"
  }
  
  const updatesByCategory: Record<string, Array<{ key: string; lucideIcon: string }>> = {
    nav: [],
    action: [],
    data: [],
    content: [],
    status: [],
    empty: []
  }
  
  result.mergedIcons.forEach(merged => {
    updatesByCategory[merged.category].push({
      key: merged.key,
      lucideIcon: merged.lucideIcon
    })
  })
  
  let code = "// AUTO-GENERATED ICON REGISTRY UPDATES\n"
  code += "// Review and merge these into src/icons/registry.ts\n\n"
  
  Object.entries(updatesByCategory).forEach(([category, icons]) => {
    if (icons.length === 0) return
    
    code += `// ${category.toUpperCase()}_ICONS additions:\n`
    icons.forEach(icon => {
      code += `  ${icon.key}: "${icon.lucideIcon}",\n`
    })
    code += "\n"
  })
  
  return code
}

export function previewMerge(): {
  pendingCount: number
  approvedCount: number
  rejectedCount: number
  readyToMerge: IconRequestWithStatus[]
} {
  const allRequests = getAllRequests()
  
  return {
    pendingCount: allRequests.filter(r => r.status === "pending").length,
    approvedCount: allRequests.filter(r => r.status === "approved").length,
    rejectedCount: allRequests.filter(r => r.status === "rejected").length,
    readyToMerge: allRequests.filter(r => r.status === "approved")
  }
}
