import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRecipeDialogComponent } from './create-recipe-dialog.component';

describe('CreateRecipeDialogComponent', () => {
  let component: CreateRecipeDialogComponent;
  let fixture: ComponentFixture<CreateRecipeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRecipeDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateRecipeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
