import { and, eq, gt, inArray } from "drizzle-orm";
import { DbService } from "../../common/db.service";
import type { CursorPagination } from "../../common/types/cursor-pagination";
import { NotFoundError } from "../../common/errors/not-found.error";
import type { RecipeSerialized } from "./models/recipe.model";
import {
  storageService,
  type StorageService,
} from "../../providers/storage/storage.service";
import {
  files,
  type FileObj as FileModel,
} from "../../providers/storage/file.schema";
import type { Nutrition } from "./constants/nutritions.ts";
import {
  ingredients,
  measurements,
  recipeIngredients,
  recipeNutritions,
  recipes,
  recipeSteps,
  recipesToRecipeBooks,
  type IngredientEntity,
  type NewRecipeEntity,
  type RecipeEntity,
  type RecipeStepEntity,
} from "@food-swipe/database";
import {
  recipeBookService,
  type RecipeBookService,
} from "../recipe-book/recipe-book.service.ts";

export class RecipeService extends DbService {
  constructor(
    private readonly storageService: StorageService,
    private readonly recipeBookService: RecipeBookService
  ) {
    super();
  }

  async allCursor(
    userId: number,
    limit: number,
    cursor?: number,
    liked?: boolean
  ): Promise<CursorPagination<RecipeSerialized>> {
    if (!cursor) {
      cursor = 0;
    }
    const result = await this.database
      .select({ id: recipes.id })
      .from(recipes)
      .where(and(gt(recipes.id, cursor), eq(recipes.isPublished, true)))
      .limit(limit)
      .execute();
    const cursorResult =
      result.length === limit ? result[result.length - 1].id : null;
    const recipeModels = result.length
      ? await this.getMany(
          userId,
          result.map((row) => row.id)
        )
      : [];
    return {
      data: recipeModels,
      cursor: cursorResult,
    };
  }

  async get(userId: number, id: number): Promise<RecipeSerialized> {
    const [{ id: recipeId }] = await this.database
      .select({ id: recipes.id })
      .from(recipes)
      .where(and(eq(recipes.id, id), eq(recipes.isPublished, true)))
      .execute();
    if (!recipeId) throw new NotFoundError();
    const [recipe] = await this.getMany(userId, [recipeId]);

    return recipe;
  }

  async getMany(userId: number, ids: number[]): Promise<RecipeSerialized[]> {
    const userLikedRecipeBook =
      await this.recipeBookService.getLikedRecipeBook(userId);
    const [recipeRows, ingredientRows, stepRows, nutritionRows] =
      await Promise.all([
        this.database
          .select({
            recipe: recipes,
            coverImage: files,
            liked: recipesToRecipeBooks,
          })
          .from(recipes)
          .innerJoin(files, eq(recipes.coverImageId, files.id))
          .leftJoin(
            recipesToRecipeBooks,
            and(
              eq(recipes.id, recipesToRecipeBooks.recipeId),
              eq(recipesToRecipeBooks.recipeBookId, userLikedRecipeBook.id)
            )
          )
          .where(inArray(recipes.id, ids)),

        this.database
          .select({
            id: ingredients.id,
            name: ingredients.name,
            measurement: measurements.name,
            abbreviation: measurements.abbreviation,
            amount: recipeIngredients.amount,
            recipeId: recipeIngredients.recipeId,
          })
          .from(recipeIngredients)
          .innerJoin(
            ingredients,
            eq(recipeIngredients.ingredientId, ingredients.id)
          )
          .leftJoin(
            measurements,
            eq(recipeIngredients.measurementId, measurements.id)
          )
          .where(inArray(recipeIngredients.recipeId, ids)),

        this.database
          .select()
          .from(recipeSteps)
          .where(inArray(recipeSteps.recipeId, ids))
          .orderBy(recipeSteps.stepNumber),

        this.database
          .select()
          .from(recipeNutritions)
          .where(inArray(recipeNutritions.recipeId, ids)),
      ]);

    const recipeMap = new Map<number, RecipeSerialized>();
    for (const recipeRow of recipeRows) {
      recipeMap.set(
        recipeRow.recipe.id,
        this.serializeRecipe(
          recipeRow.recipe,
          recipeRow.coverImage,
          [],
          [],
          !!recipeRow.liked
        )
      );
    }

    for (const ingredients of ingredientRows) {
      const recipe = recipeMap.get(ingredients.recipeId);
      if (recipe) {
        recipe.ingredients.push(ingredients);
      }
    }

    for (const step of stepRows) {
      const recipe = recipeMap.get(step.recipeId);
      if (recipe) {
        recipe.steps.push(step);
      }
    }

    for (const nutrition of nutritionRows) {
      const recipe = recipeMap.get(nutrition.recipeId);
      if (recipe) {
        recipe.nutritions[nutrition.name as Nutrition] = {
          name: nutrition.name,
          unit: nutrition.unit,
          value: nutrition.value,
        };
      }
    }

    return recipeRows.map((row) => recipeMap.get(row.recipe.id)!);
  }

  async create(
    userId: number,
    payload: NewRecipeEntity,
    coverImage: File
  ): Promise<void> {
    if (!coverImage.type.startsWith("image/")) {
      throw new Error("Cover image must be an image");
    }

    await this.transaction(async (transaction) => {
      const recipe = await transaction
        .insert(recipes)
        .values(payload)
        .returning()
        .execute()
        .then((result) => result[0]);
      const file = await this.storageService.upload(userId, coverImage, true);
      await transaction
        .update(recipes)
        .set({ coverImageId: file.id })
        .where(eq(recipes.id, recipe.id))
        .execute();
      return recipe;
    });
  }

  async like(userId: number, recipeId: number, like: boolean) {
    const recipeBook = await this.recipeBookService.getLikedRecipeBook(userId);
    if (!like) {
      await this.database
        .delete(recipesToRecipeBooks)
        .where(
          and(
            eq(recipesToRecipeBooks.recipeBookId, recipeBook.id),
            eq(recipesToRecipeBooks.recipeId, recipeId)
          )
        )
        .execute();
      return this.get(userId, recipeId);
    }
    await this.database
      .insert(recipesToRecipeBooks)
      .values({ recipeBookId: recipeBook.id, recipeId })
      .onConflictDoNothing()
      .execute();
    return this.get(userId, recipeId);
  }

  serializeRecipe(
    recipe: RecipeEntity,
    coverImage: FileModel,
    ingredients: IngredientEntity[],
    steps: RecipeStepEntity[],
    liked: boolean
  ): RecipeSerialized {
    const coverImageUrl = this.storageService.getPublicUrl(coverImage.filename);
    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      prepTime: recipe.prepTime,
      servings: recipe.servings,
      isPublished: recipe.isPublished,
      coverImageUrl,
      liked,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
      ingredients,
      steps,
      nutritions: {},
    };
  }
}

export const recipeService = new RecipeService(
  storageService,
  recipeBookService
);
