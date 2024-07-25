import { inject, Injectable, signal } from '@angular/core';
import { AuthUser } from './models/auth.user.type';
import { SignInRequest } from './requests/sign-in.request';
import { SignUpRequest } from './requests/sign-up.request';
import { AuthService } from './auth.service';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

@Injectable({ providedIn: 'root' })
export class AuthRepository {
  private readonly service = inject(AuthService);

  user = signal<AuthUser | null>(null);

  signIn(payload: SignInRequest) {
    this.service.singIn(payload).subscribe((response) => {
      this.setTokens(response.accessToken, response.refreshToken);
      this.user.set(response.user);
    })
  }

  signUp(payload: SignUpRequest) {
    this.service.signUp(payload).subscribe((response) => {
      this.setTokens(response.accessToken, response.refreshToken);
      this.user.set(response.user);
    });
  }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
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
}
