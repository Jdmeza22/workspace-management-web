import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS_PROVIDERS } from './core/interceptors/http-interceptors';
import { globalErrorHandlerProvider } from './core/common/error-handler';

/**
 * Angular Application Configuration
 * Configures:
 * - HTTP client with interceptors
 * - Router with feature modules
 * - Global error handling
 * - Authentication and state management
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    ...HTTP_INTERCEPTORS_PROVIDERS,
    globalErrorHandlerProvider,
  ],
};
