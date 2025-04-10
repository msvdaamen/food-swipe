import { DbService } from "../../common/db.service";
import {
  storageService,
  type StorageService,
} from "../../providers/storage/storage.service";
import type { RecipeModel } from "./models/recipe.model.ts";
import {
  files,
  recipes,
  recipeIngredients,
  recipeSteps,
  recipeNutritions,
  measurements,
  ingredients,
  type MeasurementEntity,
  type RecipeNutritionEntity,
} from "@food-swipe/database";
import { and, asc, eq, gt, gte, lt, lte, sql } from "drizzle-orm";
import type { RecipeStepModel } from "./models/recipe-step.model.ts";
import type { RecipeIngredientModel } from "./models/recipe-ingredient.model.ts";
import type { UpdateRecipeDto } from "./dto/update-recipe.dto.ts";
import type { CreateRecipeStepDto } from "./dto/create-recipe-step.dto.ts";
import type { CreateRecipeIngredientDto } from "./dto/create-recipe-ingredient.dto.ts";
import type { UpdateRecipeStepDto } from "./dto/update-recipe-step.dto.ts";
import type { ReorderRecipeStepDto } from "./dto/reorder-recipe-step.dto.ts";
import type { UpdateRecipeIngredientDto } from "./dto/update-recipe-ingredient.dto.ts";
import type { LoadRecipesDto } from "./dto/load-recipes.dto.ts";
import type { CreateRecipeDto } from "./dto/create-recipe.dto.ts";
import {
  type AHRecipe,
  fetchRecipeFromAh,
} from "./function/fetch-recipe-from-ah.ts";
import {
  measurementService,
  type MeasurementService,
} from "../measurement/measurement.service.ts";
import {
  ingredientService,
  type IngredientService,
} from "../ingredient/ingredient.service.ts";
import type { CreateRecipeNutritionDto } from "./dto/create-nutrition.dto.ts";
import type { UpdateRecipeNutritionDto } from "./dto/update-nutrition.dto.ts";
import type { Nutrition } from "./constants/nutritions.ts";
import OpenAI from "openai";

export class RecipeService extends DbService {
  openai = new OpenAI();

  constructor(
    private readonly storage: StorageService,
    private readonly measurementService: MeasurementService,
    private readonly ingredientService: IngredientService
  ) {
    super();
  }

  async getAll(filters: LoadRecipesDto): Promise<RecipeModel[]> {
    const results = await this.database
      .select({ recipe: recipes, coverImage: files })
      .from(recipes)
      .leftJoin(files, eq(files.id, recipes.coverImageId))
      .where(
        filters.isPublished !== undefined
          ? eq(recipes.isPublished, filters.isPublished)
          : undefined
      )
      .orderBy(asc(recipes.title))
      .execute();

    return results.map((result) => ({
      ...result.recipe,
      coverImageUrl: result.coverImage
        ? this.storage.getPublicUrl(result.coverImage.filename)
        : null,
    }));
  }

  async getById(id: number): Promise<RecipeModel> {
    const [result] = await this.database
      .select({ recipe: recipes, coverImage: files })
      .from(recipes)
      .leftJoin(files, eq(files.id, recipes.coverImageId))
      .where(eq(recipes.id, id))
      .execute();

    if (!result) {
      throw new Error("Recipe not found");
    }

    return {
      ...result.recipe,
      coverImageUrl: result.coverImage
        ? this.storage.getPublicUrl(result.coverImage.filename)
        : null,
    };
  }

  async create(payload: CreateRecipeDto): Promise<RecipeModel> {
    const [{ id }] = await this.database
      .insert(recipes)
      .values(payload)
      .returning({ id: recipes.id })
      .execute();
    return this.getById(id);
  }

  async update(
    recipeId: number,
    payload: UpdateRecipeDto
  ): Promise<RecipeModel> {
    await this.database
      .update(recipes)
      .set(payload)
      .where(eq(recipes.id, recipeId))
      .execute();
    return this.getById(recipeId);
  }

  async uploadImage(
    userId: number,
    recipeId: number,
    file: File
  ): Promise<RecipeModel> {
    const [recipe] = await this.database
      .select({ id: recipes.id, coverImageId: recipes.coverImageId })
      .from(recipes)
      .where(eq(recipes.id, recipeId))
      .execute();
    const oldFile = recipe.coverImageId
      ? await this.storage.getFile(recipe.coverImageId)
      : null;
    await this.transaction(async (tx) => {
      const { id } = await this.storage.upload(userId, file, true);
      await this.database
        .update(recipes)
        .set({ coverImageId: id })
        .where(eq(recipes.id, recipeId))
        .execute();
    });
    if (oldFile) {
      await this.storage.delete(oldFile.id);
    }
    return await this.getById(recipe.id);
  }

  async delete(recipeId: number) {
    await this.database
      .delete(recipes)
      .where(eq(recipes.id, recipeId))
      .execute();
  }

  async getSteps(recipeId: number): Promise<RecipeStepModel[]> {
    const steps = await this.database
      .select()
      .from(recipeSteps)
      .where(eq(recipeSteps.recipeId, recipeId))
      .orderBy(asc(recipeSteps.stepNumber))
      .execute();
    return steps;
  }

  async createStep(
    recipeId: number,
    payload: CreateRecipeStepDto
  ): Promise<RecipeStepModel> {
    return await this.transaction(async () => {
      await this.database
        .update(recipeSteps)
        .set({ stepNumber: sql`${recipeSteps.stepNumber} + 1` })
        .where(
          and(
            eq(recipeSteps.recipeId, recipeId),
            gte(recipeSteps.stepNumber, payload.order)
          )
        )
        .execute();

      const [step] = await this.database
        .insert(recipeSteps)
        .values({
          stepNumber: payload.order,
          description: payload.description,
          recipeId,
        })
        .returning()
        .execute();
      return step;
    });
  }

  async updateStep(
    recipeId: number,
    stepId: number,
    payload: UpdateRecipeStepDto
  ): Promise<RecipeStepModel> {
    const [step] = await this.database
      .update(recipeSteps)
      .set(payload)
      .where(
        and(eq(recipeSteps.id, stepId), eq(recipeSteps.recipeId, recipeId))
      )
      .returning();
    return step;
  }

  async deleteStep(recipeId: number, stepId: number) {
    await this.transaction(async () => {
      const [step] = await this.database
        .delete(recipeSteps)
        .where(
          and(eq(recipeSteps.id, stepId), eq(recipeSteps.recipeId, recipeId))
        )
        .returning()
        .execute();
      await this.database
        .update(recipeSteps)
        .set({ stepNumber: sql`${recipeSteps.stepNumber} - 1` })
        .where(
          and(
            eq(recipeSteps.recipeId, recipeId),
            gt(recipeSteps.stepNumber, step.stepNumber)
          )
        )
        .execute();
    });
  }

  async reorderSteps(
    recipeId: number,
    stepId: number,
    { orderTo, orderFrom }: ReorderRecipeStepDto
  ) {
    if (orderTo === orderFrom) {
      return this.getSteps(recipeId);
    }
    await this.transaction(async () => {
      const [step] = await this.database
        .select()
        .from(recipeSteps)
        .where(
          and(eq(recipeSteps.id, stepId), eq(recipeSteps.recipeId, recipeId))
        )
        .execute();
      if (!step) {
        throw new Error("Step not found");
      }
      if (orderTo < orderFrom) {
        await this.database
          .update(recipeSteps)
          .set({ stepNumber: sql`${recipeSteps.stepNumber} + 1` })
          .where(
            and(
              eq(recipeSteps.recipeId, recipeId),
              gte(recipeSteps.stepNumber, orderTo),
              lt(recipeSteps.stepNumber, orderFrom)
            )
          )
          .execute();
      } else {
        await this.database
          .update(recipeSteps)
          .set({ stepNumber: sql`${recipeSteps.stepNumber} - 1` })
          .where(
            and(
              eq(recipeSteps.recipeId, recipeId),
              gt(recipeSteps.stepNumber, orderFrom),
              lte(recipeSteps.stepNumber, orderTo)
            )
          )
          .execute();
      }
      await this.database
        .update(recipeSteps)
        .set({ stepNumber: orderTo })
        .where(
          and(eq(recipeSteps.id, stepId), eq(recipeSteps.recipeId, recipeId))
        )
        .execute();
    });
    return this.getSteps(recipeId);
  }

  async getIngredients(recipeId: number): Promise<RecipeIngredientModel[]> {
    const result = await this.database
      .select({
        recipeIngredient: recipeIngredients,
        ingredient: ingredients,
        measurement: measurements,
      })
      .from(recipeIngredients)
      .innerJoin(
        ingredients,
        eq(ingredients.id, recipeIngredients.ingredientId)
      )
      .leftJoin(
        measurements,
        eq(measurements.id, recipeIngredients.measurementId)
      )
      .where(eq(recipeIngredients.recipeId, recipeId))
      .execute();
    const models = result.map((ingredient) => ({
      ...ingredient.recipeIngredient,
      ingredient: ingredient.ingredient.name,
      measurement: ingredient.measurement?.name ?? null,
    }));
    return models;
  }

  async getIngredient(
    recipeId: number,
    ingredientId: number
  ): Promise<RecipeIngredientModel> {
    const [recipeIngredient] = await this.database
      .select({
        recipeIngredient: recipeIngredients,
        ingredient: ingredients,
        measurement: measurements,
      })
      .from(recipeIngredients)
      .innerJoin(
        ingredients,
        eq(ingredients.id, recipeIngredients.ingredientId)
      )
      .leftJoin(
        measurements,
        eq(measurements.id, recipeIngredients.measurementId)
      )
      .where(
        and(
          eq(recipeIngredients.recipeId, recipeId),
          eq(recipeIngredients.ingredientId, ingredientId)
        )
      )
      .execute();
    return {
      ...recipeIngredient.recipeIngredient,
      ingredient: recipeIngredient.ingredient.name,
      measurement: recipeIngredient.measurement?.name ?? null,
    };
  }

  async createIngredient(
    recipeId: number,
    payload: CreateRecipeIngredientDto
  ): Promise<RecipeIngredientModel> {
    const [{ ingredientId }] = await this.database
      .insert(recipeIngredients)
      .values({
        recipeId,
        ...payload,
      })
      .returning({ ingredientId: recipeIngredients.ingredientId });
    return await this.getIngredient(recipeId, ingredientId);
  }

  async updateIngredient(
    recipeId: number,
    ingredientId: number,
    payload: UpdateRecipeIngredientDto
  ): Promise<RecipeIngredientModel> {
    const [{ ingredientId: updatedIngredientId }] = await this.database
      .update(recipeIngredients)
      .set(payload)
      .where(
        and(
          eq(recipeIngredients.recipeId, recipeId),
          eq(recipeIngredients.ingredientId, ingredientId)
        )
      )
      .returning({ ingredientId: recipeIngredients.ingredientId })
      .execute();
    return await this.getIngredient(recipeId, updatedIngredientId);
  }

  async deleteIngredient(recipeId: number, ingredientId: number) {
    await this.database
      .delete(recipeIngredients)
      .where(
        and(
          eq(recipeIngredients.recipeId, recipeId),
          eq(recipeIngredients.ingredientId, ingredientId)
        )
      )
      .execute();
  }

  async getNutrition(recipeId: number): Promise<RecipeNutritionEntity[]> {
    const nutritions = await this.database
      .select()
      .from(recipeNutritions)
      .where(eq(recipeNutritions.recipeId, recipeId))
      .orderBy(asc(recipeNutritions.name))
      .execute();
    return nutritions;
  }

  async updateNutrition(
    recipeId: number,
    name: Nutrition,
    payload: UpdateRecipeNutritionDto
  ): Promise<RecipeNutritionEntity> {
    const [nutrition] = await this.database
      .insert(recipeNutritions)
      .values({
        recipeId,
        name,
        ...payload,
      })
      .onConflictDoUpdate({
        target: [recipeNutritions.recipeId, recipeNutritions.name],
        set: payload,
      })
      .returning();
    return nutrition;
  }

  async createNutrition(
    recipeId: number,
    payload: CreateRecipeNutritionDto
  ): Promise<RecipeNutritionEntity> {
    const [nutrition] = await this.database
      .insert(recipeNutritions)
      .values({
        recipeId,
        name: payload.name,
        unit: payload.unit,
        value: payload.value,
      })
      .returning();
    return nutrition;
  }

  async createManyNutritions(
    recipeId: number,
    payload: CreateRecipeNutritionDto[]
  ) {
    const inserts = payload.map((nutrition) => ({
      recipeId,
      name: nutrition.name,
      unit: nutrition.unit,
      value: nutrition.value,
    }));
    const nutritions = await this.database
      .insert(recipeNutritions)
      .values(inserts)
      .returning();
    return nutritions;
  }

  async importRecipe(url: string) {
    const idPart = url.split("/").find((part) => part.startsWith("R-R"));
    if (!idPart) {
      throw new Error("Invalid URL");
    }
    const id = parseInt(idPart.split("R-R")[1], 10);
    const recipe = await fetchRecipeFromAh(id);
    if (!recipe) {
      throw new Error("Recipe not found");
    }
    const [exists] = await this.database
      .select()
      .from(recipes)
      .where(eq(recipes.title, recipe.title))
      .execute();
    if (exists) {
      throw new Error("Recipe already exists");
    }
    const translatedRecipe = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "developer",
          content: `Translate the following recipe to English and return it in the exact same JSON format as the original recipe. I only want the JSON, no other text: ${JSON.stringify(recipe)}`,
        },
      ],
      store: false,
    });
    const translatedRecipeContent = translatedRecipe.choices[0].message.content;
    if (!translatedRecipeContent) {
      throw new Error("Failed to translate recipe");
    }
    const jsonStartIndex = translatedRecipeContent.indexOf("{");
    const jsonEndIndex = translatedRecipeContent.lastIndexOf("}") + 1;
    const jsonString = translatedRecipeContent.substring(
      jsonStartIndex,
      jsonEndIndex
    );
    const translatedRecipeJson = JSON.parse(jsonString) as AHRecipe;
    const imageResponse = await fetch(
      recipe.images[recipe.images.length - 1].url,
      { method: "GET" }
    );
    const imageBuffer = await imageResponse.blob();
    const imageFile = new File([imageBuffer], recipe.title);
    const { id: imageId } = await this.storage.upload(1, imageFile, true);

    const newRecipe = await this.create({
      title: translatedRecipeJson.title,
      description: translatedRecipeJson.description,
      calories: translatedRecipeJson.nutritions?.energy.value || 0,
      prepTime: translatedRecipeJson.cookTime,
      servings: translatedRecipeJson.servings.number,
      coverImageId: imageId,
    });
    for (let i = 0; i < translatedRecipeJson.preparation.steps.length; i++) {
      const step = translatedRecipeJson.preparation.steps[i];
      await this.createStep(newRecipe.id, { description: step, order: i + 1 });
    }
    for (const ingredient of translatedRecipeJson.ingredients) {
      let measurement: MeasurementEntity | null = null;
      if (ingredient.quantityUnit.singular) {
        measurement = await this.measurementService.findByAbbreviation(
          ingredient.quantityUnit.singular
        );
        if (!measurement) {
          measurement = await this.measurementService.create({
            name: ingredient.quantityUnit.singular,
            abbreviation: ingredient.quantityUnit.singular,
          });
        }
      }
      let existingIngredient = await this.ingredientService.findByName(
        ingredient.name.singular
      );
      if (!existingIngredient) {
        existingIngredient = await this.ingredientService.create({
          name: ingredient.name.singular,
        });
      }
      if (!existingIngredient) {
        throw new Error("Failed to create ingredient");
      }
      await this.createIngredient(newRecipe.id, {
        ingredientId: existingIngredient.id,
        measurementId: measurement ? measurement.id : null,
        amount: Math.round(ingredient.quantity),
      });
    }
    const nutritions = [];
    for (const name in translatedRecipeJson.nutritions) {
      if (!(name in translatedRecipeJson.nutritions) || name === "__typename") {
        continue;
      }
      const nutrition =
        translatedRecipeJson.nutritions[name as keyof AHRecipe["nutritions"]];
      if (!nutrition) {
        continue;
      }
      nutritions.push({
        name: name,
        unit: nutrition.unit,
        value: nutrition.value,
      });
    }
    await this.createManyNutritions(newRecipe.id, nutritions);
    return await this.getById(newRecipe.id);
  }
}

export const recipeService = new RecipeService(
  storageService,
  measurementService,
  ingredientService
);
