import { Injectable } from '@angular/core';
import { Service } from '../../common/service';
import { Recipe } from './types/recipe.type';
import { RecipeStep } from './types/recipe-step.type';
import { RecipeIngredient } from './types/recipe-ingredient.type';
import { CreateRecipeStepRequest } from '@modules/recipes/requests/create-recipe-step.request';
import { CreateRecipeIngredientRequest } from '@modules/recipes/requests/create-recipe-ingredient.request';
import { UpdateRecipeStepRequest } from '@modules/recipes/requests/update-recipe-step.request';
import { ReorderRecipeStepsRequest } from '@modules/recipes/requests/reorder-recipe-steps.request';
import { UpdateRecipeIngredientRequest } from '@modules/recipes/requests/update-recipe-ingredient.request';
import { UpdateRecipeRequest } from '@modules/recipes/requests/update-recipe.request';
import { LoadRecipesRequest } from '@modules/recipes/requests/load-recipes.request';
import { HttpParams } from '@angular/common/http';
import { CreateRecipeRequest } from '@modules/recipes/requests/create-recipe.request';

@Injectable({ providedIn: 'root' })
export class RecipeService extends Service {
  getAll(payload: LoadRecipesRequest = {}) {
    const params = new HttpParams({ fromObject: payload });
    return this.http.get<Recipe[]>(`${this.api}/recipes`, { params });
  }

  getById(id: number) {
    return this.http.get<Recipe>(`${this.api}/recipes/${id}`);
  }

  createRecipe(payload: CreateRecipeRequest) {
    return this.http.post<Recipe>(`${this.api}/recipes`, payload);
  }

  updateRecipe(id: number, payload: UpdateRecipeRequest) {
    return this.http.put<Recipe>(`${this.api}/recipes/${id}`, payload);
  }

  uploadImage(id: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Recipe>(`${this.api}/recipes/${id}/image`, formData);
  }

  importRecipe(url: string) {
    return this.http.post<Recipe>(`${this.api}/recipes/import`, { url });
  }

  deleteRecipe(id: number) {
    return this.http.delete<void>(`${this.api}/recipes/${id}`);
  }

  getSteps(id: number) {
    return this.http.get<RecipeStep[]>(`${this.api}/recipes/${id}/steps`);
  }

  getIngredients(id: number) {
    return this.http.get<RecipeIngredient[]>(
      `${this.api}/recipes/${id}/ingredients`,
    );
  }

  createStep(id: number, payload: CreateRecipeStepRequest) {
    return this.http.post<RecipeStep>(
      `${this.api}/recipes/${id}/steps`,
      payload,
    );
  }

  updateStep(id: number, stepId: number, payload: UpdateRecipeStepRequest) {
    return this.http.put<RecipeStep>(
      `${this.api}/recipes/${id}/steps/${stepId}`,
      payload,
    );
  }

  deleteStep(id: number, stepId: number) {
    return this.http.delete<void>(`${this.api}/recipes/${id}/steps/${stepId}`);
  }

  reorderSteps(id: number, stepId: number, payload: ReorderRecipeStepsRequest) {
    return this.http.put<RecipeStep[]>(
      `${this.api}/recipes/${id}/steps/${stepId}/reorder`,
      payload,
    );
  }

  createIngredient(id: number, payload: CreateRecipeIngredientRequest) {
    return this.http.post<RecipeIngredient>(
      `${this.api}/recipes/${id}/ingredients`,
      payload,
    );
  }

  updateIngredient(
    id: number,
    ingredientId: number,
    payload: UpdateRecipeIngredientRequest,
  ) {
    return this.http.put<RecipeIngredient>(
      `${this.api}/recipes/${id}/ingredients/${ingredientId}`,
      payload,
    );
  }

  deleteIngredient(id: number, ingredientId: number) {
    return this.http.delete<void>(
      `${this.api}/recipes/${id}/ingredients/${ingredientId}`,
    );
  }
}
