import { Injectable, signal, computed, inject } from '@angular/core';
import { User, Workspace, AuthTokens } from '../interfaces/auth.interface';
import { AuthService } from '../services/auth.service';

/**
 * Auth Store using NgRx Signals
 * Centralized, type-safe state management for authentication and authorization
 * No effects, no reducers - just signals and computed values
 */

export interface AuthState {
  user: User | null;
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastAuthCheck: Date | null;
}

const initialAuthState: AuthState = {
  user: null,
  currentWorkspace: null,
  workspaces: [],
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastAuthCheck: null,
};

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly authService = inject(AuthService);
  private readonly _state = signal<AuthState>(initialAuthState);

  readonly user = computed(() => this._state().user);
  readonly currentWorkspace = computed(() => this._state().currentWorkspace);
  readonly workspaces = computed(() => this._state().workspaces);
  readonly isAuthenticated = computed(() => this._state().isAuthenticated);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);
  readonly canAdminWorkspace = computed(() => {
    const user = this.user();
    return user !== null; // TODO: Check admin role
  });

  /**
   * Set current user
   */
  setUser(user: User | null): void {
    this._state.update((state) => ({
      ...state,
      user,
    }));
  }

  /**
   * Set current workspace
   */
  setCurrentWorkspace(workspace: Workspace | null): void {
    this._state.update((state) => ({
      ...state,
      currentWorkspace: workspace,
    }));
  }

  /**
   * Set list of available workspaces
   */
  setWorkspaces(workspaces: Workspace[]): void {
    this._state.update((state) => ({
      ...state,
      workspaces,
    }));
  }

  /**
   * Set authentication tokens
   */
  setTokens(tokens: AuthTokens | null): void {
    this._state.update((state) => ({
      ...state,
      tokens,
    }));
  }

  /**
   * Set loading state
   */
  setIsLoading(isLoading: boolean): void {
    this._state.update((state) => ({
      ...state,
      isLoading,
    }));
  }

  /**
   * Set authentication state
   */
  setIsAuthenticated(isAuthenticated: boolean): void {
    this._state.update((state) => ({
      ...state,
      isAuthenticated,
      lastAuthCheck: new Date(),
    }));
  }

  /**
   * Set error
   */
  setError(error: string | null): void {
    this._state.update((state) => ({
      ...state,
      error,
    }));
  }

  /**
   * Clear all state
   */
  clear(): void {
    this._state.set(initialAuthState);
  }

  /**
   * Reset error
   */
  resetError(): void {
    this._state.update((state) => ({
      ...state,
      error: null,
    }));
  }

  /**
   * Initialize store from persisted session
   */
  initializeFromSession(): void {
    const hasToken = this.authService.hasValidToken();
    if (hasToken) {
      this.setIsAuthenticated(true);
      // TODO: Load user and workspace from API
    }
  }
}
