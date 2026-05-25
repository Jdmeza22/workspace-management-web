import { Routes } from '@angular/router';

import {
  authGuard,
  workspaceGuard
} from './core/guards/auth.guards';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./core/features/auth/pages/login/login.component').then(m => m.LoginComponent),
      }
    ]
  },

  {
    path: 'workspace/:workspaceId',
    canActivate: [authGuard, workspaceGuard],
    loadComponent: () => import('./core/features/projects/layout/layout-main.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'projects',
        loadComponent: () => import('./core/features/projects/project-list/project-list.component').then(m => m.ProjectsListComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import( './core/shared/not-found/not-found.component' ).then( m => m.NotFoundComponent)
      },

      {
        path: 'tasks',
        loadComponent: () => import( './core/shared/not-found/not-found.component' ).then( m => m.NotFoundComponent)
      },

      {
        path: 'boards',
        loadComponent: () => import( './core/shared/not-found/not-found.component' ).then( m => m.NotFoundComponent)
      },

      {
        path: 'settings',
        loadComponent: () => import( './core/shared/not-found/not-found.component' ).then( m => m.NotFoundComponent)
      },
      {
        path: '**',
        loadComponent: () =>import('./core/shared/not-found/not-found.component').then(m => m.NotFoundComponent)
      }
    ]
  },

  {
    path: '**',
    redirectTo: '/auth/login',
  }
];
