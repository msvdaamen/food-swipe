import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageIngredientDialogComponent } from './manage-ingredient-dialog.component';

describe('CreateRecipeIngredientDialogComponent', () => {
  let component: ManageIngredientDialogComponent;
  let fixture: ComponentFixture<ManageIngredientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageIngredientDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageIngredientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
