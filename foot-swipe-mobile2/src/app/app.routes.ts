import { Routes } from '@angular/router';
import { AuthGuard } from './modules/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/main-page/routes'),
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/routes'),
  },
];
