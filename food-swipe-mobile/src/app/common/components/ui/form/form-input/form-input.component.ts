import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { FaIconComponent, IconName } from '@fortawesome/angular-fontawesome';
import { RegisterOnToucheFn } from '../../../../types/form.types';

type InputType = 'number' | 'text' | 'email' | 'password';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FaIconComponent],
  selector: 'app-form-input',
  standalone: true,
  styleUrls: ['./form-input.component.scss'],
  templateUrl: './form-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FormInputComponent,
      multi: true,
    },
  ],
})
export class FormInputComponent implements ControlValueAccessor {
  @ViewChild(DefaultValueAccessor, { static: true })
  dva: DefaultValueAccessor | null = null;

  @Input() type: InputType = 'text';
  @Input() placeholder = '';
  @Input() iconSuffix: IconName | null = null;
  @Input() disabled = false;

  // *** ControlValueAccessor Methods
  setDisabledState(isDisabled: boolean): void {
    this.dva?.setDisabledState(isDisabled);
  }

  writeValue(value: any): void {
    this.dva?.writeValue(value);
  }

  registerOnChange(fn: any): void {
    this.dva?.registerOnChange(fn);
  }

  registerOnTouched(fn: RegisterOnToucheFn): void {
    this.dva?.registerOnTouched(fn);
  }
}
