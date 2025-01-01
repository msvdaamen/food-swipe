import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRecipeStepDialogComponent } from './manage-recipe-step-dialog.component';

describe('CreateRecipeStepDialogComponent', () => {
  let component: ManageRecipeStepDialogComponent;
  let fixture: ComponentFixture<ManageRecipeStepDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRecipeStepDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageRecipeStepDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
