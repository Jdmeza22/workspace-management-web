import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User, AuthResponse, AuthTokens, ApiResponse } from '../interfaces/auth.interface';

/**
 * Authentication Service
 * Handles JWT tokens, user sessions, and authentication state
 * Implements refresh token rotation pattern
*/

const JWT_TOKEN_KEY = 'app_jwt_token';
const REFRESH_TOKEN_KEY = 'app_refresh_token';
const USER_KEY = 'app_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _user = signal<User | null>(this.loadUserFromStorage());
  private readonly _isAuthenticated = signal<boolean>(this.hasValidToken());
  private readonly _isLoading = signal<boolean>(false);


  readonly user = this._user.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  private readonly _logoutSubject = new Subject<void>();
  readonly logout$ = this._logoutSubject.asObservable();

  /**
   * Login user with email and password
   * Stores tokens and user data, then navigates to workspace selector
   */
  login(email: string, password: string): Observable<ApiResponse<AuthResponse>> {
    this._isLoading.set(true);
    return this.http.post<ApiResponse<AuthResponse>>('/login', { email, password })
      .pipe(
        tap((response) => {
          this.storeTokens(response.data?.tokens!);
          this._user.set(response.data?.user || null);
          this._isAuthenticated.set(true);
          this._isLoading.set(false);
        }),
        catchError((error) => {
          this._isLoading.set(false);
          throw error;
        })
      );
  }

  /**
   * Logout user
   * Clears tokens and user state, broadcasts logout event
   */
  logout(): void {
    this.clearTokens();
    this._user.set(null);
    this._isAuthenticated.set(false);
    this._logoutSubject.next();
    this.router.navigate(['/auth/login']);
  }

  /**
   * Refresh access token using refresh token
   * Called automatically via interceptor when access token expires
   */
  refreshToken(): Observable<AuthTokens> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return of({ accessToken: '', refreshToken: '', expiresIn: 0 });
    }

    // Keep refresh URL relative; interceptor will skip retry for refresh endpoints
    return this.http
      .post<AuthTokens>('/refresh', { refreshToken })
      .pipe(
        tap((tokens) => {
          this.storeTokens(tokens);
          this._isAuthenticated.set(true);
        }),
        catchError(() => {
          this.logout();
          throw new Error('Token refresh failed');
        })
      );
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(JWT_TOKEN_KEY);
  }

  /**
   * Get current refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Check if current token is valid (not expired)
   */
  hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = decoded.exp * 1000;
      return expiryTime > Date.now();
    } catch {
      return false;
    }
  }

  /**
   * Store tokens in localStorage
   */
  private storeTokens(tokens: AuthTokens): void {
    localStorage.setItem(JWT_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  /**
   * Clear tokens from localStorage
   */
  private clearTokens(): void {
    localStorage.removeItem(JWT_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Load user from localStorage
   */
  private loadUserFromStorage(): User | null {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }
}
