import { Component, effect, inject, viewChild } from '@angular/core';
import { ButtonComponent } from '../../common/components/ui/button/button.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faClock, faEye, faPlus } from '@fortawesome/free-solid-svg-icons';
import { RecipeRepository } from '../../modules/recipe/recipe.repository';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../common/components/header/header.component';
import {
  IonContent,
  IonFab,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonToolbar,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { RecipeModalComponent } from '../../common/components/modals/recipe-modal/recipe-modal.component';
import { AuthRepository } from '../../modules/auth/auth.repository';
import { FormInputComponent } from '../../common/components/ui/form/form-input/form-input.component';

@Component({
  selector: 'app-recipes',
  imports: [
    ButtonComponent,
    FaIconComponent,
    HeaderComponent,
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonFab,
    FormInputComponent,
  ],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export default class RecipesComponent {
  private readonly recipeRepository = inject(RecipeRepository);
  private readonly modalController = inject(ModalController);
  private readonly authRepository = inject(AuthRepository);
  private readonly toastController = inject(ToastController);

  infiniteScroll = viewChild(IonInfiniteScroll);

  faEye = faEye;
  faClock = faClock;

  isAdmin = this.authRepository.isAdmin;
  recipes = this.recipeRepository.recipes;
  cursor = this.recipeRepository.cursor;

  isLoading = false;

  constructor() {
    this.recipeRepository.loadAll({ limit: 10 });

    effect(() => {
      const isLoading = this.recipeRepository.isLoading();
      if (this.isLoading && !isLoading) {
        this.infiniteScroll()?.complete();
        this.isLoading = false;
      }
    });
  }

  loadMore() {
    const cursor = this.cursor();
    if (cursor) {
      this.recipeRepository.loadAll({ limit: 5, cursor });
      this.isLoading = true;
    } else {
      this.infiniteScroll()?.complete();
    }
  }

  async viewRecipe(id: number) {
    const modal = await this.modalController.create({
      component: RecipeModalComponent,
      componentProps: { id },
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });
    modal.present();
  }

  async createRecipe() {
    const { CreateRecipeModalComponent } = await import(
      '../../common/components/modals/create-recipe-modal/create-recipe-modal.component'
    );
    const modal = await this.modalController.create({
      component: CreateRecipeModalComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      const toast = await this.toastController.create({
        message: data ? 'Recipe uploaded' : 'Error uploading recipe',
        duration: 3000,
        position: 'bottom',
        positionAnchor: 'tab-bar',
        swipeGesture: 'vertical',
      });
      toast.present();
    }
  }

  protected readonly faPlus = faPlus;
}
