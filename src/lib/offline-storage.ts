/**
 * Offline Storage Utility
 * Handles local storage persistence for drafts and offline support
 */

const DRAFT_PREFIX = 'vemiq_draft_';
const SYNC_QUEUE_PREFIX = 'vemiq_sync_queue_';

export interface DraftData {
  id: string;
  type: 'report' | 'logbook' | 'week' | 'section';
  data: any;
  timestamp: number;
}

export interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  entityType: string;
  entityId: string;
  data: any;
  timestamp: number;
}

/**
 * Save draft to local storage
 */
export function saveDraft(key: string, data: any, type: DraftData['type']) {
  const draft: DraftData = {
    id: key,
    type,
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(`${DRAFT_PREFIX}${key}`, JSON.stringify(draft));
}

/**
 * Load draft from local storage
 */
export function loadDraft(key: string): DraftData | null {
  const item = localStorage.getItem(`${DRAFT_PREFIX}${key}`);
  if (!item) return null;
  
  try {
    return JSON.parse(item);
  } catch {
    return null;
  }
}

/**
 * Delete draft from local storage
 */
export function deleteDraft(key: string) {
  localStorage.removeItem(`${DRAFT_PREFIX}${key}`);
}

/**
 * Get all drafts
 */
export function getAllDrafts(): DraftData[] {
  const drafts: DraftData[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(DRAFT_PREFIX)) {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          drafts.push(JSON.parse(item));
        } catch {}
      }
    }
  }
  return drafts.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Add item to sync queue
 */
export function addToSyncQueue(item: SyncQueueItem) {
  const queue = getSyncQueue();
  queue.push(item);
  localStorage.setItem(SYNC_QUEUE_PREFIX, JSON.stringify(queue));
}

/**
 * Get sync queue
 */
export function getSyncQueue(): SyncQueueItem[] {
  const item = localStorage.getItem(SYNC_QUEUE_PREFIX);
  if (!item) return [];
  
  try {
    return JSON.parse(item);
  } catch {
    return [];
  }
}

/**
 * Clear sync queue
 */
export function clearSyncQueue() {
  localStorage.removeItem(SYNC_QUEUE_PREFIX);
}

/**
 * Remove item from sync queue
 */
export function removeFromSyncQueue(itemId: string) {
  const queue = getSyncQueue();
  const filtered = queue.filter(item => item.id !== itemId);
  localStorage.setItem(SYNC_QUEUE_PREFIX, JSON.stringify(filtered));
}

/**
 * Check if online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Register online/offline listeners
 */
export function registerNetworkListeners(
  onOnline: () => void,
  onOffline: () => void
) {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}
