import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { AuthRepository } from '../auth.repository';
import { Router } from '@angular/router';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);
  const service = inject(AuthService);
  const repository = inject(AuthRepository);

  const token = repository.getAccessToken();
    if (token) {
      req = addTokenHeader(req, token);
    }
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (req.url.includes('auth/refresh-token')) {
          repository.removeTokens();
          router.navigate(['/auth/login']);
          return throwError(() => error);
        }
        if (req.url.includes('auth/')) {
          return throwError(() => error);
        }
        if (error.status === 401) {
          return handle401Error(req, next, repository, service, router);
        }
        return throwError(() => error);
      })
    );
};

function addTokenHeader(request: HttpRequest<unknown>, token: string) {
  return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

function handle401Error(request: HttpRequest<unknown>, next: HttpHandlerFn, repository: AuthRepository, service: AuthService, router: Router) {
  
  const token = repository.getRefreshToken();

  if (!token) {
    return throwError(() => new Error('No refresh token'));
  }
  return service.refreshToken(token).pipe(
    switchMap(token => {      
      repository.setTokens(token.accessToken, token.refreshToken);
      return next(addTokenHeader(request, token.accessToken));
    })
  );
}