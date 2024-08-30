import { Component, effect, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../../common/components/ui/button/button.component';
import { FormTextareaComponent } from '../../../../common/components/ui/form/form-textarea/form-textarea.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogComponent } from '../../../../common/components/dialog.component';
import {
  FormSearchSelectComponent,
  FormSearchSelectDisplayFn,
  FormSearchSelectSearchFn,
  FormSearchSelectValueFn,
} from '../../../../common/components/ui/form/form-search-select/form-search-select.component';
import { RecipeRepository } from '@modules/recipes/recipe.repository';
import { IngredientRepository } from '@modules/ingredient/ingredient.repository';
import { Ingredient } from '@modules/ingredient/types/ingredient.type';

@Component({
  selector: 'app-manage-recipe-ingredient-dialog',
  standalone: true,
  imports: [
    ButtonComponent,
    FormTextareaComponent,
    ReactiveFormsModule,
    FormSearchSelectComponent,
    FormsModule,
  ],
  templateUrl: './manage-recipe-ingredient-dialog.component.html',
  styleUrl: './manage-recipe-ingredient-dialog.component.scss',
})
export class ManageRecipeIngredientDialogComponent extends DialogComponent<{
  recipeId: number;
  ingredientId: number;
}> {
  private readonly recipeRepository = inject(RecipeRepository);
  private readonly ingredientRepository = inject(IngredientRepository);

  ingredients = this.ingredientRepository.ingredients;

  temp = signal(null);

  constructor() {
    super();
    this.ingredientRepository.loadAll({ page: 1, amount: 20 });

    effect(() => {
      console.log(this.temp());
    });
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

  submit(): void {}
}
