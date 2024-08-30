import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSearchSelectComponent } from './form-search-select.component';

describe('FormSearchSelectComponent', () => {
  let component: FormSearchSelectComponent;
  let fixture: ComponentFixture<FormSearchSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSearchSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSearchSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
