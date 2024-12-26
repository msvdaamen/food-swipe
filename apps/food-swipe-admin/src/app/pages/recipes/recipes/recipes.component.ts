import { Component, computed, inject, signal } from '@angular/core';
import { RecipeRepository } from '../../../modules/recipes/recipe.repository';
import { FormInputComponent } from '../../../common/components/ui/form/form-input/form-input.component';
import {
  faMagnifyingGlass,
  faQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../common/components/ui/button/button.component';
import { Dialog } from '@angular/cdk/dialog';
import { CreateRecipeDialogComponent } from '@modules/recipes/components/create-recipe-dialog/create-recipe-dialog.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ImportRecipeDialogComponent } from '@modules/recipes/components/import-recipe-dialog/import-recipe-dialog.component';

@Component({
  selector: 'app-recipes',
  imports: [
    FormInputComponent,
    FormsModule,
    RouterLink,
    ButtonComponent,
    FaIconComponent,
  ],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export default class RecipesComponent {
  private readonly recipeRepository = inject(RecipeRepository);
  private readonly dialog = inject(Dialog);

  search = signal('');

  recipes = computed(() => {
    const search = this.search();
    const recipes = this.recipeRepository.recipes();
    if (!search.trim()) {
      return recipes;
    }
    return recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(search.toLowerCase()),
    );
  });

  protected readonly faMagnifyingGlass = faMagnifyingGlass;

  constructor() {
    this.recipeRepository.loadRecipes();
  }

  openCreateRecipeDialog() {
    this.dialog.open(CreateRecipeDialogComponent);
  }

  openImportDialog() {
    this.dialog.open(ImportRecipeDialogComponent);
  }

  protected readonly faQuestion = faQuestion;
}
