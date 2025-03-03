import { Component, computed, inject, signal } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { FormInputComponent } from '../../../../common/components/ui/form/form-input/form-input.component';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'src/app/common/components/ui/button/button.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { RecipeBookRepository } from 'src/app/modules/recipe-book/recipe-book.repository';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-create-recipe-book-modal',
  templateUrl: './create-recipe-book-modal.component.html',
  styleUrls: ['./create-recipe-book-modal.component.scss'],
  imports: [
    IonContent,
    FormInputComponent,
    FormsModule,
    ButtonComponent,
    FaIconComponent,
  ],
})
export class CreateRecipeBookModalComponent {
  private readonly repository = inject(RecipeBookRepository);
  private readonly modalController = inject(ModalController);

  protected readonly faPlus = faPlus;

  title = signal('');
  isValid = computed(() => this.title().trim().length > 0);

  addRecipeBook() {
    if (!this.isValid()) {
      return;
    }

    this.repository.create({ title: this.title() });
    this.modalController.dismiss();
  }
}
