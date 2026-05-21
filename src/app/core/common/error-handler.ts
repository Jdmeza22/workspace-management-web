import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Global Error Handler
 * Catches unhandled errors and routes them appropriately
 * Logs to console and external services
 */

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse): void {
    const chunkFailedMessage = /Loading chunk \d+ failed/g;
    const isChunkFailedError = chunkFailedMessage.test(error.message);

    if (isChunkFailedError) {
      this.handleChunkLoadError();
      return;
    }

    this.logError(error);
    this.notifyUser(error);
  }

  /**
   * Handle chunk loading failures (e.g., lazy loading failed)
   * Can trigger page reload or show fallback UI
   */
  private handleChunkLoadError(): void {
    window.location.reload();
  }

  /**
   * Log error to console and external service
   */
  private logError(error: Error | HttpErrorResponse): void {
    const timestamp = new Date().toISOString();

    if (error instanceof HttpErrorResponse) {
      console.error(
        `[${timestamp}] HTTP Error: ${error.status} ${error.statusText}`,
        error
      );
      // TODO: Send to external logging service (Sentry, DataDog, etc.)
    } else {
      console.error(`[${timestamp}] Error:`, error);
      // TODO: Send to external logging service
    }
  }

  /**
   * Notify user about error
   * TODO: Integrate with toast notification service
   */
  private notifyUser(error: Error | HttpErrorResponse): void {
    let message = 'An unexpected error occurred';

    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          message = 'Network error. Please check your connection.';
          break;
        case 401:
          message = 'Your session has expired. Please login again.';
          break;
        case 403:
          message = 'You do not have permission to perform this action.';
          break;
        case 404:
          message = 'Resource not found.';
          break;
        case 500:
        case 502:
        case 503:
          message = 'Server error. Please try again later.';
          break;
        default:
          message = error.error?.message || message;
      }
    }

    console.warn('User notification:', message);
    // TODO: Emit toast notification
  }
}

/**
 * Provider function for global error handler
 */
export const globalErrorHandlerProvider = {
  provide: ErrorHandler,
  useClass: GlobalErrorHandler,
};
