import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * AuthInterceptor - Injects JWT token into requests and handles 401 responses
 * Implements refresh token rotation pattern
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  private isRefreshing = false;
  private readonly refreshTokenSubject$ = new BehaviorSubject<string | null>(null);

  intercept(request: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url.includes('/login') || request.url.includes('/refresh')) {
      return next.handle(request);
    }

    const token = this.authService.getAccessToken();
    if (token) {
      request = this.addTokenToRequest(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Add JWT token to request Authorization header
   */
  private addTokenToRequest(request: HttpRequest<any>,token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Handle 401 (Unauthorized) responses
   * Attempts token refresh, then retries original request
   */
  private handle401Error( request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject$.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((tokens) => {
          this.isRefreshing = false;
          this.refreshTokenSubject$.next(tokens.accessToken);
          return next.handle(this.addTokenToRequest(request, tokens.accessToken));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => error);
        })
      );
    }

    // Wait for token refresh to complete, then retry request
    return this.refreshTokenSubject$.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        return next.handle(this.addTokenToRequest(request, token as string));
      })
    );
  }
}

/**
 * ErrorLoggingInterceptor - Logs HTTP errors to console/external service
 */
@Injectable()
export class ErrorLoggingInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorLog = {
          timestamp: new Date().toISOString(),
          url: request.url,
          method: request.method,
          status: error.status,
          message: error.message,
          error: error.error,
        };

        console.error('[HTTP Error]', errorLog);
        return throwError(() => error);
      })
    );
  }
}

/**
 * Request logging interceptor (development only)
 */
@Injectable()
export class RequestLoggingInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const started = Date.now();
    return next.handle(request).pipe(
      catchError((error) => {
        const elapsed = Date.now() - started;
        console.log(
          `[${request.method}] ${request.url} FAILED after ${elapsed}ms`,
          error
        );
        return throwError(() => error);
      })
    );
  }
}

/**
 * Provider for all HTTP interceptors
 */
export const HTTP_INTERCEPTORS_PROVIDERS = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorLoggingInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: RequestLoggingInterceptor, multi: true },
];
