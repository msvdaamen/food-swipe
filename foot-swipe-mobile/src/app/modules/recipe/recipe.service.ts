import { Injectable } from "@angular/core";
import { Params } from "@angular/router";
import { Service } from "src/app/common/service";
import { FullRecipe, Recipe } from "./types/recipe.type";
import { CursorPagination } from "src/app/common/types/cursor-pagination";


@Injectable({providedIn: 'root'})
export class RecipeService extends Service {

    allCursor(limit: number, cursor?: number) {
        const params: Params = {
            limit: limit.toString()
        };
        if (cursor) {
            params['cursor'] = cursor.toString();
        }
        return this.http.get<CursorPagination<Recipe>>(`${this.api}/recipes`, {
            params
        });
    }

    get(id: number) {
        return this.http.get<FullRecipe>(`${this.api}/recipes/${id}`);
    }
}