import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../common/components/ui/button/button.component';
import { FormInputComponent } from '../../../common/components/ui/form/form-input/form-input.component';
import { AuthRepository } from '../../../modules/auth/auth.repository';

@Component({
  selector: 'app-register',
  imports: [
    ButtonComponent,
    FormInputComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authRepository = inject(AuthRepository);
  private readonly router = inject(Router);

  form = this.createForm();

  constructor() {
    effect(() => {
      const user = this.authRepository.user();
      if (user) {
        this.router.navigateByUrl('/', { replaceUrl: true });
      }
    });
  }

  /**
   * Creates and returns form.
   */
  createForm() {
    return this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(3)]],
        passwordConfirmation: [
          '',
          [Validators.required, Validators.minLength(3)],
        ],
      },
      { validators: [this.validatePasswords] },
    );
  }

  validatePasswords(control: AbstractControl) {
    const password = control.get('password');
    const passwordConfirmation = control.get('passwordConfirmation');
    if (password?.value !== passwordConfirmation?.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  register(): void {
    this.authRepository.signUp(this.form.getRawValue());
  }
}
