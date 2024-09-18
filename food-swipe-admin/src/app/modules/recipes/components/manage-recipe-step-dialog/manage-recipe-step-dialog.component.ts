import { Component, inject } from '@angular/core';
import { FormInputComponent } from '../../../../common/components/ui/form/form-input/form-input.component';
import { FormTextareaComponent } from '../../../../common/components/ui/form/form-textarea/form-textarea.component';
import { FormSelectComponent } from '../../../../common/components/ui/form/form-select/form-select.component';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { RecipeRepository } from '@modules/recipes/recipe.repository';
import { ButtonComponent } from '../../../../common/components/ui/button/button.component';
import { DialogComponent } from '../../../../common/components/dialog.component';

@Component({
  selector: 'app-manage-recipe-step-dialog',
  standalone: true,
  imports: [
    FormInputComponent,
    FormTextareaComponent,
    FormSelectComponent,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
  ],
  templateUrl: './manage-recipe-step-dialog.component.html',
  styleUrl: './manage-recipe-step-dialog.component.scss',
})
export class ManageRecipeStepDialogComponent extends DialogComponent<{
  recipeId: number;
  stepId: number;
}> {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly recipeRepository = inject(RecipeRepository);

  steps = this.recipeRepository.steps;

  form = this.createForm();

  constructor() {
    super();
    this.setOrder();
    const stepId = this.data.stepId;
    if (stepId) {
      const step = this.recipeRepository.stepEntities()[stepId];
      if (step) {
        this.form.patchValue({
          description: step.description,
          order: step.stepNumber,
        });
      }
    }
  }

  private createForm() {
    return this.fb.group({
      description: [''],
      order: [1],
    });
  }

  setOrder() {
    const steps = this.steps();
    const lastStep = steps[steps.length - 1];
    if (lastStep) {
      this.form.get('order')?.patchValue(lastStep.stepNumber + 1);
    }
  }

  submit() {
    const stepId = this.data.stepId;
    if (stepId) {
      this.update();
    } else {
      this.create();
    }
    this.close();
  }

  create() {
    const recipeId = this.data.recipeId;
    const payload = this.form.getRawValue();
    this.recipeRepository.createStep(recipeId, payload);
  }

  update() {
    const recipeId = this.data.recipeId;
    const stepId = this.data.stepId;
    const payload = this.form.getRawValue();
    if (stepId) {
      this.recipeRepository.updateStep(recipeId, stepId, payload);
    }
  }
}
