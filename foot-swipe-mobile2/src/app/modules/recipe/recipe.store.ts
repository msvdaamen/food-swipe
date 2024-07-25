import { patchState, signalStore, withState } from "@ngrx/signals";
import { addEntities, addEntity, withEntities } from "@ngrx/signals/entities";
import { FullRecipe, Recipe } from "./types/recipe.type";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { inject, Injectable } from "@angular/core";
import { RecipeService } from "./recipe.service";

type State = {
    isLoading: boolean;
    cursor: number | null;
    fullRecipe: FullRecipe | null;
}

const initialState: State = {
    isLoading: false,
    cursor: null,
    fullRecipe: null
}

@Injectable({providedIn: 'root'})
export class RecipeStore extends signalStore(withState(initialState), withEntities<Recipe>()) {
    private readonly service = inject(RecipeService);

    findAll = rxMethod<{limit: number, cursor?: number}>(
        pipe(
            tap(() => patchState(this, {isLoading: true})),
            switchMap(({limit, cursor}) => this.service.allCursor(limit, cursor).pipe(
                tapResponse({
                    next: response => {
                        patchState(this, addEntities(response.data), {cursor: response.cursor})
                    },
                    error: console.error,
                    complete: () => patchState(this, {isLoading: false})
                })
            ))
        )
    );

    loadOne = rxMethod<number>(
        pipe(
            tap(() => patchState(this, {fullRecipe: null, isLoading: true})),
            switchMap(id => this.service.get(id).pipe(
                tapResponse({
                    next: response => patchState(this, {fullRecipe: response}),
                    error: console.error,
                    complete: () => patchState(this, {isLoading: false})
                })
            ))
        )
    );

}