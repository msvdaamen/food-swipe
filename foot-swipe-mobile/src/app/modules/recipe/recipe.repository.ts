import { inject, Injectable, signal } from "@angular/core";
import { RecipeService } from "./recipe.service";
import { Recipe } from "./types/recipe.type";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, pipe, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";

@Injectable({providedIn: 'root'})
export class RecipeRepository {
    private readonly service = inject(RecipeService);

    public readonly recipes = signal<Recipe[]>([]);
    public readonly cursor = signal<number | null>(null);
    public readonly isLoading = signal(false);

    findAll = rxMethod<{limit: number, cursor?: number}>(
        pipe(
            tap(() => this.isLoading.set(true)),
            switchMap(({limit, cursor}) => this.service.allCursor(limit, cursor).pipe(
                tapResponse({
                    next: response => {
                        this.recipes.set(response.data);
                        this.cursor.set(response.cursor);
                    },
                    error: console.error,
                    complete: () => this.isLoading.set(false)
                })
            ))
        )
    );
}