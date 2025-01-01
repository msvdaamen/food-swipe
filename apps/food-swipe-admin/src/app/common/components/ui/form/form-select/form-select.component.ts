import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  FormTypes,
  RegisterOnChangeFn,
  RegisterOnToucheFn,
} from '../../../../types/form.types';

@Component({
  selector: 'app-form-select',
  imports: [CommonModule, FormsModule],
  template: ` <select
    class="invalid:border-danger-600 flex w-full rounded border border-gray-300 px-1.5 py-1 outline-0 transition-colors focus-within:border-primary-600 disabled:bg-gray-200"
    [(ngModel)]="_value"
  >
    <ng-content />
  </select>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FormSelectComponent,
      multi: true,
    },
  ],
})
export class FormSelectComponent implements ControlValueAccessor, OnInit {
  private __value: FormTypes | null = null;

  value = input<string>('');
  disabled = signal<boolean>(false);

  set _value(value: FormTypes) {
    this.__value = value;
    this.onChange(value);
    this.onTouched();
  }

  get _value(): FormTypes | null {
    return this.__value;
  }

  ngOnInit() {
    if (this.value()) {
      this.writeValue(this.value());
    }
  }

  // *** ControlValueAccessor Methods
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  writeValue(value: FormTypes | null): void {
    this.__value = value;
  }

  onChange: RegisterOnChangeFn<FormTypes> = () => {};
  registerOnChange(fn: RegisterOnChangeFn<FormTypes>): void {
    this.onChange = fn;
  }

  onTouched: RegisterOnToucheFn = () => {};
  registerOnTouched(fn: RegisterOnToucheFn): void {
    this.onTouched = fn;
  }
}
