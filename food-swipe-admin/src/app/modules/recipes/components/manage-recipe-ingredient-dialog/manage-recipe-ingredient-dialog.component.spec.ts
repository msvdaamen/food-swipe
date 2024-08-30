import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRecipeIngredientDialogComponent } from './manage-recipe-ingredient-dialog.component';

describe('CreateRecipeIngredientDialogComponent', () => {
  let component: ManageRecipeIngredientDialogComponent;
  let fixture: ComponentFixture<ManageRecipeIngredientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRecipeIngredientDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageRecipeIngredientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
