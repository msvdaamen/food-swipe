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
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-recipes',
  standalone: true,
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
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export default class RecipesComponent {
  private readonly recipeRepository = inject(RecipeRepository);

  infiniteScroll = viewChild(IonInfiniteScroll);

  faEye = faEye;
  faClock = faClock;

  recipes = this.recipeRepository.recipes;
  cursor = this.recipeRepository.cursor;

  isLoading = false;

  constructor() {
    this.recipeRepository.findAll({ limit: 10 });

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
      this.recipeRepository.findAll({ limit: 5, cursor });
      this.isLoading = true;
    } else {
      this.infiniteScroll()?.complete();
    }
  }
}
