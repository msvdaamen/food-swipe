import { Routes } from '@angular/router';
import { AuthGuard } from './modules/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/routes'),
  },
  {
    path: '',
    loadComponent: () => import('./pages/tabs-layout/tabs-layout.component'),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'recipes',
      },
      {
        path: 'recipes',
        loadComponent: () => import('./pages/recipes/recipes.component'),
      },
      {
        path: 'recipe-books',
        loadComponent: () =>
          import('./pages/recipe-books/recipe-books/recipe-books.component'),
      },
    ],
  },
];
