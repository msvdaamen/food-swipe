import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthRepository } from '../auth.repository';

export const AuthGuard: CanActivateFn = () => {
  const repository = inject(AuthRepository);
  const router = inject(Router);
  const accessToken = repository.getAccessToken();
  if (!accessToken) {
    return router.parseUrl('/auth/login');
  }
  const service = inject(AuthService);
  const user = repository.user();
  if (user) {
    return true;
  }
  return service.me().pipe(
    map((me) => {
      repository.user.set(me);
      return true;
    }),
    catchError(() => {
      return of(router.parseUrl('/auth/login'));
    }),
  );
};
