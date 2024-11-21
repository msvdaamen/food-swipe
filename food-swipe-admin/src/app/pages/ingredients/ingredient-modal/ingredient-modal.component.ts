import { Component, computed, effect, inject } from '@angular/core';
import { ButtonComponent } from '../../../common/components/ui/button/button.component';
import { FormInputComponent } from '../../../common/components/ui/form/form-input/form-input.component';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IngredientRepository } from '../../../modules/ingredient/ingredient.repository';
import { DialogComponent } from '../../../common/components/dialog.component';

@Component({
    selector: 'app-ingredient-modal',
    imports: [
        ButtonComponent,
        FormInputComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './ingredient-modal.component.html',
    styleUrl: './ingredient-modal.component.scss'
})
export class IngredientModalComponent extends DialogComponent<{ id?: number }> {
  private readonly ingredientRepository = inject(IngredientRepository);
  private readonly fb = inject(NonNullableFormBuilder);

  ingredient = computed(() => {
    const id = this.data?.id;
    if (!id) {
      return null;
    }
    return this.ingredientRepository.get(id)();
  });

  form = this.createForm();

  constructor() {
    super();
    effect(() => {
      const ingredient = this.ingredient();
      if (ingredient) {
        this.form.patchValue(ingredient);
      }
    });
  }

  createForm() {
    return this.fb.group({
      name: this.fb.control('', {
        validators: [Validators.required],
      }),
    });
  }

  submit() {
    const ingredient = this.ingredient();
    if (ingredient) {
      this.update();
    } else {
      this.create();
    }
    this.close();
  }

  create() {
    const ingredient = this.form.getRawValue();
    this.ingredientRepository.create(ingredient);
  }

  update() {
    const ingredient = this.form.getRawValue();
    const id = this.ingredient()?.id;
    if (id) {
      this.ingredientRepository.update(id, ingredient);
    }
  }
}
