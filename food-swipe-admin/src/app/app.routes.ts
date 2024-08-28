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
        path: '',
        pathMatch: 'full',
        redirectTo: 'activities/logins',
      },
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
      {
        path: 'ingredients',
        loadComponent: () =>
          import('./pages/ingredients/ingredients.component'),
      },
      {
        path: 'recipes',
        loadChildren: () => import('./pages/recipes/routes'),
      },
    ],
  },
];
