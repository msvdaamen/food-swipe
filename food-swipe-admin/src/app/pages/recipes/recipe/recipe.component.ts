import { Component, computed, inject, input, OnInit } from '@angular/core';
import { RecipeRepository } from '../../../modules/recipes/recipe.repository';
import { JsonPipe } from '@angular/common';
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [JsonPipe, CdkDropList, CdkDrag],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
})
export default class RecipeComponent implements OnInit {
  private readonly recipeRepository = inject(RecipeRepository);

  id = input.required<number>();
  recipe = computed(() => this.recipeRepository.getRecipe(this.id())());

  ngOnInit() {
    this.recipeRepository.loadRecipe(this.id());
  }
}
