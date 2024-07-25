import { Injectable } from '@angular/core';
import { Observable, share } from 'rxjs';
import { Service } from 'src/app/common/service';
import { AuthUser } from './models/auth.user.type';
import { SignInRequest } from './requests/sign-in.request';
import { SignUpRequest } from './requests/sign-up.request';
import { AuthResponse } from './responses/auth.response';

@Injectable({ providedIn: 'root' })
export class AuthService extends Service {

	singIn(payload: SignInRequest) {
		return this.http.post<AuthResponse>(`${this.api}/auth/sign-in`, payload)
	}

	signUp(payload: SignUpRequest) {
		return this.http.post<AuthResponse>(`${this.api}/auth/sign-up`, payload)
	}

	me() {
		return this.http.get<AuthUser>(`${this.api}/auth/me`)
	}

	private _refreshRequest: Observable<{
		accessToken: string;
		refreshToken: string;
	}> | null = null;
	refreshToken(refreshToken: string) {
		if (this._refreshRequest) {
			return this._refreshRequest;
		}
		this._refreshRequest = this.http
			.post<{
				accessToken: string;
				refreshToken: string;
			}>(`${this.api}/auth/refresh-token`, { refreshToken })
			.pipe(share());
		this._refreshRequest.subscribe({
			complete: () => {
				console.log('refresh token complete');
				
				this._refreshRequest = null;
			}
		});
		return this._refreshRequest;
	}
}
