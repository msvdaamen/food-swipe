import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  RegisterOnChangeFn,
  RegisterOnToucheFn,
} from '../../../../types/form.types';

@Component({
    selector: 'app-form-checkbox',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form-checkbox.component.html',
    styleUrls: ['./form-checkbox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: FormCheckboxComponent,
            multi: true,
        },
    ]
})
export class FormCheckboxComponent implements ControlValueAccessor, OnInit {
  defaultValue = input(false, { alias: 'value' });

  _value = false;
  disabled = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  ngOnInit() {
    if (this.defaultValue()) {
      this.writeValue(this.defaultValue());
    }
  }

  set value(v: boolean) {
    this._value = v;
    this.onChange(v);
    this.onTouched();
  }

  get value() {
    return this._value;
  }

  setDisabledState(d: boolean) {
    this.disabled = d;
  }

  writeValue(value: any): void {
    if (typeof value !== 'boolean') {
      return;
    }

    this._value = value;
  }

  registerOnChange(fn: RegisterOnChangeFn<boolean>): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: RegisterOnToucheFn): void {
    this.onTouched = fn;
  }
}
