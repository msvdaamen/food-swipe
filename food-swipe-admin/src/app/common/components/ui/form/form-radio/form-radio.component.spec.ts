import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormRadioComponent } from './form-radio.component';

describe('FormRadioComponent', () => {
  let component: FormRadioComponent;
  let fixture: ComponentFixture<FormRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRadioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.registerOnChange(jest.fn());
    component.registerOnTouched(jest.fn());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register on changed and on touched', () => {
    expect(component.onChange).toBeTruthy();
    expect(component.onTouched).toBeTruthy();
  });

  it('should set disabled state', async () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTruthy();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.debugElement.nativeElement.querySelector('input').disabled
    ).toBe(true);
  });

  it('should write value to formControl', () => {
    component.writeValue('Apple');
    expect(component.value).toBe('Apple');
  });

  it('should only write primitive values to formControl', () => {
    component.writeValue({});
    expect(component.value).toBeFalsy();

    component.writeValue('string');
    expect(component.value).toBe('string');

    component.writeValue(true);
    expect(component.value).toBe(true);

    component.writeValue(false);
    expect(component.value).toBe(false);

    component.writeValue(1);
    expect(component.value).toBe(1);

    component.writeValue(0);
    expect(component.value).toBe(0);

    component.writeValue({});
    expect(component.value).toBe(0);
  });
});
