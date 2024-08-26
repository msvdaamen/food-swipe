import { Routes } from '@angular/router';
import { AuthGuard } from './modules/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/routes'),
  },
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component'),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'activities',
        children: [
          {
            path: 'logins',
            loadComponent: () =>
              import(
                './pages/activities/login-attempts/login-attempts.component'
              ),
          },
          {
            path: 'recipes',
            loadComponent: () =>
              import(
                './pages/activities/recipes-uploaded/recipes-uploaded.component'
              ),
          },
        ],
      },
      {
        path: 'measurements',
        loadComponent: () =>
          import('./pages/measurements/measurements.component'),
      },
    ],
  },
];
