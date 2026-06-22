/**
 * Error Monitoring Library
 * Simple error tracking without external dependencies
 */

import React from 'react';

export interface ErrorContext {
  userId?: string;
  page?: string;
  action?: string;
  additional?: Record<string, any>;
}

export interface ErrorLog {
  id: string;
  userId?: string;
  errorType: string;
  message: string;
  stack?: string;
  page?: string;
  action?: string;
  timestamp: number;
  additional?: Record<string, any>;
}

class ErrorMonitor {
  private errors: ErrorLog[] = [];
  private maxErrors = 100;

  /**
   * Log an error
   */
  log(error: Error, context?: ErrorContext) {
    const errorLog: ErrorLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: context?.userId,
      errorType: error.name,
      message: error.message,
      stack: error.stack,
      page: context?.page || window.location.pathname,
      action: context?.action,
      timestamp: Date.now(),
      additional: context?.additional,
    };

    this.errors.push(errorLog);
    
    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Error Monitor]', errorLog);
    }

    // Send to analytics
    this.sendToAnalytics(errorLog);
  }

  /**
   * Send error to analytics
   */
  private async sendToAnalytics(errorLog: ErrorLog) {
    try {
      const { trackEvent } = await import('./analytics');
      await trackEvent({
        eventType: 'report_edited' as any, // Using existing type
        category: 'usage',
        properties: {
          error_type: errorLog.errorType,
          error_message: errorLog.message,
          error_stack: errorLog.stack,
          page: errorLog.page,
          action: errorLog.action,
          ...errorLog.additional,
        },
        page: errorLog.page,
      });
    } catch (error) {
      console.error('Failed to send error to analytics:', error);
    }
  }

  /**
   * Get all logged errors
   */
  getErrors(): ErrorLog[] {
    return [...this.errors];
  }

  /**
   * Clear all logged errors
   */
  clearErrors() {
    this.errors = [];
  }

  /**
   * Get error count by type
   */
  getErrorCountByType(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const error of this.errors) {
      counts[error.errorType] = (counts[error.errorType] || 0) + 1;
    }
    return counts;
  }
}

// Singleton instance
export const errorMonitor = new ErrorMonitor();

/**
 * Global error handler
 */
export function setupGlobalErrorHandling() {
  // Handle unhandled errors
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      errorMonitor.log(event.error, {
        page: window.location.pathname,
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      errorMonitor.log(new Error(event.reason), {
        page: window.location.pathname,
        action: 'promise_rejection',
      });
    });
  }
}

/**
 * HOC to wrap components with error boundary
 */
export function withErrorTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  context?: Omit<ErrorContext, 'page'>
): React.ComponentType<P> {
  return function ErrorBoundaryWrapper(props: P) {
    const handleError = (error: Error) => {
      errorMonitor.log(error, {
        ...context,
        page: window.location.pathname,
      });
    };

    try {
      return <WrappedComponent {...props} />;
    } catch (error) {
      handleError(error as Error);
      return null;
    }
  };
}
