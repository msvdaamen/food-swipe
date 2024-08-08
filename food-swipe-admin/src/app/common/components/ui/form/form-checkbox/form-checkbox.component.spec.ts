import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormCheckboxComponent } from './form-checkbox.component';

describe('FormCheckoxComponent', () => {
  let component: FormCheckboxComponent;
  let fixture: ComponentFixture<FormCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCheckboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.registerOnChange(jest.fn());
    component.registerOnTouched(jest.fn());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should register onChange and onTouched', () => {
    expect(component.onChange).toBeTruthy();
    expect(component.onTouched).toBeTruthy();
  });

  it('Should be false by default', () => {
    expect(component.value).toBeFalsy();
  });

  it('Should write true value to formControl', () => {
    component.writeValue(true);
    expect(component.value).toBeTruthy();
  });

  it('Should write false value to formControl', () => {
    component.writeValue(false);
    expect(component.value).toBeFalsy();
  });

  it('Should only write boolean values formControl', () => {
    component.writeValue('appel');
    expect(component.value).toBeFalsy();
    component.writeValue(1);
    expect(component.value).toBeFalsy();
  });

  it('Should set disabled state', async () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTruthy();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.debugElement.nativeElement.querySelector('input').disabled
    ).toBe(true);
  });

  it('Should call onChange and onTouched on value change', () => {
    const onChangeSpy = jest.spyOn(component, 'onChange');
    const onTouchedSpy = jest.spyOn(component, 'onTouched');
    component.value = true;
    expect(onChangeSpy).toHaveBeenCalled();
    expect(onTouchedSpy).toHaveBeenCalled();
  });
});
