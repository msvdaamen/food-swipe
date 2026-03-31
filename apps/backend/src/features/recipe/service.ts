import { Result, UnhandledException } from "better-result";
import { DatabaseProvider } from "../../providers/database.provider";
import { StorageService } from "../../providers/storage/storage.service";
import { NotFoundError } from "../../common/errors/not-found.error";
import {
  ingredients,
  measurements,
  recipeIngredients,
  recipeNutritions,
  recipes,
  recipeSteps,
  recipesToRecipeBooks,
  type RecipeEntity,
  type RecipeNutritionEntity
} from "../../schema";
import { and, asc, eq, gt, gte, lt, lte, sql } from "drizzle-orm";
import type { RecipeModel } from "./types/recipe.model";
import type { RecipeStepModel } from "./types/recipe-step.model";
import type { RecipeIngredientModel } from "./types/recipe-ingredient.model";
import type { LoadRecipesDto } from "./dto/load-recipes.dto";
import type { CreateRecipeDto } from "./dto/create-recipe.dto";
import type { UpdateRecipeDto } from "./dto/update-recipe.dto";
import type { CreateRecipeStepDto } from "./dto/create-recipe-step.dto";
import type { UpdateRecipeStepDto } from "./dto/update-recipe-step.dto";
import type { ReorderRecipeStepDto } from "./dto/reorder-recipe-step.dto";
import type { CreateRecipeIngredientDto } from "./dto/create-recipe-ingredient.dto";
import type { UpdateRecipeIngredientDto } from "./dto/update-recipe-ingredient.dto";
import type { UpdateRecipeNutritionDto } from "./dto/update-nutrition.dto";
import type { Nutrition } from "./constants/nutritions";
import type { AuthUser } from "../auth/auth-user.type";
import type { RecipeBookService } from "../recipe-book/service";

type RecipeNutritionRow = { recipe: RecipeEntity; nutrition: RecipeNutritionEntity | null };

export class RecipeService {
  constructor(
    private readonly db: DatabaseProvider,
    private readonly storage: StorageService,
    private readonly recipeBooks: RecipeBookService
  ) {}

  private mapRecipeToModel(
    results: RecipeNutritionRow[]
  ): Record<string, RecipeModel> {
    const recipesMap: Record<string, RecipeModel> = {};
    for (const result of results) {
      const recipe: RecipeModel = recipesMap[result.recipe.id] || {
        ...result.recipe,
        coverImageUrl: result.recipe.coverImage
          ? this.storage.getPublicUrl(result.recipe.coverImage)
          : null,
        nutrition: {}
      };
      if (result.nutrition) {
        recipe.nutrition[result.nutrition.name as Nutrition] = result.nutrition;
      }
      recipesMap[result.recipe.id] = recipe;
    }
    return recipesMap;
  }

  getAll(
    user: AuthUser,
    filters: LoadRecipesDto
  ): Promise<Result<RecipeModel[], UnhandledException>> {
    return Result.tryPromise(async () => {
      const f = { ...filters };
      if (user.role !== "admin") {
        f.isPublished = true;
      }
      const results = await this.db
        .select({
          recipe: recipes,
          nutrition: recipeNutritions
        })
        .from(recipes)
        .where(
          f.isPublished !== undefined ? eq(recipes.isPublished, f.isPublished) : undefined
        )
        .leftJoin(recipeNutritions, eq(recipeNutritions.recipeId, recipes.id))
        .orderBy(asc(recipes.title));
      const recipesMap = this.mapRecipeToModel(results);
      return Object.values(recipesMap);
    });
  }

  getById(recipeId: string): Promise<Result<RecipeModel, NotFoundError | UnhandledException>> {
    return Result.gen(
      async function* (this: RecipeService) {
        const results = yield* Result.await(
          Result.tryPromise(() =>
            this.db
              .select({
                recipe: recipes,
                nutrition: recipeNutritions
              })
              .from(recipes)
              .leftJoin(recipeNutritions, eq(recipeNutritions.recipeId, recipes.id))
              .where(eq(recipes.id, recipeId))
          )
        );
        if (!results.length) {
          return Result.err(new NotFoundError({ id: recipeId, message: "Recipe not found" }));
        }
        const recipesMap = this.mapRecipeToModel(results);
        const model = recipesMap[recipeId];
        if (!model) {
          return Result.err(new NotFoundError({ id: recipeId, message: "Recipe not found" }));
        }
        return Result.ok(model);
      }.bind(this)
    );
  }

  async create(
    payload: CreateRecipeDto
  ): Promise<Result<RecipeModel, NotFoundError | UnhandledException>> {
    const ins = await Result.tryPromise(() =>
      this.db.insert(recipes).values({
        id: payload.id,
        title: payload.title,
        description: payload.description || null,
        prepTime: payload.prepTime,
        servings: payload.servings,
        coverImage: payload.coverImage?.trim() || null
      })
    );
    if (ins.isErr()) return ins;
    return this.getById(payload.id);
  }

  async update(
    recipeId: string,
    payload: UpdateRecipeDto
  ): Promise<Result<RecipeModel, NotFoundError | UnhandledException>> {
    const u = await Result.tryPromise(() =>
      this.db.update(recipes).set(payload).where(eq(recipes.id, recipeId))
    );
    if (u.isErr()) return u;
    return this.getById(recipeId);
  }

  async uploadImage(
    recipeId: string,
    file: File
  ): Promise<Result<RecipeModel, NotFoundError | UnhandledException>> {
    const existing = await Result.tryPromise(() =>
      this.db.select().from(recipes).where(eq(recipes.id, recipeId))
    );
    if (existing.isErr()) return existing;
    const [recipe] = existing.value;
    if (!recipe) {
      return Result.err(new NotFoundError({ id: recipeId, message: "Recipe not found" }));
    }

    const uploaded = await this.storage.upload(file, { isPublic: true, path: "recipes" });
    if (uploaded.isErr()) return uploaded;

    const upd = await Result.tryPromise(() =>
      this.db
        .update(recipes)
        .set({ coverImage: uploaded.value })
        .where(eq(recipes.id, recipeId))
    );
    if (upd.isErr()) return upd;

    if (recipe.coverImage) {
      const delOld = await this.storage.delete(recipe.coverImage, { isPublic: true });
      if (delOld.isErr()) return delOld;
    }

    return this.getById(recipe.id);
  }

  delete(recipeId: string): Promise<Result<void, UnhandledException>> {
    return Result.tryPromise(async () => {
      await this.db.delete(recipes).where(eq(recipes.id, recipeId));
    });
  }

  getSteps(recipeId: string): Promise<Result<RecipeStepModel[], UnhandledException>> {
    return Result.tryPromise(() =>
      this.db
        .select()
        .from(recipeSteps)
        .where(eq(recipeSteps.recipeId, recipeId))
        .orderBy(asc(recipeSteps.stepNumber))
    );
  }

  createStep(
    recipeId: string,
    payload: CreateRecipeStepDto
  ): Promise<Result<RecipeStepModel, UnhandledException>> {
    return Result.tryPromise(() =>
      this.db.transaction(async (tx) => {
        await tx
          .update(recipeSteps)
          .set({ stepNumber: sql`${recipeSteps.stepNumber} + 1` })
          .where(
            and(
              eq(recipeSteps.recipeId, recipeId),
              gte(recipeSteps.stepNumber, payload.order)
            )
          );
        const [step] = await tx
          .insert(recipeSteps)
          .values({
            stepNumber: payload.order,
            description: payload.description,
            recipeId
          })
          .returning();
        if (!step) throw new Error("Step insert failed");
        return step;
      })
    );
  }

  updateStep(
    recipeId: string,
    stepId: number,
    payload: UpdateRecipeStepDto
  ): Promise<Result<RecipeStepModel, UnhandledException>> {
    return Result.tryPromise(async () => {
      const [step] = await this.db
        .update(recipeSteps)
        .set(payload)
        .where(and(eq(recipeSteps.id, stepId), eq(recipeSteps.recipeId, recipeId)))
        .returning();
      if (!step) throw new Error("Step not found");
      return step;
    });
  }

  deleteStep(recipeId: string, stepId: number): Promise<Result<void, UnhandledException>> {
    return Result.tryPromise(() =>
      this.db.transaction(async (tx) => {
        const [step] = await tx
          .delete(recipeSteps)
          .where(and(eq(recipeSteps.id, stepId), eq(recipeSteps.recipeId, recipeId)))
          .returning();
        if (!step) return;
        await tx
          .update(recipeSteps)
          .set({ stepNumber: sql`${recipeSteps.stepNumber} - 1` })
          .where(
            and(
              eq(recipeSteps.recipeId, recipeId),
              gt(recipeSteps.stepNumber, step.stepNumber)
            )
          );
      })
    );
  }

  reorderSteps(
    recipeId: string,
    stepId: number,
    { orderTo, orderFrom }: ReorderRecipeStepDto
  ): Promise<Result<RecipeStepModel[], UnhandledException>> {
    if (orderTo === orderFrom) {
      return this.getSteps(recipeId);
    }
    return Result.tryPromise(async () => {
      await this.db.transaction(async (tx) => {
        const [step] = await tx
          .select()
          .from(recipeSteps)
          .where(and(eq(recipeSteps.id, stepId), eq(recipeSteps.recipeId, recipeId)));
        if (!step) throw new Error("Step not found");
        if (orderTo < orderFrom) {
          await tx
            .update(recipeSteps)
            .set({ stepNumber: sql`${recipeSteps.stepNumber} + 1` })
            .where(
              and(
                eq(recipeSteps.recipeId, recipeId),
                gte(recipeSteps.stepNumber, orderTo),
                lt(recipeSteps.stepNumber, orderFrom)
              )
            );
        } else {
          await tx
            .update(recipeSteps)
            .set({ stepNumber: sql`${recipeSteps.stepNumber} - 1` })
            .where(
              and(
                eq(recipeSteps.recipeId, recipeId),
                gt(recipeSteps.stepNumber, orderFrom),
                lte(recipeSteps.stepNumber, orderTo)
              )
            );
        }
        await tx
          .update(recipeSteps)
          .set({ stepNumber: orderTo })
          .where(and(eq(recipeSteps.id, stepId), eq(recipeSteps.recipeId, recipeId)));
      });
      const stepsResult = await this.getSteps(recipeId);
      if (stepsResult.isErr()) throw stepsResult.error;
      return stepsResult.value;
    });
  }

  getIngredients(
    recipeId: string
  ): Promise<Result<RecipeIngredientModel[], UnhandledException>> {
    return Result.tryPromise(async () => {
      const result = await this.db
        .select({
          recipeIngredient: recipeIngredients,
          ingredient: ingredients,
          measurement: measurements
        })
        .from(recipeIngredients)
        .innerJoin(ingredients, eq(ingredients.id, recipeIngredients.ingredientId))
        .leftJoin(measurements, eq(measurements.id, recipeIngredients.measurementId))
        .where(eq(recipeIngredients.recipeId, recipeId));
      return result.map((row) => ({
        ...row.recipeIngredient,
        ingredient: row.ingredient.name,
        measurement: row.measurement?.name ?? null
      }));
    });
  }

  getIngredient(
    recipeId: string,
    ingredientId: number
  ): Promise<Result<RecipeIngredientModel, UnhandledException>> {
    return Result.tryPromise(async () => {
      const [row] = await this.db
        .select({
          recipeIngredient: recipeIngredients,
          ingredient: ingredients,
          measurement: measurements
        })
        .from(recipeIngredients)
        .innerJoin(ingredients, eq(ingredients.id, recipeIngredients.ingredientId))
        .leftJoin(measurements, eq(measurements.id, recipeIngredients.measurementId))
        .where(
          and(
            eq(recipeIngredients.recipeId, recipeId),
            eq(recipeIngredients.ingredientId, ingredientId)
          )
        );
      if (!row) throw new Error("Ingredient row not found");
      return {
        ...row.recipeIngredient,
        ingredient: row.ingredient.name,
        measurement: row.measurement?.name ?? null
      };
    });
  }

  async createIngredient(
    recipeId: string,
    payload: CreateRecipeIngredientDto
  ): Promise<Result<RecipeIngredientModel, UnhandledException>> {
    const ins = await Result.tryPromise(async () => {
      const rows = await this.db
        .insert(recipeIngredients)
        .values({ recipeId, ...payload })
        .returning({ ingredientId: recipeIngredients.ingredientId });
      const [{ ingredientId }] = rows;
      if (ingredientId === undefined) throw new Error("Insert failed");
      return ingredientId;
    });
    if (ins.isErr()) return ins;
    return this.getIngredient(recipeId, ins.value);
  }

  async updateIngredient(
    recipeId: string,
    ingredientId: number,
    payload: UpdateRecipeIngredientDto
  ): Promise<Result<RecipeIngredientModel, UnhandledException>> {
    const upd = await Result.tryPromise(async () => {
      const rows = await this.db
        .update(recipeIngredients)
        .set(payload)
        .where(
          and(
            eq(recipeIngredients.recipeId, recipeId),
            eq(recipeIngredients.ingredientId, ingredientId)
          )
        )
        .returning({ ingredientId: recipeIngredients.ingredientId });
      const [{ ingredientId: newId }] = rows;
      if (newId === undefined) throw new Error("Update failed");
      return newId;
    });
    if (upd.isErr()) return upd;
    return this.getIngredient(recipeId, upd.value);
  }

  deleteIngredient(
    recipeId: string,
    ingredientId: number
  ): Promise<Result<void, UnhandledException>> {
    return Result.tryPromise(async () => {
      await this.db
        .delete(recipeIngredients)
        .where(
          and(
            eq(recipeIngredients.recipeId, recipeId),
            eq(recipeIngredients.ingredientId, ingredientId)
          )
        );
    });
  }

  getNutrition(recipeId: string): Promise<Result<RecipeNutritionEntity[], UnhandledException>> {
    return Result.tryPromise(() =>
      this.db
        .select()
        .from(recipeNutritions)
        .where(eq(recipeNutritions.recipeId, recipeId))
        .orderBy(asc(recipeNutritions.name))
    );
  }

  updateNutrition(
    recipeId: string,
    name: Nutrition,
    payload: UpdateRecipeNutritionDto
  ): Promise<Result<RecipeNutritionEntity, UnhandledException>> {
    return Result.tryPromise(async () => {
      const [nutrition] = await this.db
        .insert(recipeNutritions)
        .values({ recipeId, name, ...payload })
        .onConflictDoUpdate({
          target: [recipeNutritions.recipeId, recipeNutritions.name],
          set: payload
        })
        .returning();
      if (!nutrition) throw new Error("Nutrition upsert failed");
      return nutrition;
    });
  }

  async like(
    userId: string,
    recipeId: string,
    like: boolean
  ): Promise<Result<RecipeModel, NotFoundError | UnhandledException>> {
    const bookResult = await this.recipeBooks.getLikedRecipeBook(userId);
    if (bookResult.isErr()) return bookResult;
    const recipeBook = bookResult.value;
    if (!like) {
      const del = await Result.tryPromise(() =>
        this.db
          .delete(recipesToRecipeBooks)
          .where(
            and(
              eq(recipesToRecipeBooks.recipeBookId, recipeBook.id),
              eq(recipesToRecipeBooks.recipeId, recipeId)
            )
          )
      );
      if (del.isErr()) return del;
    } else {
      const ins = await Result.tryPromise(() =>
        this.db
          .insert(recipesToRecipeBooks)
          .values({ recipeBookId: recipeBook.id, recipeId })
          .onConflictDoNothing()
      );
      if (ins.isErr()) return ins;
    }
    return this.getById(recipeId);
  }
}

export function createRecipeService(
  db: DatabaseProvider,
  storage: StorageService,
  recipeBooks: RecipeBookService
): RecipeService {
  return new RecipeService(db, storage, recipeBooks);
}
