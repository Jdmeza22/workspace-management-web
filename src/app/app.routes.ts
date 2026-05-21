import { Routes } from '@angular/router';
import { authGuard, workspaceGuard } from './core/guards/auth.guards';

/**
 * Main application routes
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./core/features/auth/pages/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./core/features/features-signup').then((m) => m.SignupComponent),
      },
    ],
  },
  {
    path: 'workspace/:workspaceId',
    canActivate: [authGuard, workspaceGuard],
    loadComponent: () =>
      import('./core/features/projects/layout/layout-main.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./core/features/features-dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: 'projects',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./core/features/projects/project-list/project-list.component').then((m) => m.ProjectsListComponent),
          }
        ],
      },
      {
        path: 'tasks',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./core/features/features-tasks-list').then((m) => m.TasksListComponent),
          },
          {
            path: ':taskId',
            loadComponent: () =>
              import('./core/features/features-task-detail').then((m) => m.TaskDetailComponent),
          },
        ],
      },
      {
        path: 'boards',
        loadComponent: () =>
          import('./core/features/features-boards').then((m) => m.BoardsComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./core/features/features-settings').then((m) => m.SettingsComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/workspace-selector',
  },
];
