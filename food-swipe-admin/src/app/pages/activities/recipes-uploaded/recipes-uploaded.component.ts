import { Component, inject } from '@angular/core';
import { RecipeRepository } from '@modules/recipes/recipe.repository';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-recipes-uploaded',
    imports: [DatePipe, RouterLink],
    templateUrl: './recipes-uploaded.component.html',
    styleUrl: './recipes-uploaded.component.scss'
})
export default class RecipesUploadedComponent {
  private readonly recipeRepository = inject(RecipeRepository);

  recipes = this.recipeRepository.recipes;

  constructor() {
    this.recipeRepository.loadRecipes({ isPublished: false });
  }
}
