import { Component, computed, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { IonContent, ModalController } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../../common/components/header/header.component';
import { RecipeBookRepository } from 'src/app/modules/recipe-book/recipe-book.repository';
import { faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { recipeBookGradients } from './gradients';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../common/components/ui/button/button.component';
import { CreateRecipeBookModalComponent } from './create-recipe-book-modal/create-recipe-book-modal.component';

@Component({
  selector: 'app-recipe-books',
  standalone: true,
  imports: [
    IonContent,
    HeaderComponent,
    FaIconComponent,
    NgClass,
    RouterLink,
    ButtonComponent,
  ],
  templateUrl: './recipe-books.component.html',
  styleUrl: './recipe-books.component.scss',
})
export default class RecipeBooksComponent {
  private readonly repository = inject(RecipeBookRepository);
  private readonly modalController = inject(ModalController);

  protected readonly recipeBookGradients = recipeBookGradients;
  protected readonly faChevronRight = faChevronRight;
  protected readonly faHeart = faHeart;
  protected readonly faPlus = faPlus;

  likedBook = computed(() => {
    const books = this.repository.entities();
    return books.find((book) => book.isLiked);
  });
  books = computed(() => {
    const books = this.repository.entities();
    return books.filter((book) => !book.isLiked);
  });

  constructor() {
    this.repository.loadAll();
  }

  getGradient = this.getGradientMemoized();

  private getGradientMemoized() {
    const idToGradient = new Map<
      number,
      (typeof this.recipeBookGradients)[number]
    >();

    return (id: number) => {
      const existingGradient = idToGradient.get(id);
      if (existingGradient) {
        return existingGradient;
      }

      // Get a consistent index based on the ID
      // Use modulo to ensure it stays within the bounds of the array
      const gradientIndex = id % this.recipeBookGradients.length;
      const gradient = this.recipeBookGradients[gradientIndex]!;

      // Cache the result
      idToGradient.set(id, gradient);

      return gradient;
    };
  }

  async openCreateBookModal() {
    const modal = await this.modalController.create({
      component: CreateRecipeBookModalComponent,
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });

    await modal.present();
  }
}
