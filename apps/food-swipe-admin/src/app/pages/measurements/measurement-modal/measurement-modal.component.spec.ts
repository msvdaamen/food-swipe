import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementModalComponent } from './measurement-modal.component';

describe('MeasurementModalComponent', () => {
  let component: MeasurementModalComponent;
  let fixture: ComponentFixture<MeasurementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasurementModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeasurementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
