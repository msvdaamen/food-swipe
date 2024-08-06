import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormInputComponent } from './form-input.component';

describe('FormInputComponent', () => {
  let component: FormInputComponent;
  let fixture: ComponentFixture<FormInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should write value to the input', () => {
    component.writeValue('test');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('test');
  });

  it('Should set disabled state', async () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.debugElement.nativeElement.querySelector('input').disabled
    ).toBe(true);
  });
});
