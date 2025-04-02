import { Component, effect, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../../../components/ui/button/button.component';
import { FormTextareaComponent } from '../../../../../components/ui/form/form-textarea/form-textarea.component';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogComponent } from '../../../../common/components/dialog.component';
import {
  FormSearchSelectComponent,
  FormSearchSelectDisplayFn,
  FormSearchSelectSearchFn,
  FormSearchSelectValueFn,
} from '../../../../../components/ui/form/form-search-select/form-search-select.component';
import { RecipeRepository } from '@modules/recipes/recipe.repository';
import { IngredientRepository } from '@modules/ingredient/ingredient.repository';
import { Ingredient } from '@modules/ingredient/types/ingredient.type';
import { FormInputComponent } from '../../../../../components/ui/form/form-input/form-input.component';
import { FormSelectComponent } from '../../../../../components/ui/form/form-select/form-select.component';
import { MeasurementRepository } from '@modules/measurement/measurement.repository';

@Component({
  selector: 'app-manage-recipe-ingredient-dialog',
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    FormSearchSelectComponent,
    FormsModule,
    FormInputComponent,
  ],
  templateUrl: './manage-recipe-ingredient-dialog.component.html',
  styleUrl: './manage-recipe-ingredient-dialog.component.scss',
})
export class ManageRecipeIngredientDialogComponent extends DialogComponent<{
  recipeId: number;
  ingredientId?: number;
}> {
  private readonly recipeRepository = inject(RecipeRepository);
  private readonly ingredientRepository = inject(IngredientRepository);
  private readonly measurementRepository = inject(MeasurementRepository);
  private readonly fb = inject(FormBuilder);

  ingredients = this.ingredientRepository.ingredients;
  measurements = this.measurementRepository.measurements;

  form = this.createForm();

  constructor() {
    super();
    this.ingredientRepository.loadAll({ page: 1, amount: 20 });
    this.measurementRepository.loadAll();

    if (this.data.ingredientId) {
      const ingredient = this.recipeRepository.getIngredient(
        this.data.recipeId,
        this.data.ingredientId,
      )();
      const ingredientValue: Ingredient = {
        id: ingredient.ingredientId,
        name: ingredient.ingredient,
      };
      this.form.patchValue({
        ingredient: ingredientValue,
        measurementId: ingredient.measurementId,
        amount: ingredient.amount.toString(),
      });
    }
  }

  displayFn: FormSearchSelectDisplayFn<Ingredient> = (value) => value.name;
  valueFn: FormSearchSelectValueFn<Ingredient> = (value) => value.id;
  searchFn: FormSearchSelectSearchFn<Ingredient> = (ingredients, search) =>
    ingredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(search.toLowerCase()),
    );

  searchChanged(search: string): void {
    this.ingredientRepository.loadAll({ page: 1, amount: 20, search });
  }

  submit(): void {
    if (this.data.ingredientId) {
      this.update();
    } else {
      this.create();
    }
    this.close();
  }

  create() {
    const { ingredient, measurementId, amount } = this.form.value;
    if (!ingredient || !amount) {
      return;
    }
    this.recipeRepository.createIngredient(this.data.recipeId, {
      ingredientId: ingredient.id,
      measurementId: measurementId ?? null,
      amount: Number(amount),
    });
  }

  update() {
    const ingredientId = this.data.ingredientId;
    const { ingredient, measurementId, amount } = this.form.value;
    if (!ingredientId || !ingredient || !amount) {
      return;
    }
    this.recipeRepository.updateIngredient(this.data.recipeId, ingredientId, {
      ingredientId: ingredient.id,
      measurementId: measurementId ?? null,
      amount: Number(amount),
    });
  }

  createForm() {
    return this.fb.group({
      ingredient: [null as Ingredient | null, Validators.required],
      measurementId: [null as number | null],
      amount: [null as string | null, [Validators.required, Validators.min(1)]],
    });
  }
}
