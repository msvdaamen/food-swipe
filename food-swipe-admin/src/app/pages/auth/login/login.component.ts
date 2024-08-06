import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../common/components/ui/button/button.component';
import { FormInputComponent } from '../../../common/components/ui/form/form-input/form-input.component';
import { AuthRepository } from '../../../modules/auth/auth.repository';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonComponent,
    FormInputComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authRepository = inject(AuthRepository);
  private readonly router = inject(Router);

  form = this.createForm();

  constructor() {
    effect(() => {
      const user = this.authRepository.user();
      if (user) {
        this.router.navigateByUrl('/');
      }
    });
  }

  /**
   * Creates and returns form.
   */
  createForm() {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    this.authRepository.signIn(this.form.getRawValue());
  }
}
