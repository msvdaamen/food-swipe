import { Routes } from '@angular/router';

export default [
  {
    path: 'query-logs',
    loadComponent: () => import('./query-logs/query-logs.component'),
  },
] as Routes;
