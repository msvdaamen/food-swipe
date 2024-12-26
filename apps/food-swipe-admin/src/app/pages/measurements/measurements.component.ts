import { Component, computed, inject, signal } from '@angular/core';
import {
  faMagnifyingGlass,
  faPencil,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FormInputComponent } from '../../common/components/ui/form/form-input/form-input.component';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../common/components/ui/button/button.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MeasurementRepository } from '../../modules/measurement/measurement.repository';
import { Dialog } from '@angular/cdk/dialog';
import { MeasurementModalComponent } from './measurement-modal/measurement-modal.component';

@Component({
    selector: 'app-measurements',
    imports: [FormInputComponent, FormsModule, ButtonComponent, FaIconComponent],
    templateUrl: './measurements.component.html',
    styleUrl: './measurements.component.scss'
})
export default class MeasurementsComponent {
  private readonly measurementRepository = inject(MeasurementRepository);
  private readonly dialog = inject(Dialog);

  protected readonly faMagnifyingGlass = faMagnifyingGlass;

  search = signal('');
  measurements = computed(() => {
    const measurements = this.measurementRepository.measurements();
    const search = this.search().toLowerCase();
    return measurements.filter((measurement) =>
      measurement.name.toLowerCase().includes(search),
    );
  });

  protected readonly faPencil = faPencil;
  protected readonly faTrash = faTrash;

  constructor() {
    this.measurementRepository.loadAll();
  }

  openCreateMeasurementDialog() {
    this.dialog.open(MeasurementModalComponent);
  }

  openUpdateMeasurementDialog(id: number) {
    this.dialog.open(MeasurementModalComponent, {
      data: { id },
    });
  }

  delete(id: number) {
    this.measurementRepository.delete(id);
  }
}
