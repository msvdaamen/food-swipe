import { DatabaseProvider } from "../../providers/database.provider";
import { StorageService } from "../../providers/storage/storage.service";
import { NotFoundError } from "../../common/errors/not-found.error";
import type { LoadRecipesDto } from "./dto/load-recipes.dto";
import type { CreateRecipeDto } from "./dto/create-recipe.dto";
import type { UpdateRecipeDto } from "./dto/update-recipe.dto";
import type { CreateRecipeStepDto } from "./dto/create-recipe-step.dto";
import type { UpdateRecipeStepDto } from "./dto/update-recipe-step.dto";
import type { ReorderRecipeStepDto } from "./dto/reorder-recipe-step.dto";
import type { CreateRecipeIngredientDto } from "./dto/create-recipe-ingredient.dto";
import type { UpdateRecipeIngredientDto } from "./dto/update-recipe-ingredient.dto";
import type { UpdateRecipeNutritionDto } from "./dto/update-nutrition.dto";
import type { AuthUser } from "../auth/auth-user.type";
import { RecipeRepositoryImpl } from "./recipe-repository";
import type { RecipeService } from "./types/interfaces/recipe.service";
import { RecipeRepository } from "./types/interfaces/recipe.repository";
import {
  Recipe,
  RecipeIngredient,
  RecipeNutrition,
  RecipeStep,
  Nutrition
} from "@food-swipe/types";
import { RecipeModel } from "./types/models";
import { RecipeBookService } from "../recipe-book/types/interfaces/recipe-book.service";

class RecipeServiceImpl implements RecipeService {
  constructor(
    private readonly repository: RecipeRepository,
    private readonly storage: StorageService,
    private readonly recipeBooks: RecipeBookService
  ) {}

  async getAll(user: AuthUser, filters: LoadRecipesDto): Promise<Recipe[]> {
    const f = { ...filters };
    if (user.role !== "admin") {
      f.isPublished = true;
    }
    const recipeEntities = await this.repository.getAll(f);
    return this.mapFromModels(recipeEntities);
  }

  async getById(recipeId: string): Promise<Recipe> {
    const entity = await this.repository.getById(recipeId);
    return this.mapFromModel(entity);
  }

  async create(payload: CreateRecipeDto): Promise<Recipe> {
    const entity = await this.repository.create(payload);
    return this.mapFromModel(entity);
  }

  async update(recipeId: string, payload: UpdateRecipeDto): Promise<Recipe> {
    const entity = await this.repository.update(recipeId, payload);
    return this.mapFromModel(entity);
  }

  async uploadImage(recipeId: string, file: File): Promise<Recipe> {
    const recipe = await this.repository.getById(recipeId);
    if (!recipe) {
      throw new NotFoundError({ id: recipeId, message: "Recipe not found" });
    }

    const coverKey = await this.storage.upload(file, { isPublic: true, path: "recipes" });

    const updated = await this.repository.update(recipeId, { coverImage: coverKey });

    if (recipe.coverImage) {
      await this.storage.delete(recipe.coverImage, { isPublic: true });
    }

    return this.mapFromModel(updated);
  }

  async delete(recipeId: string): Promise<void> {
    await this.repository.delete(recipeId);
  }

  getSteps(recipeId: string): Promise<RecipeStep[]> {
    return this.repository.getSteps(recipeId);
  }

  createStep(recipeId: string, payload: CreateRecipeStepDto): Promise<RecipeStep> {
    return this.repository.createStep(recipeId, payload);
  }

  async updateStep(
    recipeId: string,
    stepId: number,
    payload: UpdateRecipeStepDto
  ): Promise<RecipeStep> {
    return await this.repository.updateStep(recipeId, stepId, payload);
  }

  async deleteStep(recipeId: string, stepId: number): Promise<void> {
    return await this.repository.deleteStep(recipeId, stepId);
  }

  async reorderSteps(
    recipeId: string,
    stepId: number,
    { orderTo, orderFrom }: ReorderRecipeStepDto
  ): Promise<RecipeStep[]> {
    if (orderTo === orderFrom) {
      return this.getSteps(recipeId);
    }
    return await this.repository.reorderSteps(recipeId, stepId, { orderTo, orderFrom });
  }

  async getIngredients(recipeId: string): Promise<RecipeIngredient[]> {
    return await this.repository.getIngredients(recipeId);
  }

  async getIngredient(recipeId: string, ingredientId: number): Promise<RecipeIngredient> {
    return await this.repository.getIngredient(recipeId, ingredientId);
  }

  async createIngredient(
    recipeId: string,
    payload: CreateRecipeIngredientDto
  ): Promise<RecipeIngredient> {
    return await this.repository.createIngredient(recipeId, payload);
  }

  async updateIngredient(
    recipeId: string,
    ingredientId: number,
    payload: UpdateRecipeIngredientDto
  ): Promise<RecipeIngredient> {
    return await this.repository.updateIngredient(recipeId, ingredientId, payload);
  }

  async deleteIngredient(recipeId: string, ingredientId: number): Promise<void> {
    await this.repository.deleteIngredient(recipeId, ingredientId);
  }

  async getNutrition(recipeId: string): Promise<RecipeNutrition[]> {
    return await this.repository.getNutrition(recipeId);
  }

  async updateNutrition(
    recipeId: string,
    name: Nutrition,
    payload: UpdateRecipeNutritionDto
  ): Promise<RecipeNutrition> {
    return await this.repository.updateNutrition(recipeId, name, payload);
  }

  async like(userId: string, recipeId: string, like: boolean): Promise<Recipe> {
    const recipeBook = await this.recipeBooks.getLikedRecipeBook(userId);
    const model = await this.repository.like(recipeBook.id, recipeId, like);
    return this.mapFromModel(model);
  }

  private mapFromModel(model: RecipeModel): Recipe {
    return {
      ...model,
      createdAt: model.createdAt.toISOString(),
      updatedAt: model.updatedAt.toISOString(),
      coverImageUrl: model.coverImage ? this.storage.getPublicUrl(model.coverImage) : null
    };
  }

  private mapFromModels(models: RecipeModel[]): Recipe[] {
    return models.map((model) => this.mapFromModel(model));
  }
}

export function createRecipeService(
  db: DatabaseProvider,
  storage: StorageService,
  recipeBooks: RecipeBookService
): RecipeService {
  const repository = new RecipeRepositoryImpl(db);
  return new RecipeServiceImpl(repository, storage, recipeBooks);
}
