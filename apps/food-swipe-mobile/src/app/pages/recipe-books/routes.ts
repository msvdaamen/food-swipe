import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./recipe-books/recipe-books.component'),
  },
] as Routes;
