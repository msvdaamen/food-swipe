import { Component, effect, inject, OnInit, viewChild } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonAvatar,
  IonTitle,
  IonIcon,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonFab,
  IonFabButton,
  IonButton,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notificationsOutline, timeOutline, eye } from 'ionicons/icons';
import RecipeViewComponent from 'src/app/common/components/recipe-view/recipe-view.component';
import { AuthRepository } from 'src/app/modules/auth/auth.repository';
import { RecipeRepository } from 'src/app/modules/recipe/recipe.repository';
import { RecipeService } from 'src/app/modules/recipe/recipe.service';
import { RecipeStore } from 'src/app/modules/recipe/recipe.store';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonAvatar,
    IonTitle,
    IonIcon,
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonFab,
    IonFabButton,
    IonButton,
  ],
})
export default class RecipesComponent {
  private modalCtrl = inject(ModalController);
  public readonly recipeStore = inject(RecipeStore);

  infiniteScroll = viewChild(IonInfiniteScroll, { read: IonInfiniteScroll });
  cursor: string | null = null;
  

  recipes = this.recipeStore.entities;

  constructor() {
    addIcons({ notificationsOutline, eye, timeOutline });
    this.recipeStore.findAll({limit: 10});
  }

  async viewRecipe(id: number) {
    const modal = await this.modalCtrl.create({
      component: RecipeViewComponent,
      componentProps: { id },
    });
    modal.present();
  }

  async createRecipe() {
    const {CreateRecipeModalComponent} = await import('../../common/components/modals/recipe/create-recipe-modal/create-recipe-modal.component');
    const modal = await this.modalCtrl.create({
      component: CreateRecipeModalComponent,
    });
    modal.present();
  }

  onIonInfinite() {
    if (!this.cursor) {
      return;
    }
    this.infiniteScroll()?.complete();
  }
}
