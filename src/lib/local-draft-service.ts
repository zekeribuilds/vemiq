/**
 * Local-First Draft Service
 * 
 * Provides offline resilience for AI chat, report editor, logbook entries, and profile forms
 * using IndexedDB for persistent storage with localStorage fallback.
 */

const DB_NAME = 'vemiq_drafts';
const DB_VERSION = 1;
const STORES = {
  AI_CHAT: 'ai_chat_drafts',
  REPORT_EDITOR: 'report_editor_drafts',
  LOGBOOK: 'logbook_drafts',
  PROFILE: 'profile_drafts',
} as const;

type StoreName = typeof STORES[keyof typeof STORES];

interface DraftData {
  id: string;
  content: any;
  timestamp: number;
  synced: boolean;
}

class LocalDraftService {
  private db: IDBDatabase | null = null;
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.initialized = true;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores for different draft types
        Object.values(STORES).forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        });
      };
    });
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
  }

  /**
   * Save draft to IndexedDB
   */
  async saveDraft(storeName: StoreName, id: string, content: any): Promise<void> {
    await this.ensureInitialized();

    const draft: DraftData = {
      id,
      content,
      timestamp: Date.now(),
      synced: false,
    };

    return new Promise((resolve, reject) => {
      if (!this.db) {
        // Fallback to localStorage
        try {
          const key = `${storeName}_${id}`;
          localStorage.setItem(key, JSON.stringify(draft));
          resolve();
        } catch (error) {
          reject(error);
        }
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(draft);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get draft from IndexedDB
   */
  async getDraft(storeName: StoreName, id: string): Promise<any | null> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        // Fallback to localStorage
        try {
          const key = `${storeName}_${id}`;
          const data = localStorage.getItem(key);
          resolve(data ? JSON.parse(data).content : null);
        } catch (error) {
          reject(error);
        }
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.content : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete draft from IndexedDB
   */
  async deleteDraft(storeName: StoreName, id: string): Promise<void> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        // Fallback to localStorage
        try {
          const key = `${storeName}_${id}`;
          localStorage.removeItem(key);
          resolve();
        } catch (error) {
          reject(error);
        }
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * List all drafts in a store
   */
  async listDrafts(storeName: StoreName): Promise<DraftData[]> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        // Fallback to localStorage
        try {
          const drafts: DraftData[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(storeName)) {
              const data = localStorage.getItem(key);
              if (data) {
                drafts.push(JSON.parse(data));
              }
            }
          }
          resolve(drafts);
        } catch (error) {
          reject(error);
        }
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Mark draft as synced (after successful server sync)
   */
  async markAsSynced(storeName: StoreName, id: string): Promise<void> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        // Fallback to localStorage
        try {
          const key = `${storeName}_${id}`;
          const data = localStorage.getItem(key);
          if (data) {
            const draft = JSON.parse(data);
            draft.synced = true;
            localStorage.setItem(key, JSON.stringify(draft));
          }
          resolve();
        } catch (error) {
          reject(error);
        }
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const draft = getRequest.result;
        if (draft) {
          draft.synced = true;
          const putRequest = store.put(draft);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Clear all drafts in a store
   */
  async clearStore(storeName: StoreName): Promise<void> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        // Fallback to localStorage
        try {
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(storeName)) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key));
          resolve();
        } catch (error) {
          reject(error);
        }
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Export singleton instance
export const localDraftService = new LocalDraftService();

// Export store names for type safety
export { STORES };
