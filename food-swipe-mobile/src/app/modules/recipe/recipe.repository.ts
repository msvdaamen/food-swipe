import { computed, inject, Injectable, signal } from '@angular/core';
import { RecipeService } from './recipe.service';
import { Recipe } from './types/recipe.type';
import { addEntities } from '../../common/state/add-entities';
import { addEntity } from '../../common/state/add-entitiy';

@Injectable({ providedIn: 'root' })
export class RecipeRepository {
  private readonly service = inject(RecipeService);

  public readonly entities = signal(new Map<number, Recipe>());
  public readonly ids = signal<number[]>([]);
  public readonly cursor = signal<number | null>(null);
  public readonly isLoading = signal(false);
  public readonly hasLoaded = signal(false);

  recipes = computed(() => {
    const recipes: Recipe[] = [];
    for (const id of this.ids()) {
      const recipe = this.entities().get(id);
      if (recipe) {
        recipes.push(recipe);
      }
    }
    return recipes;
  });

  getRecipe(id: number) {
    return computed(() => {
      return this.entities().get(id);
    });
  }

  findAll({ limit, cursor }: { limit: number; cursor?: number | null }) {
    if (this.hasLoaded() && !cursor) {
      return;
    }
    this.isLoading.set(true);
    this.service.allCursor(limit, cursor).subscribe({
      next: (response) => {
        this.cursor.set(response.cursor);
        this.hasLoaded.set(true);
        console.time();
        const { ids, entities } = addEntities(
          this.ids(),
          this.entities(),
          response.data,
        );
        console.timeEnd();
        this.ids.set(ids);
        this.entities.set(entities);
      },
      error: console.error,
      complete: () => this.isLoading.set(false),
    });
  }

  findOne(id: number) {
    this.isLoading.set(true);
    this.service.get(id).subscribe({
      next: (recipe) => {
        const { ids, entities } = addEntity(
          this.ids(),
          this.entities(),
          recipe,
        );
        console.log(ids, entities);
        this.ids.set(ids);
        this.entities.set(entities);
      },
      error: console.error,
      complete: () => this.isLoading.set(false),
    });
  }
}
