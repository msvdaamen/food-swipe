import {
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { RecipeRepository } from '@modules/recipes/recipe.repository';
import { JsonPipe } from '@angular/common';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { ButtonComponent } from '../../../common/components/ui/button/button.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ManageRecipeStepDialogComponent } from '@modules/recipes/components/manage-recipe-step-dialog/manage-recipe-step-dialog.component';
import { Dialog } from '@angular/cdk/dialog';
import { ManageRecipeIngredientDialogComponent } from '@modules/recipes/components/manage-recipe-ingredient-dialog/manage-recipe-ingredient-dialog.component';
import { FormInputComponent } from '../../../common/components/ui/form/form-input/form-input.component';
import { FormsModule } from '@angular/forms';
import { FormTextareaComponent } from '../../../common/components/ui/form/form-textarea/form-textarea.component';
import { Recipe } from '@modules/recipes/types/recipe.type';
import { FormCheckboxComponent } from '../../../common/components/ui/form/form-checkbox/form-checkbox.component';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [
    JsonPipe,
    CdkDropList,
    CdkDrag,
    ButtonComponent,
    FaIconComponent,
    FormInputComponent,
    FormsModule,
    FormTextareaComponent,
    FormCheckboxComponent,
  ],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
})
export default class RecipeComponent {
  private readonly recipeRepository = inject(RecipeRepository);
  private readonly dialog = inject(Dialog);

  ingredients = this.recipeRepository.ingredients;
  steps = this.recipeRepository.steps;

  id = input.required<number, string>({ transform: numberAttribute });
  recipe = computed(() => this.recipeRepository.getRecipe(this.id())());
  title = computed(() => this.recipe().title);
  description = computed(() => this.recipe().description);

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

  updateRecipe(prop: keyof Recipe, event: Event) {
    const target = event.target;
    if (
      !(target instanceof HTMLInputElement) &&
      !(target instanceof HTMLTextAreaElement)
    ) {
      return;
    }
    const title = target.value;
    if (!title?.trim()) {
      return;
    }
    this.recipeRepository.updateRecipe(this.id(), { [prop]: title });
  }

  updateIsPublished(event: Event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    this.recipeRepository.updateRecipe(this.id(), {
      isPublished: target.checked,
    });
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

  deleteIngredient(ingredientId: number) {
    this.recipeRepository.deleteIngredient(this.id(), ingredientId);
  }
}
