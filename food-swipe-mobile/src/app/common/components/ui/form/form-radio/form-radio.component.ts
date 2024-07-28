import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {FormTypes, RegisterOnChangeFn, RegisterOnToucheFn} from "@common/types/form.types";

@Component({
  selector: 'app-form-radio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-radio.component.html',
  styleUrls: ['./form-radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FormRadioComponent,
      multi: true,
    },
  ],
})
export class FormRadioComponent implements ControlValueAccessor {
  _value!: any;
  disabled = false;

  @Input({ required: true, alias: 'value' }) radioValue!: any;
  @Input({ required: true }) name!: string;

  onChange!: (_: any) => void;
  onTouched!: () => void;

  set value(v: FormTypes) {
    this._value = v;
    this.onChange(v);
    this.onTouched();
  }

  get value(): any {
    return this._value;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: any): void {
    const type = typeof value;
    if (type !== 'string' && type !== 'number' && type !== 'boolean') {
      return;
    }

    this._value = value;
  }

  registerOnChange(fn: (_: RegisterOnChangeFn) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: RegisterOnToucheFn): void {
    this.onTouched = fn;
  }
}
