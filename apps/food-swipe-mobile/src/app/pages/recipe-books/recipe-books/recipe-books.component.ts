import { Component, computed, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../../common/components/header/header.component';
import { RecipeBookRepository } from 'src/app/modules/recipe-book/recipe-book.repository';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { recipeBookGradients } from './gradients';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recipe-books',
  standalone: true,
  imports: [IonContent, HeaderComponent, FaIconComponent, NgClass, RouterLink],
  templateUrl: './recipe-books.component.html',
  styleUrl: './recipe-books.component.scss',
})
export default class RecipeBooksComponent {
  private readonly repository = inject(RecipeBookRepository);

  protected readonly recipeBookGradients = recipeBookGradients;
  protected readonly faChevronRight = faChevronRight;
  protected readonly faHeart = faHeart;

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
}
