import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  input,
  Input,
  OnInit,
  output,
  signal,
  viewChild,
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
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class FormInputComponent implements ControlValueAccessor, OnInit {
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild(DefaultValueAccessor, { static: true })
  dva: DefaultValueAccessor | null = null;

  inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');

  value = input('');
  type = input<InputType>('text');
  placeholder = input('');
  iconSuffix = input<IconDefinition | null>(null);
  disabled = input(false);

  focus = output<FocusEvent>();
  blur = output<FocusEvent>();

  constructor() {
    afterNextRender(() => {
      if (this.type() === 'number') {
        const el = this.inputRef()?.nativeElement;
        if (el) {
          fromEvent(el, 'wheel')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        }
      }
    });
  }

  ngOnInit() {
    if (this.value()) {
      this.writeValue(this.value());
    }
  }

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
