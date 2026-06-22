/**
 * useOfflineSync Hook
 * Handles offline sync, draft persistence, and recovery
 */

import { useState, useEffect, useCallback } from 'react';
import {
  saveDraft,
  loadDraft,
  deleteDraft,
  addToSyncQueue,
  getSyncQueue,
  clearSyncQueue,
  removeFromSyncQueue,
  isOnline,
  registerNetworkListeners,
} from '@/lib/offline-storage';

export function useOfflineSync(key: string, type: 'report' | 'logbook' | 'week' | 'section') {
  const [isOnline, setIsOnline] = useState(true);
  const [hasDraft, setHasDraft] = useState(false);
  const [syncPending, setSyncPending] = useState(false);

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);

    // Check for existing draft
    const draft = loadDraft(key);
    setHasDraft(!!draft);

    // Register network listeners
    const unregister = registerNetworkListeners(
      () => {
        setIsOnline(true);
        // Trigger sync when coming back online
        syncPendingChanges();
      },
      () => setIsOnline(false)
    );

    return unregister;
  }, [key]);

  const saveToDraft = useCallback((data: any) => {
    saveDraft(key, data, type);
    setHasDraft(true);
  }, [key, type]);

  const loadFromDraft = useCallback((): any | null => {
    const draft = loadDraft(key);
    return draft?.data || null;
  }, [key]);

  const clearDraft = useCallback(() => {
    deleteDraft(key);
    setHasDraft(false);
  }, [key]);

  const queueSync = useCallback((action: 'create' | 'update' | 'delete', entityType: string, entityId: string, data: any) => {
    addToSyncQueue({
      id: `${Date.now()}-${entityId}`,
      action,
      entityType,
      entityId,
      data,
      timestamp: Date.now(),
    });
    setSyncPending(true);
  }, []);

  const syncPendingChanges = useCallback(async () => {
    if (!isOnline) return;

    const queue = getSyncQueue();
    if (queue.length === 0) return;

    setSyncPending(true);

    const { createClient } = await import('@/lib/supabase/browser');
    const supabase = createClient();

    for (const item of queue) {
      try {
        if (item.action === 'create' && item.entityType === 'upload') {
          // Re-attempt upload
          const formData = new FormData();
          formData.append('file', item.data.file);
          formData.append('userId', item.data.userId);
          formData.append('reportId', item.data.reportId);
          formData.append('weeklyLogId', item.data.weeklyLogId);
          formData.append('fileType', item.data.fileType);

          await fetch('/api/uploads', {
            method: 'POST',
            body: formData,
          });
          removeFromSyncQueue(item.id);
        } else if (item.action === 'update' && item.entityType === 'report_section') {
          // Sync report section
          await supabase
            .from('report_sections')
            .update({
              content: item.data.content,
              updated_at: new Date().toISOString(),
            })
            .eq('id', item.entityId);
          removeFromSyncQueue(item.id);
        } else if (item.action === 'update' && item.entityType === 'weekly_log') {
          // Sync weekly log
          await supabase
            .from('weekly_logs')
            .update({
              description: item.data.description,
              updated_at: new Date().toISOString(),
            })
            .eq('id', item.entityId);
          removeFromSyncQueue(item.id);
        }
      } catch (error) {
        console.error('Sync failed for item:', item, error);
      }
    }

    const remaining = getSyncQueue();
    if (remaining.length === 0) {
      clearSyncQueue();
      setSyncPending(false);
    }
  }, [isOnline]);

  return {
    isOnline,
    hasDraft,
    syncPending,
    saveToDraft,
    loadFromDraft,
    clearDraft,
    queueSync,
    syncPendingChanges,
  };
}
