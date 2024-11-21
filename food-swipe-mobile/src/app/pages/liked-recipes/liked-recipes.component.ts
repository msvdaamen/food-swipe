import { Component, effect, inject, viewChild } from '@angular/core';
import { ButtonComponent } from '../../common/components/ui/button/button.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faClock, faEye } from '@fortawesome/free-solid-svg-icons';
import { RecipeRepository } from '../../modules/recipe/recipe.repository';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../common/components/header/header.component';
import {
  IonContent,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { RecipeModalComponent } from '../../common/components/modals/recipe-modal/recipe-modal.component';

@Component({
    selector: 'app-liked-recipes',
    imports: [
        ButtonComponent,
        FaIconComponent,
        CdkScrollable,
        RouterLink,
        HeaderComponent,
        IonContent,
        IonInfiniteScroll,
        IonInfiniteScrollContent,
        IonHeader,
        IonToolbar,
    ],
    templateUrl: './liked-recipes.component.html',
    styleUrl: './liked-recipes.component.scss'
})
export default class LikedRecipesComponent {
  private readonly recipeRepository = inject(RecipeRepository);
  private readonly modalController = inject(ModalController);

  infiniteScroll = viewChild(IonInfiniteScroll);

  faEye = faEye;
  faClock = faClock;

  recipes = this.recipeRepository.likedRecipes;
  cursor = this.recipeRepository.cursorLikedRecipes;

  isLoading = false;

  constructor() {
    this.recipeRepository.loadLikedRecipes({ limit: 10 });

    effect(
      () => {
        const isLoading = this.recipeRepository.isLoading();
        if (this.isLoading && !isLoading) {
          this.infiniteScroll()?.complete();
          this.isLoading = false;
        }
      },
      { allowSignalWrites: true },
    );
  }

  loadMore() {
    const cursor = this.cursor();
    if (cursor) {
      this.recipeRepository.loadLikedRecipes({ limit: 5, cursor });
      this.isLoading = true;
    } else {
      this.infiniteScroll()?.complete();
    }
  }

  async viewRecipe(id: number) {
    const modal = await this.modalController.create({
      component: RecipeModalComponent,
      componentProps: { id },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
  }
}
