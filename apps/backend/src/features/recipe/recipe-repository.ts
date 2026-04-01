import { and, asc, eq, gt, gte, lt, lte, sql } from "drizzle-orm";
import { DatabaseProvider } from "../../providers/database.provider";
import {
  ingredients,
  measurements,
  RecipeEntity,
  recipeIngredients,
  recipeNutritions,
  recipes,
  RecipeStepEntity,
  recipeSteps,
  recipesToRecipeBooks,
  type RecipeNutritionEntity as RecipeNutritionEntitySchema
} from "../../schema";
import { CreateRecipeDto } from "./dto/create-recipe.dto";
import { LoadRecipesDto } from "./dto/load-recipes.dto";
import { UpdateRecipeDto } from "./dto/update-recipe.dto";
import { Nutrition } from "@food-swipe/types";
import { NotFoundError } from "../../common/errors/not-found.error";
import { v7 as uuid } from "uuid";
import { CreateRecipeStepDto } from "./dto/create-recipe-step.dto";
import { UpdateRecipeStepDto } from "./dto/update-recipe-step.dto";
import { ReorderRecipeStepDto } from "./dto/reorder-recipe-step.dto";
import { CreateRecipeIngredientDto } from "./dto/create-recipe-ingredient.dto";
import { UpdateRecipeIngredientDto } from "./dto/update-recipe-ingredient.dto";
import { UpdateRecipeNutritionDto } from "./dto/update-nutrition.dto";
import { RecipeRepository } from "./types/interfaces/recipe.repository";
import {
  RecipeIngredientModel,
  RecipeModel,
  RecipeNutritionModel,
  RecipeStepModel
} from "./types/models";

type RecipeNutritionRow = { recipe: RecipeEntity; nutrition: RecipeNutritionEntitySchema | null };

export class RecipeRepositoryImpl implements RecipeRepository {
  constructor(private readonly db: DatabaseProvider) {}

  async getAll(filters: LoadRecipesDto): Promise<RecipeModel[]> {
    const results = await this.db
      .select({
        recipe: recipes,
        nutrition: recipeNutritions
      })
      .from(recipes)
      .where(
        filters.isPublished !== undefined ? eq(recipes.isPublished, filters.isPublished) : undefined
      )
      .leftJoin(recipeNutritions, eq(recipeNutritions.recipeId, recipes.id))
      .orderBy(asc(recipes.title));
    const recipesMap = this.mapRecipeToModel(results);
    return Object.values(recipesMap);
  }

  async getById(recipeId: string): Promise<RecipeModel> {
    const results = await this.db
      .select({
        recipe: recipes,
        nutrition: recipeNutritions
      })
      .from(recipes)
      .leftJoin(recipeNutritions, eq(recipeNutritions.recipeId, recipes.id))
      .where(eq(recipes.id, recipeId));
    if (!results.length) {
      throw new NotFoundError({ id: recipeId, message: "Recipe not found" });
    }
    const recipesMap = this.mapRecipeToModel(results);
    const model = recipesMap[0];
    if (!model) {
      throw new NotFoundError({ id: recipeId, message: "Recipe not found" });
    }
    return model;
  }

  async create(payload: CreateRecipeDto): Promise<RecipeModel> {
    const id = uuid();
    await this.db.insert(recipes).values({
      id,
      title: payload.title,
      description: payload.description || null,
      prepTime: payload.prepTime,
      servings: payload.servings,
      coverImage: payload.coverImage?.trim() || null
    });
    return this.getById(id);
  }

  async update(recipeId: string, payload: UpdateRecipeDto): Promise<RecipeModel> {
    await this.db.update(recipes).set(payload).where(eq(recipes.id, recipeId));
    return this.getById(recipeId);
  }

  async delete(recipeId: string): Promise<void> {
    await this.db.delete(recipes).where(eq(recipes.id, recipeId));
  }

  getSteps(recipeId: string): Promise<RecipeStepModel[]> {
    return this.db
      .select()
      .from(recipeSteps)
      .where(eq(recipeSteps.recipeId, recipeId))
      .orderBy(asc(recipeSteps.stepNumber));
  }

  createStep(recipeId: string, payload: CreateRecipeStepDto): Promise<RecipeStepModel> {
    return this.db.transaction(async (tx) => {
      await tx
        .update(recipeSteps)
        .set({ stepNumber: sql`${recipeSteps.stepNumber} + 1` })
        .where(and(eq(recipeSteps.recipeId, recipeId), gte(recipeSteps.stepNumber, payload.order)));
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
    });
  }

  async updateStep(
    recipeId: string,
    stepId: number,
    payload: UpdateRecipeStepDto
  ): Promise<RecipeStepModel> {
    const [step] = await this.db
      .update(recipeSteps)
      .set(payload)
      .where(and(eq(recipeSteps.id, stepId), eq(recipeSteps.recipeId, recipeId)))
      .returning();
    if (!step) throw new Error("Step not found");
    return step;
  }

  async deleteStep(recipeId: string, stepId: number): Promise<void> {
    return await this.db.transaction(async (tx) => {
      const [step] = await tx
        .delete(recipeSteps)
        .where(and(eq(recipeSteps.id, stepId), eq(recipeSteps.recipeId, recipeId)))
        .returning();
      if (!step) return;
      await tx
        .update(recipeSteps)
        .set({ stepNumber: sql`${recipeSteps.stepNumber} - 1` })
        .where(
          and(eq(recipeSteps.recipeId, recipeId), gt(recipeSteps.stepNumber, step.stepNumber))
        );
    });
  }

  async reorderSteps(
    recipeId: string,
    stepId: number,
    { orderTo, orderFrom }: ReorderRecipeStepDto
  ): Promise<RecipeStepEntity[]> {
    if (orderTo === orderFrom) {
      return this.getSteps(recipeId);
    }
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
    return this.getSteps(recipeId);
  }

  async getIngredients(recipeId: string): Promise<RecipeIngredientModel[]> {
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
  }

  async getIngredient(recipeId: string, ingredientId: number): Promise<RecipeIngredientModel> {
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
  }

  async createIngredient(
    recipeId: string,
    payload: CreateRecipeIngredientDto
  ): Promise<RecipeIngredientModel> {
    const rows = await this.db
      .insert(recipeIngredients)
      .values({ recipeId, ...payload })
      .returning({ ingredientId: recipeIngredients.ingredientId });
    const [{ ingredientId }] = rows;
    if (ingredientId === undefined) throw new Error("Insert failed");
    return this.getIngredient(recipeId, ingredientId);
  }

  async updateIngredient(
    recipeId: string,
    ingredientId: number,
    payload: UpdateRecipeIngredientDto
  ): Promise<RecipeIngredientModel> {
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
    return this.getIngredient(recipeId, newId);
  }

  async deleteIngredient(recipeId: string, ingredientId: number): Promise<void> {
    await this.db
      .delete(recipeIngredients)
      .where(
        and(
          eq(recipeIngredients.recipeId, recipeId),
          eq(recipeIngredients.ingredientId, ingredientId)
        )
      );
  }

  async getNutrition(recipeId: string): Promise<RecipeNutritionModel[]> {
    return await this.db
      .select()
      .from(recipeNutritions)
      .where(eq(recipeNutritions.recipeId, recipeId))
      .orderBy(asc(recipeNutritions.name));
  }

  async updateNutrition(
    recipeId: string,
    name: Nutrition,
    payload: UpdateRecipeNutritionDto
  ): Promise<RecipeNutritionModel> {
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
  }

  async like(recipeBookId: number, recipeId: string, like: boolean): Promise<RecipeModel> {
    if (!like) {
      await this.db
        .delete(recipesToRecipeBooks)
        .where(
          and(
            eq(recipesToRecipeBooks.recipeBookId, recipeBookId),
            eq(recipesToRecipeBooks.recipeId, recipeId)
          )
        );
    } else {
      await this.db
        .insert(recipesToRecipeBooks)
        .values({ recipeBookId: recipeBookId, recipeId })
        .onConflictDoNothing();
    }
    return this.getById(recipeId);
  }

  private mapRecipeToModel(results: RecipeNutritionRow[]): RecipeModel[] {
    const recipesMap = new Map<string, RecipeModel>();
    const recipeIds: string[] = [];
    for (const result of results) {
      if (!recipesMap.has(result.recipe.id)) {
        recipeIds.push(result.recipe.id);
      }
      const recipe: RecipeModel = recipesMap.get(result.recipe.id) || {
        ...result.recipe,
        nutrition: {}
      };
      if (result.nutrition) {
        recipe.nutrition[result.nutrition.name as Nutrition] = result.nutrition;
      }
      recipesMap.set(result.recipe.id, recipe);
    }
    return recipeIds.map((id) => recipesMap.get(id)!);
  }
}
