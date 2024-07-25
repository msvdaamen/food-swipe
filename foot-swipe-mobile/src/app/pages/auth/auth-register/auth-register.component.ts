import { Component, effect, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
  FormBuilder,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthRepository } from 'src/app/modules/auth/auth.repository';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.scss'],
  imports: [IonicModule, FormsModule, ReactiveFormsModule],
  standalone: true,
})
export class AuthRegisterComponent {
  fb = inject(NonNullableFormBuilder);
  router = inject(Router);
  authRepository = inject(AuthRepository);

  registerForm = this.createForm();

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
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      passwordConfirmation: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  register() {
    const payload = this.registerForm.getRawValue();
    this.authRepository.signUp(payload);
  }
}
