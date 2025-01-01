import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
];

export default routes;
