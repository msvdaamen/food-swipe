import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import {
  FormTypes,
  RegisterOnChangeFn,
  RegisterOnToucheFn,
} from '../../../../types/form.types';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { BehaviorSubject, debounceTime, fromEvent } from 'rxjs';
import { outputFromObservable, toSignal } from '@angular/core/rxjs-interop';

export type FormSearchSelectDisplayFn<T> = (value: T) => string;
export type FormSearchSelectValueFn<T> = (value: T) => FormTypes;
export type FormSearchSelectSearchFn<T> = (data: T[], search: string) => T[];

@Component({
  selector: 'app-form-search-select',
  standalone: true,
  imports: [FaIconComponent, ReactiveFormsModule, FormsModule, OverlayModule],
  templateUrl: './form-search-select.component.html',
  styleUrl: './form-search-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FormSearchSelectComponent,
      multi: true,
    },
  ],
})
export class FormSearchSelectComponent
  implements ControlValueAccessor, AfterViewInit
{
  triggerRef = viewChild<ElementRef<HTMLDivElement>>('trigger');
  searchInputRef =
    viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _data = input.required<any[]>({ alias: 'data' });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayFn = input.required<FormSearchSelectDisplayFn<any>>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueFn = input.required<FormSearchSelectValueFn<any>>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchFn = input.required<FormSearchSelectSearchFn<any>>();

  placeholder = input('');
  iconSuffix = input<IconDefinition | null>(null);

  searchSubject = new BehaviorSubject('');
  searchChanged = outputFromObservable(
    this.searchSubject.pipe(debounceTime(200)),
  );

  disabled = signal(false);
  isOpen = signal(false);

  search = toSignal(this.searchSubject.pipe(debounceTime(200)));
  data = computed(() => {
    const search = this.search();
    const data = this._data();
    if (!search) {
      return data;
    }
    return this.searchFn()(data, search);
  });

  private _value: FormTypes | null = null;
  positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      panelClass: 'mat-mdc-select-panel-above',
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      panelClass: 'mat-mdc-select-panel-above',
    },
  ];
  overlayWidth = signal(0);

  ngAfterViewInit() {
    fromEvent(this.searchInputRef().nativeElement, 'input').subscribe(
      (event) => {
        if (event.target instanceof HTMLInputElement) {
          this.searchSubject.next(event.target.value);
        }
      },
    );
  }

  open() {
    const width =
      this.triggerRef()!.nativeElement.getBoundingClientRect().width;
    this.overlayWidth.set(width);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected setValue(value: any) {
    this.value = value;
  }

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

  onChange: RegisterOnChangeFn<FormTypes> = () => {};
  registerOnChange(fn: RegisterOnChangeFn<FormTypes>): void {
    this.onChange = fn;
  }

  onTouched: RegisterOnToucheFn = () => {};
  registerOnTouched(fn: RegisterOnToucheFn): void {
    this.onTouched = fn;
  }
}
