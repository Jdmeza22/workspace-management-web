import { inject } from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AuthGuard - Protects routes that require authentication
 * Redirects to login if not authenticated
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};

/**
 * WorkspaceGuard - Ensures workspace is selected before accessing workspace-scoped routes
 */
export const workspaceGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const workspaceId = route.paramMap.get('workspaceId');

  if (!workspaceId) {
    return router.createUrlTree(['/workspace-selector']);
  }
  return true;
};

/**
 * RoleGuard - Validates user has required role for route
 * Usage: path: 'admin', canActivate: [roleGuard], data: { roles: ['admin'] }
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as string[];

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const user = authService.user();
  if (!user) {
    return router.createUrlTree(['/auth/login']);
  }
  return true;
};
