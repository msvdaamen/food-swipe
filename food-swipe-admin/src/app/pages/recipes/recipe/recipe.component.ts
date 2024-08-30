import { Component, computed, effect, inject, input } from '@angular/core';
import { RecipeRepository } from '@modules/recipes/recipe.repository';
import { JsonPipe } from '@angular/common';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { ButtonComponent } from '../../../common/components/ui/button/button.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ManageRecipeStepDialogComponent } from '@modules/recipes/components/manage-recipe-step-dialog/manage-recipe-step-dialog.component';
import { Dialog } from '@angular/cdk/dialog';
import { ManageRecipeIngredientDialogComponent } from '@modules/recipes/components/manage-recipe-ingredient-dialog/manage-recipe-ingredient-dialog.component';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [JsonPipe, CdkDropList, CdkDrag, ButtonComponent, FaIconComponent],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
})
export default class RecipeComponent {
  private readonly recipeRepository = inject(RecipeRepository);
  private readonly dialog = inject(Dialog);

  ingredients = this.recipeRepository.ingredients;
  steps = this.recipeRepository.steps;

  id = input.required<number>();
  recipe = computed(() => this.recipeRepository.getRecipe(this.id())());

  protected readonly faTrash = faTrash;
  protected readonly faPencil = faPencil;

  constructor() {
    effect(
      () => {
        this.recipeRepository.loadRecipe(this.id());
        this.recipeRepository.loadSteps(this.id());
        this.recipeRepository.loadIngredients(this.id());
      },
      { allowSignalWrites: true },
    );
  }

  openManageIngredientDialog(recipeId: number, ingredientId?: number) {
    this.dialog.open(ManageRecipeIngredientDialogComponent, {
      data: { recipeId, ingredientId },
    });
  }

  stepsDrop(event: CdkDragDrop<number[]>) {
    const steps = [...this.steps()];
    const stepId = steps[event.previousIndex].id;
    this.recipeRepository.reorderSteps(this.id(), stepId, {
      orderFrom: event.previousIndex + 1,
      orderTo: event.currentIndex + 1,
    });
  }

  openManageStepDialog(recipeId: number, stepId?: number) {
    this.dialog.open(ManageRecipeStepDialogComponent, {
      data: { recipeId, stepId },
    });
  }

  deleteStep(stepId: number) {
    this.recipeRepository.deleteStep(this.id(), stepId);
  }
}
