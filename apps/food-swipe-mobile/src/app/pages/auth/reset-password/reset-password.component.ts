import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormInputComponent } from '../../../common/components/ui/form/form-input/form-input.component';
import { ButtonComponent } from '../../../common/components/ui/button/button.component';

@Component({
  selector: 'app-reset-password',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormInputComponent,
    ButtonComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  @Input() token!: string;

  form = this.createForm();

  ngOnInit(): void {
    if (!this.token) {
      this.router.navigateByUrl('/auth/login', { replaceUrl: true });
    }
  }

  /**
   * Creates and returns form.
   */
  createForm() {
    return this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(3)]],
        passwordConfirm: ['', [Validators.required, Validators.minLength(3)]],
      },
      { validators: [this.passwordConformValidator] },
    );
  }

  passwordConformValidator(form: AbstractControl): ValidationErrors | null {
    const { password, passwordConfirm } = form.value;
    if (
      !password?.trim() ||
      !passwordConfirm?.trim() ||
      password !== passwordConfirm
    ) {
      return { passwordConfirm: 'Passwords do not match' };
    }
    return null;
  }

  resetPassword() {
    console.log('reset password');
  }
}
