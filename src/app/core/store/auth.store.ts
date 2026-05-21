import {Injectable,signal,computed} from '@angular/core';
import {User,Workspace} from '../interfaces/auth.interface';

/**
 * Global Authentication Store
 * Signal-based state management
 */

export interface AuthState {
  user: User | null;
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastAuthCheck: Date | null;
}

const initialAuthState: AuthState = {
  user: null,
  currentWorkspace: null,
  workspaces: [],
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastAuthCheck: null
};

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private readonly _state =signal<AuthState>( initialAuthState);

  readonly user = computed(() => this._state().user);
  readonly currentWorkspace = computed(() => this._state().currentWorkspace);
  readonly workspaces = computed(() => this._state().workspaces);
  readonly isAuthenticated = computed(() => this._state().isAuthenticated);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);
  readonly canCreateProjects = computed(() => { const role = this.currentWorkspace()?.role;
    return role === 'Admin' || role === 'Editor';
  });

  /**
   * Current role in active workspace
   */
  readonly currentRole = computed(() =>this.currentWorkspace()?.role);

  /**
   * Admin access
   */
  readonly isAdmin = computed(() => this.currentRole() === 'Admin');


  setUser(user: User | null): void {
    this._state.update(state => ({
      ...state,
      user
    }));
  }
  setCurrentWorkspace( workspace: Workspace | null): void {
    this._state.update(state => ({
      ...state,
      currentWorkspace: workspace
    }));
  }

  setWorkspaces( workspaces: Workspace[]): void {
    this._state.update(state => ({
      ...state,
      workspaces
    }));
  }

  setIsLoading(isLoading: boolean): void {
    this._state.update(state => ({
      ...state,
      isLoading
    }));
  }

  setIsAuthenticated( isAuthenticated: boolean): void {
    this._state.update(state => ({
      ...state,
      isAuthenticated,
      lastAuthCheck: new Date()
    }));
  }

  setError( error: string | null ): void {
    this._state.update(state => ({
      ...state,
      error
    }));
  }

  resetError(): void {
    this._state.update(state => ({
      ...state,
      error: null
    }));
  }

  clear(): void {
    this._state.set(
      initialAuthState
    );
  }
}
