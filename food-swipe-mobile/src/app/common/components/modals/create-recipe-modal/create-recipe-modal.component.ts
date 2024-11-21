import { Component, effect, inject, signal } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular/standalone';
import { RecipeRepository } from '../../../../modules/recipe/recipe.repository';
import { faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../ui/button/button.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormInputComponent } from '../../ui/form/form-input/form-input.component';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-create-recipe-modal',
    imports: [
        IonContent,
        ButtonComponent,
        FaIconComponent,
        FormInputComponent,
        FormsModule,
    ],
    templateUrl: './create-recipe-modal.component.html',
    styleUrl: './create-recipe-modal.component.scss'
})
export class CreateRecipeModalComponent {
  private readonly recipeRepository = inject(RecipeRepository);
  private readonly modalController = inject(ModalController);

  title = signal('');
  image = signal<Photo | null>(null);

  faArrowLeft = faArrowLeft;
  isLoading = signal(false);

  constructor() {
    effect(
      () => {
        const isLoading = this.recipeRepository.isLoading();
        console.log(this.recipeRepository.createRecipeError());
        if (this.isLoading() && !isLoading) {
          this.isLoading.set(false);
          this.modalController.dismiss(
            !this.recipeRepository.createRecipeError(),
            'confirm',
          );
        }
      },
      { allowSignalWrites: true },
    );
  }

  async uploadImage() {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      quality: 100,
    });
    this.image.set(photo);
  }

  async createRecipe() {
    const image = this.image();
    const title = this.title();
    if (!image || !title?.trim()) {
      return;
    }
    const webPath = image.webPath;
    if (!webPath) {
      return;
    }
    const blob = await fetch(webPath).then((r) => r.blob());
    this.recipeRepository.createRecipe({
      title,
      file: blob,
    });
    this.isLoading.set(true);
  }

  dismiss() {
    this.modalController.dismiss(null, 'dismiss');
  }

  protected readonly faSpinner = faSpinner;
}
