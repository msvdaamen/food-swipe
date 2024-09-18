import { Component, computed, effect, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../../common/components/ui/button/button.component';
import { DialogComponent } from '../../../../common/components/dialog.component';
import { FormInputComponent } from '../../../../common/components/ui/form/form-input/form-input.component';
import { FormsModule } from '@angular/forms';
import { RecipeRepository } from '@modules/recipes/recipe.repository';

@Component({
  selector: 'app-create-recipe-dialog',
  standalone: true,
  imports: [ButtonComponent, FormInputComponent, FormsModule],
  templateUrl: './create-recipe-dialog.component.html',
  styleUrl: './create-recipe-dialog.component.scss',
})
export class CreateRecipeDialogComponent extends DialogComponent {
  private readonly recipeRepository = inject(RecipeRepository);

  title = signal('');

  isValid = computed(() => !!this.title().trim());

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
    const title = this.title().trim();
    this.recipeRepository.createRecipe({ title });
    this.isLoading = true;
  }
}
