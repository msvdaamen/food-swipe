import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page.component';

export default [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'recipes',
      },
      {
        path: 'recipes',
        loadComponent: () => import('../recipes/recipes.component'),
      },
      {
        path: 'liked',
        loadComponent: () => import('../liked/liked.component'),
      },
      {
        path: 'account',
        loadComponent: () => import('../account/account.component'),
      },
    ],
  },
] as Routes;
