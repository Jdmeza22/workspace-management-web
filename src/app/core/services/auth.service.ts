import {Injectable,OnInit,inject,signal} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router} from '@angular/router';
import { Observable,tap} from 'rxjs';
import {ApiResponse,LoginResponse, GenerateTokenRequest,GenerateTokenResponse,User} from '../interfaces/auth.interface';
import { environment } from '../../../../src/enviroments/enviroment.development';

const JWT_TOKEN_KEY = 'jwt_token';
const USER_KEY = 'user';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this._isAuthenticated.set(!!this.getToken());
  }

  /**
   * Global auth state
   */
  private readonly _user = signal<User | null>(this.loadUserFromStorage());
  private readonly _isAuthenticated = signal<boolean>(!!this.getToken());
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  /**
   * Login user
   * Returns available workspaces
   */
  login( email: string,password: string): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/auth/login`, {email,password});
  }

  /**
   * Generate contextual JWT
   * after workspace selection
   */
  generateToken(request: GenerateTokenRequest): Observable<ApiResponse<GenerateTokenResponse>> {
    return this.http.post<ApiResponse<GenerateTokenResponse>>(`${environment.apiUrl}/auth/token`,request
    ).pipe(
      tap(response => {
        this.setToken( response.data?.token || '');
        this._isAuthenticated.set(true);
      })
    );
  }

  /**
   * Save JWT token
   */
  setToken(token: string): void {
    localStorage.setItem(
      JWT_TOKEN_KEY,
      token
    );
  }

  /**
   * Get JWT token
   */
  getToken(): string | null {
    return localStorage.getItem(
      JWT_TOKEN_KEY
    );
  }

  /**
   * Save logged user
   */
  setUser(user: User): void {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );
    this._user.set(user);
  }

  /**
   * Clear session
   */
  logout(): void {
    localStorage.removeItem(JWT_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
    this._isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Validate if token exists
   */
  hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Load persisted user
   */
  private loadUserFromStorage():User | null {
    try {
      const user =localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user): null;
    } catch {
      return null;
    }
  }
}
