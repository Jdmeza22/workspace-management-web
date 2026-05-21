import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './auth.interceptor';
import {ErrorLoggingInterceptor} from './error-logging.interceptor';

/**
 * Global HTTP Interceptors
 */
export const HTTP_INTERCEPTORS_PROVIDERS = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorLoggingInterceptor,
    multi: true
  }
];
