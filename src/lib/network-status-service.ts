/**
 * Network Status Service
 * 
 * Provides online/offline/reconnecting detection for the application.
 * Uses the Network Information API when available with fallback to navigator.onLine.
 */

export type NetworkStatus = 'online' | 'offline' | 'reconnecting';

interface NetworkState {
  status: NetworkStatus;
  isOnline: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

class NetworkStatusService {
  private listeners: Set<(state: NetworkState) => void> = new Set();
  private currentState: NetworkState = {
    status: 'online',
    isOnline: true,
  };
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    // Check initial status
    this.updateStatus();

    // Listen for online/offline events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);

      // Listen for network information changes if available
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        connection.addEventListener('change', this.handleConnectionChange);
      }
    }
  }

  private updateStatus(): void {
    if (typeof window === 'undefined') return;

    const isOnline = navigator.onLine;
    let status: NetworkStatus = isOnline ? 'online' : 'offline';

    // If we're reconnecting, maintain that status until successful
    if (this.currentState.status === 'reconnecting' && isOnline) {
      status = 'reconnecting';
    }

    // Get network information if available
    let networkInfo: Partial<NetworkState> = {};
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      networkInfo = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };
    }

    this.currentState = {
      status,
      isOnline,
      ...networkInfo,
    };

    this.notifyListeners();
  }

  private handleOnline = (): void => {
    console.log('[Network] Connection restored');
    this.currentState.status = 'online';
    this.currentState.isOnline = true;
    this.reconnectAttempts = 0;
    this.updateStatus();
  };

  private handleOffline = (): void => {
    console.log('[Network] Connection lost');
    this.currentState.status = 'offline';
    this.currentState.isOnline = false;
    this.updateStatus();
  };

  private handleConnectionChange = (): void => {
    console.log('[Network] Connection changed');
    this.updateStatus();
  };

  /**
   * Subscribe to network status changes
   */
  subscribe(listener: (state: NetworkState) => void): () => void {
    this.listeners.add(listener);

    // Immediately call with current state
    listener(this.currentState);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get current network state
   */
  getState(): NetworkState {
    return { ...this.currentState };
  }

  /**
   * Check if currently online
   */
  isOnline(): boolean {
    return this.currentState.isOnline;
  }

  /**
   * Attempt to reconnect to server
   */
  async attemptReconnect(): Promise<boolean> {
    if (this.currentState.isOnline) {
      return true;
    }

    console.log('[Network] Attempting to reconnect...');
    this.currentState.status = 'reconnecting';
    this.notifyListeners();

    try {
      // Try to fetch a lightweight endpoint
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-cache',
      });

      if (response.ok) {
        this.handleOnline();
        return true;
      }

      throw new Error('Health check failed');
    } catch (error) {
      console.error('[Network] Reconnect attempt failed:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        // Schedule next attempt with exponential backoff
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
        this.reconnectTimer = setTimeout(() => {
          this.attemptReconnect();
        }, delay) as unknown as NodeJS.Timeout;
      } else {
        console.log('[Network] Max reconnect attempts reached');
        this.currentState.status = 'offline';
        this.notifyListeners();
      }

      return false;
    }
  }

  /**
   * Cancel any pending reconnection attempts
   */
  cancelReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.reconnectAttempts = 0;
  }

  /**
   * Manually trigger a status check
   */
  checkStatus(): void {
    this.updateStatus();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener({ ...this.currentState });
      } catch (error) {
        console.error('[Network] Error notifying listener:', error);
      }
    });
  }

  /**
   * Cleanup event listeners
   */
  destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);

      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        connection.removeEventListener('change', this.handleConnectionChange);
      }
    }

    this.cancelReconnect();
    this.listeners.clear();
  }
}

// Export singleton instance
export const networkStatusService = new NetworkStatusService();
