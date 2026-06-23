import { 
  MissingIconRequest, 
  IconRequestWithStatus, 
  getPendingRequests,
  approveRequest,
  rejectRequest,
  getRequestById
} from "./icon-registry-expansion"
import { NAV_ICONS, ACTION_ICONS, DATA_ICONS, CONTENT_ICONS, STATUS_ICONS, EMPTY_ICONS } from "./registry"

export type ValidationResult = {
  valid: boolean
  reason?: string
  suggestion?: string
}

export function validateIconRequest(request: MissingIconRequest): ValidationResult {
  // Check if key already exists in registry
  const registries = {
    nav: NAV_ICONS,
    action: ACTION_ICONS,
    data: DATA_ICONS,
    content: CONTENT_ICONS,
    status: STATUS_ICONS,
    empty: EMPTY_ICONS,
  }
  
  const targetRegistry = registries[request.category]
  if (request.suggestedKey in targetRegistry) {
    return {
      valid: false,
      reason: `Icon key "${request.suggestedKey}" already exists in ${request.category} registry`,
      suggestion: "Use existing icon or choose a different key"
    }
  }
  
  // Validate key format (should be snake_case)
  const keyFormatRegex = /^[a-z][a-z0-9_]*$/
  if (!keyFormatRegex.test(request.suggestedKey)) {
    return {
      valid: false,
      reason: `Icon key "${request.suggestedKey}" must be snake_case`,
      suggestion: "Use snake_case format (e.g., 'ai_summary' not 'ai-summary' or 'aiSummary')"
    }
  }
  
  // Validate category
  const validCategories = ["nav", "action", "data", "content", "status", "empty"]
  if (!validCategories.includes(request.category)) {
    return {
      valid: false,
      reason: `Invalid category "${request.category}"`,
      suggestion: `Use one of: ${validCategories.join(", ")}`
    }
  }
  
  // Validate that meaning is provided
  if (!request.suggestedMeaning || request.suggestedMeaning.trim().length === 0) {
    return {
      valid: false,
      reason: "Icon meaning is required",
      suggestion: "Provide a clear semantic meaning for the icon"
    }
  }
  
  // Validate Lucide icon name is provided
  if (!request.recommendedLucide || request.recommendedLucide.trim().length === 0) {
    return {
      valid: false,
      reason: "Lucide icon name is required",
      suggestion: "Specify which Lucide icon to use"
    }
  }
  
  return { valid: true }
}

export function reviewRequest(requestId: string, decision: "approve" | "reject", reviewer: string, rejectionReason?: string): boolean {
  const request = getRequestById(requestId)
  if (!request) return false
  
  if (decision === "approve") {
    const validation = validateIconRequest(request)
    if (!validation.valid) {
      console.error(`Cannot approve request: ${validation.reason}`)
      return false
    }
    return approveRequest(requestId, reviewer)
  } else {
    return rejectRequest(requestId, reviewer, rejectionReason || "No reason provided")
  }
}

export function getApprovalQueue(): IconRequestWithStatus[] {
  const pending = getPendingRequests()
  // Sort by priority (high first) then timestamp (oldest first)
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  
  return pending.sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority || "medium"] - priorityOrder[b.priority || "medium"]
    if (priorityDiff !== 0) return priorityDiff
    return (a.timestamp || 0) - (b.timestamp || 0)
  })
}

export function generateApprovalSummary(request: IconRequestWithStatus): string {
  return `
Icon Request: ${request.suggestedKey}
Category: ${request.category}
Meaning: ${request.suggestedMeaning}
Lucide Icon: ${request.recommendedLucide}
Priority: ${request.priority || "medium"}
Context: ${request.usageContext?.join(", ") || "Not specified"}
Requested by: ${request.requestedBy || "unknown"}
  `.trim()
}
