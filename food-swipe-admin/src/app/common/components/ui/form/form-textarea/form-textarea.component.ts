import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { RegisterOnToucheFn } from '../../../../types/form.types';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-form-textarea',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CdkTextareaAutosize,
    FormsModule,
  ],
  templateUrl: './form-textarea.component.html',
  styleUrl: './form-textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FormTextareaComponent,
      multi: true,
    },
  ],
})
export class FormTextareaComponent implements ControlValueAccessor, OnInit {
  defaultValue = input('', { alias: 'value' });
  placeholder = input('');
  autoSize = input(false, { transform: booleanAttribute });
  rows = input(3);
  minRows = input(3);
  maxRows = input(10);
  disabled = signal(false);

  blur = output<FocusEvent>();
  focus = output<FocusEvent>();

  _value = '';

  ngOnInit() {
    if (this.defaultValue()) {
      this.writeValue(this.defaultValue());
    }
  }

  set value(value: string) {
    this._value = value;
    this.onChange(value);
    this.onTouched();
  }

  get value() {
    return this._value;
  }

  onChange = (_: any) => {};
  onTouched = () => {};

  // *** ControlValueAccessor Methods
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  writeValue(value: any): void {
    this._value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: RegisterOnToucheFn): void {
    this.onTouched = fn;
  }
}
