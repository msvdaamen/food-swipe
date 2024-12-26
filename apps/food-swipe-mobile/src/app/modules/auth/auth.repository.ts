import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthUser } from './models/auth.user.type';
import { SignInRequest } from './requests/sign-in.request';
import { SignUpRequest } from './requests/sign-up.request';
import { AuthService } from './auth.service';

export type UserScope = 'admin';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

@Injectable({ providedIn: 'root' })
export class AuthRepository {
  private readonly service = inject(AuthService);

  user = signal<AuthUser | null>(null);
  scopes = signal<Set<UserScope>>(new Set());
  isAdmin = computed(() => this.scopes().has('admin'));

  signIn(payload: SignInRequest) {
    this.service.singIn(payload).subscribe((response) => {
      this.setTokens(response.accessToken, response.refreshToken);
      this.user.set(response.user);
      this.setScopes(response.accessToken);
    });
  }

  signUp(payload: SignUpRequest) {
    this.service.signUp(payload).subscribe((response) => {
      this.setTokens(response.accessToken, response.refreshToken);
      this.user.set(response.user);
      this.setScopes(response.accessToken);
    });
  }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  setScopes(accessToken: string) {
    const decoded = this.parseJwt(accessToken);
    this.scopes.set(new Set(decoded.scopes));
  }

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  removeTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  parseJwt(token: string): { email: string; scopes: UserScope[] } {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  }
}
