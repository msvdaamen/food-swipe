import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RegisterOnToucheFn } from '../../../../types/form.types';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

type InputType = 'number' | 'text' | 'email' | 'password' | 'file';

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
  @Input() iconSuffix: IconDefinition | null = null;
  @Input() disabled = false;
  forceDark = input(false, { transform: booleanAttribute });

  // *** ControlValueAccessor Methods
  setDisabledState(isDisabled: boolean): void {
    this.dva?.setDisabledState(isDisabled);
  }

  writeValue(value: unknown): void {
    this.dva?.writeValue(value);
  }

  registerOnChange(fn: never): void {
    this.dva?.registerOnChange(fn);
  }

  registerOnTouched(fn: RegisterOnToucheFn): void {
    this.dva?.registerOnTouched(fn);
  }
}
