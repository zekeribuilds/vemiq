export type IconCategory = "nav" | "action" | "data" | "content" | "status" | "empty"

export type MissingIconRequest = {
  suggestedMeaning: string
  category: IconCategory
  suggestedKey: string
  recommendedLucide: string
  priority?: "low" | "medium" | "high"
  usageContext?: string[]
  requestedBy?: "cascade" | "human"
  timestamp?: number
}

export type IconRequestStatus = "pending" | "approved" | "rejected"

export type IconRequestWithStatus = MissingIconRequest & {
  id: string
  status: IconRequestStatus
  reviewedBy?: string
  reviewedAt?: number
  rejectionReason?: string
}

// In-memory storage for pending requests (in production, this would be a database)
const pendingIconRequests: IconRequestWithStatus[] = []

export function submitMissingIcon(request: MissingIconRequest): string {
  const id = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  const requestWithStatus: IconRequestWithStatus = {
    ...request,
    id,
    status: "pending",
    timestamp: Date.now(),
  }
  
  pendingIconRequests.push(requestWithStatus)
  return id
}

export function getPendingRequests(): IconRequestWithStatus[] {
  return pendingIconRequests.filter(req => req.status === "pending")
}

export function getAllRequests(): IconRequestWithStatus[] {
  return [...pendingIconRequests]
}

export function approveRequest(id: string, reviewedBy: string): boolean {
  const request = pendingIconRequests.find(req => req.id === id)
  if (!request) return false
  
  request.status = "approved"
  request.reviewedBy = reviewedBy
  request.reviewedAt = Date.now()
  
  return true
}

export function rejectRequest(id: string, reviewedBy: string, reason: string): boolean {
  const request = pendingIconRequests.find(req => req.id === id)
  if (!request) return false
  
  request.status = "rejected"
  request.reviewedBy = reviewedBy
  request.reviewedAt = Date.now()
  request.rejectionReason = reason
  
  return true
}

export function getRequestById(id: string): IconRequestWithStatus | undefined {
  return pendingIconRequests.find(req => req.id === id)
}
