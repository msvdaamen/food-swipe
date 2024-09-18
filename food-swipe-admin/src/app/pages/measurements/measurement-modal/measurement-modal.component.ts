import { Component, computed, effect, inject } from '@angular/core';
import { ButtonComponent } from '../../../common/components/ui/button/button.component';
import { DialogComponent } from '../../../common/components/dialog.component';
import { FormInputComponent } from '../../../common/components/ui/form/form-input/form-input.component';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MeasurementRepository } from '@modules/measurement/measurement.repository';

@Component({
  selector: 'app-measurement-modal',
  standalone: true,
  imports: [ButtonComponent, FormInputComponent, ReactiveFormsModule],
  templateUrl: './measurement-modal.component.html',
  styleUrl: './measurement-modal.component.scss',
})
export class MeasurementModalComponent extends DialogComponent<{
  id?: number;
}> {
  private readonly measurementRepository = inject(MeasurementRepository);
  private readonly fb = inject(NonNullableFormBuilder);

  measurement = computed(() => {
    const id = this.data?.id;
    if (!id) {
      return null;
    }
    return this.measurementRepository.get(id)();
  });

  form = this.createForm();

  constructor() {
    super();
    effect(() => {
      const measurement = this.measurement();
      if (measurement) {
        this.form.patchValue(measurement);
      }
    });
  }

  createForm() {
    return this.fb.group({
      name: this.fb.control('', {
        validators: [Validators.required],
      }),
      abbreviation: this.fb.control('', { validators: [Validators.required] }),
    });
  }

  submit() {
    const measurement = this.measurement();
    if (measurement) {
      this.update();
    } else {
      this.create();
    }
    this.close();
  }

  create() {
    const measurement = this.form.getRawValue();
    this.measurementRepository.create(measurement);
  }

  update() {
    const measurement = this.form.getRawValue();
    const id = this.measurement()?.id;
    if (id) {
      this.measurementRepository.update(id, measurement);
    }
  }
}
