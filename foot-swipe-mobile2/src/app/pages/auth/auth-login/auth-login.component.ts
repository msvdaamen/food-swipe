import { Component, effect, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthRepository } from 'src/app/modules/auth/auth.repository';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss'],
  imports: [IonicModule, ReactiveFormsModule, RouterLink],
  standalone: true,
})
export class AuthLoginComponent {
  fb = inject(NonNullableFormBuilder);
  router = inject(Router);
  authRepository = inject(AuthRepository);

  loginForm = this.createForm();

  constructor() {
    effect(() => {
      const user = this.authRepository.user();
      if (user) {
        this.router.navigate(['/']);
      }
    });
  }

  createForm() {
    return this.fb.group({
      email: ['test@test.com', [Validators.required, Validators.email]],
      password: ['test', [Validators.required, Validators.minLength(3)]],
    });
  }

  login() {
    const { email, password } = this.loginForm.getRawValue();
    this.authRepository.signIn({ email, password });
  }
}
