import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse,} from '@angular/common/http';
import {Observable,throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService }
  from '../services/auth.service';

/**
 * AuthInterceptor
 * Adds JWT token to requests
 * Handles unauthorized responses
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);

  intercept(request: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {
    if (
      request.url.includes('/auth/login') ||
      request.url.includes('/auth/token')
    ) {
      return next.handle(request);
    }

    const token =this.authService.getToken();

    if (token) {
      request =
        this.addTokenToRequest(
          request,
          token
        );
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Adds JWT token to request
   */
  private addTokenToRequest(request: HttpRequest<any>,token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
