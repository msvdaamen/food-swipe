import { Component, computed, effect, inject, input } from '@angular/core';
import { RecipeRepository } from '@modules/recipes/recipe.repository';
import { JsonPipe } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ButtonComponent } from '../../../common/components/ui/button/button.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ManageRecipeStepDialogComponent } from '@modules/recipes/components/manage-recipe-step-dialog/manage-recipe-step-dialog.component';
import { Dialog } from '@angular/cdk/dialog';

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

  ingredientsDrop(event: CdkDragDrop<number[]>) {
    const ingredients = [...this.ingredients()];
    moveItemInArray(ingredients, event.previousIndex, event.currentIndex);
    // this.ingredients.set(ingredients);
  }

  stepsDrop(event: CdkDragDrop<number[]>) {
    const steps = [...this.steps()];
    const stepId = steps[event.previousIndex].id;
    this.recipeRepository.reorderSteps(this.id(), stepId, {
      orderFrom: event.previousIndex + 1,
      orderTo: event.currentIndex + 1,
    });
    // moveItemInArray(steps, event.previousIndex, event.currentIndex);
    // this.steps.set(steps);
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
