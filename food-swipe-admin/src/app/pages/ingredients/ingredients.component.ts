import { Component, computed, effect, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../common/components/ui/button/button.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormInputComponent } from '../../common/components/ui/form/form-input/form-input.component';
import {
  faMagnifyingGlass,
  faPencil,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { IngredientRepository } from '../../modules/ingredient/ingredient.repository';
import { Dialog } from '@angular/cdk/dialog';
import { IngredientModalComponent } from './ingredient-modal/ingredient-modal.component';
import { PaginationComponent } from '../../common/components/pagination/pagination.component';

@Component({
  selector: 'app-ingredients',
  standalone: true,
  imports: [
    ButtonComponent,
    FaIconComponent,
    FormInputComponent,
    FormsModule,
    PaginationComponent,
  ],
  templateUrl: './ingredients.component.html',
  styleUrl: './ingredients.component.scss',
})
export default class IngredientsComponent {
  private readonly ingredientRepository = inject(IngredientRepository);
  private readonly dialog = inject(Dialog);

  protected readonly faMagnifyingGlass = faMagnifyingGlass;
  protected readonly faPencil = faPencil;
  protected readonly faTrash = faTrash;

  ingredients = this.ingredientRepository.ingredients;
  search = signal('');
  sort = signal('name');
  order = signal<'asc' | 'desc'>('desc');
  page = signal(1);
  perPage = signal(10);
  totalPages = computed(() => {
    const pagination = this.ingredientRepository.pagination();
    if (!pagination) {
      return 0;
    }
    return pagination.totalPages;
  });
  constructor() {
    effect(
      () => {
        this.loadData();
      },
      { allowSignalWrites: true },
    );
  }

  pageChange(page: number) {
    this.page.set(page);
  }

  loadData() {
    this.ingredientRepository.loadAll({
      search: this.search(),
      sort: this.sort(),
      order: this.order(),
      page: this.page(),
      amount: this.perPage(),
    });
  }

  openCreateIngredientDialog() {
    this.dialog.open(IngredientModalComponent);
  }

  openUpdateIngredientDialog(id: number) {
    this.dialog.open(IngredientModalComponent, {
      data: { id },
    });
  }

  delete(id: number) {
    this.ingredientRepository.delete(id);
  }
}
