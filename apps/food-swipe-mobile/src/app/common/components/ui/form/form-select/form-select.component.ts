import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FormTypes, RegisterOnChangeFn, RegisterOnToucheFn } from "../../../../types/form.types";

@Component({
    selector: 'app-form-select',
    imports: [CommonModule, FormsModule],
    templateUrl: './form-select.component.html',
    styleUrl: './form-select.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: FormSelectComponent,
            multi: true,
        },
    ]
})
export class FormSelectComponent implements ControlValueAccessor {

  private _value: FormTypes | null = null;

  disabled = signal<boolean>(false);

  set value(value: FormTypes) {
    this._value = value;
    this.onChange(value);
    this.onTouched();
  }

  get value(): FormTypes | null {
    return this._value;
  }

  // *** ControlValueAccessor Methods
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  writeValue(value: FormTypes | null): void {
    this._value = value;
  }

  onChange: RegisterOnChangeFn<FormTypes> = () => {}
  registerOnChange(fn: RegisterOnChangeFn<FormTypes>): void {
    this.onChange = fn;
  }

  onTouched: RegisterOnToucheFn = () => {}
  registerOnTouched(fn: RegisterOnToucheFn): void {
    this.onTouched = fn;
  }

}
