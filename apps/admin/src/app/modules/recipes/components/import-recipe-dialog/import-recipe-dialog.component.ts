import { Component, computed, effect, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../../common/components/ui/button/button.component';
import { FormInputComponent } from '../../../../common/components/ui/form/form-input/form-input.component';
import { RecipeRepository } from '@modules/recipes/recipe.repository';
import { DialogComponent } from '../../../../common/components/dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-import-recipe-dialog',
  imports: [ButtonComponent, FormInputComponent, FormsModule],
  templateUrl: './import-recipe-dialog.component.html',
  styleUrl: './import-recipe-dialog.component.scss',
})
export class ImportRecipeDialogComponent extends DialogComponent {
  private readonly recipeRepository = inject(RecipeRepository);

  url = signal('');

  isValid = computed(() => !!this.url().trim());

  isLoading = false;

  constructor() {
    super();
    effect(() => {
      const isLoading = this.recipeRepository.isLoading();
      if (!isLoading && this.isLoading) {
        this.close();
      }
    });
  }

  submit() {
    if (!this.isValid()) {
      return;
    }
    const url = this.url().trim();
    this.recipeRepository.importRecipe(url);
    this.isLoading = true;
  }
}
