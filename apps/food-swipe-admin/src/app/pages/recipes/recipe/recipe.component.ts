import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  numberAttribute,
  signal,
  viewChild,
} from '@angular/core';
import { RecipeRepository } from '@modules/recipes/recipe.repository';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { ButtonComponent } from '../../../common/components/ui/button/button.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faPencil,
  faQuestion,
  faSpinner,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { ManageRecipeStepDialogComponent } from '@modules/recipes/components/manage-recipe-step-dialog/manage-recipe-step-dialog.component';
import { Dialog } from '@angular/cdk/dialog';
import { ManageRecipeIngredientDialogComponent } from '@modules/recipes/components/manage-recipe-ingredient-dialog/manage-recipe-ingredient-dialog.component';
import { FormInputComponent } from '../../../common/components/ui/form/form-input/form-input.component';
import { FormsModule } from '@angular/forms';
import { FormTextareaComponent } from '../../../common/components/ui/form/form-textarea/form-textarea.component';
import { Recipe } from '@modules/recipes/types/recipe.type';
import { FormCheckboxComponent } from '../../../common/components/ui/form/form-checkbox/form-checkbox.component';
import { Router } from '@angular/router';
import {
  Nutrition,
  nutritionOrder,
  nutritions,
  NutritionUnit,
  nutritionUnits,
} from '@modules/recipes/constants/nutritions';
import { RecipeNutrition } from '@modules/recipes/types/recipe-nutrition.type';
import { FormSelectComponent } from '../../../common/components/ui/form/form-select/form-select.component';

@Component({
  selector: 'app-recipe',
  imports: [
    CdkDropList,
    CdkDrag,
    ButtonComponent,
    FaIconComponent,
    FormInputComponent,
    FormsModule,
    FormTextareaComponent,
    FormCheckboxComponent,
    FormSelectComponent,
  ],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
})
export default class RecipeComponent {
  private readonly recipeRepository = inject(RecipeRepository);
  private readonly dialog = inject(Dialog);
  private readonly router = inject(Router);

  fileUploader =
    viewChild.required<ElementRef<HTMLInputElement>>('fileUploader');

  ingredients = this.recipeRepository.ingredients;
  steps = this.recipeRepository.steps;
  nutritions = computed(() => {
    const recipeId = this.id();
    const nutritions = this.recipeRepository.nutritions();
    const nutritionMap = new Map<string, RecipeNutrition>();
    for (const nutrition of nutritions) {
      nutritionMap.set(nutrition.name, nutrition);
    }
    const orderedNutritions: RecipeNutrition[] = [];
    for (const name of nutritionOrder) {
      const nutrition = nutritionMap.get(name);
      if (nutrition) {
        orderedNutritions.push(nutrition);
      } else {
        orderedNutritions.push({
          id: -1,
          recipeId,
          name,
          value: 0,
          unit: 'g',
        });
      }
    }
    return orderedNutritions;
  });

  id = input.required<number, string>({ transform: numberAttribute });
  recipe = computed(() => this.recipeRepository.getRecipe(this.id())());
  title = computed(() => this.recipe().title);
  description = computed(() => this.recipe().description);

  isLoading = this.recipeRepository.isLoading;
  isDeleting = false;
  isChangingImage = signal(false);

  protected readonly faTrash = faTrash;
  protected readonly faPencil = faPencil;

  constructor() {
    effect(() => {
      this.recipeRepository.loadRecipe(this.id());
      this.recipeRepository.loadSteps(this.id());
      this.recipeRepository.loadIngredients(this.id());
      this.recipeRepository.loadNutritions(this.id());
    });

    effect(() => {
      const isLoading = this.isLoading();
      if (this.isDeleting && !isLoading) {
        this.router.navigate(['/recipes']);
      }
    });

    effect(() => {
      const isLoading = this.isLoading();
      if (this.isChangingImage() && !isLoading) {
        this.isChangingImage.set(false);
      }
    });
  }

  updateRecipe(prop: keyof Recipe, event: Event) {
    const target = event.target;
    if (
      !(target instanceof HTMLInputElement) &&
      !(target instanceof HTMLTextAreaElement)
    ) {
      return;
    }
    const value = target.value;
    if (!value?.trim()) {
      return;
    }
    if (this.recipe()[prop] == value) {
      return;
    }
    this.recipeRepository.updateRecipe(this.id(), { [prop]: value });
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

  openFileUploader() {
    this.fileUploader().nativeElement.click();
  }

  uploadFile(event: Event) {
    const target = event.target;
    if (!target || !(target instanceof HTMLInputElement)) {
      return;
    }
    const file = target.files?.[0];
    if (!file) {
      return;
    }
    this.recipeRepository.uploadImage(this.id(), file);
    this.isChangingImage.set(true);
  }

  deleteRecipe(recipeId: number) {
    this.recipeRepository.deleteRecipe(recipeId);
    this.isDeleting = true;
  }

  updateNutritionValue(name: Nutrition, unit: NutritionUnit, event: Event) {
    if (
      !(event instanceof FocusEvent) ||
      !(event.target instanceof HTMLInputElement)
    ) {
      return;
    }
    const value = event.target.value;
    this.updateNutrition(name, unit, Number(value));
  }

  updateNutrition(name: Nutrition, unit: NutritionUnit, value: number) {
    this.recipeRepository.updateNutrition(this.id(), name, {
      value: value,
      unit,
    });
  }

  protected readonly faQuestion = faQuestion;
  protected readonly faSpinner = faSpinner;
  protected readonly nutritionUnits = nutritionUnits;
}
