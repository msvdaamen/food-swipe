import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent } from '../../../common/components/ui/button/button.component';
import { FormInputComponent } from '../../../common/components/ui/form/form-input/form-input.component';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-forgot-password',
    imports: [
        ButtonComponent,
        FormInputComponent,
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
    ],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);

  form = this.createForm();

  /**
   * Creates and returns form.
   */
  createForm() {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  forgotPassword() {
    console.log('forgot password');
  }
}
