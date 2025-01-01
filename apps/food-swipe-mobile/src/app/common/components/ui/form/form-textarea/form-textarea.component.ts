import {ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ControlValueAccessor, DefaultValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {RegisterOnToucheFn} from "../../../../types/form.types";

@Component({
    selector: 'app-form-textarea',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './form-textarea.component.html',
    styleUrl: './form-textarea.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: FormTextareaComponent,
            multi: true,
        },
    ]
})
export class FormTextareaComponent implements ControlValueAccessor {
  @ViewChild(DefaultValueAccessor, { static: true })
  dva: DefaultValueAccessor | null = null;

  @Input() placeholder = '';

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
