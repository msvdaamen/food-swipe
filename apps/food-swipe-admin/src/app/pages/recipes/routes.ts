import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./recipes/recipes.component'),
  },
  {
    path: ':id',
    loadComponent: () => import('./recipe/recipe.component'),
  },
] as Routes;
