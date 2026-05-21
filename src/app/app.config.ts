import { ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient,withInterceptorsFromDi} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import {HTTP_INTERCEPTORS_PROVIDERS} from './core/interceptors/index';
import {globalErrorHandlerProvider} from './core/common/error-handler';

/**
 * Angular Application Configuration
 * Configures:
 * - Router
 * - HTTP Client
 * - Interceptors
 * - Global Error Handling
 * - Angular Material Animations
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    ...HTTP_INTERCEPTORS_PROVIDERS,
    globalErrorHandlerProvider
  ]
};
