import { DbService } from "../../common/db.service";
import {
  storageService,
  type StorageService,
} from "../../providers/storage/storage.service";
import type { RecipeModel } from "./models/recipe.model.ts";
import {
  recipes,
  recipeIngredients,
  recipeSteps,
  recipeNutritions,
  measurements,
  ingredients,
  type MeasurementEntity,
  type RecipeNutritionEntity,
  type RecipeEntity,
} from "../../schema";
import { and, asc, eq, gt, gte, sql } from "drizzle-orm";
import type { RecipeStepModel } from "./models/recipe-step.model.ts";
import type { RecipeIngredientModel } from "./models/recipe-ingredient.model.ts";
import type { CreateRecipeStepDto } from "./dto/create-recipe-step.dto.ts";
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
import {
  RecipeBookService,
  recipeBookService,
} from "../recipe-book/recipe-book.service.ts";
import type { AuthUser } from "../auth/auth-user.ts";
import type { IWebsocketServer } from "../../lib/websocket/types.ts";
import { websocketServer } from "../../lib/websocket/server.ts";

export class RecipeService extends DbService {
  constructor(
    private readonly storage: StorageService,
    private readonly measurementService: MeasurementService,
    private readonly ingredientService: IngredientService,
    private readonly recipeBookService: RecipeBookService,
    private readonly websocketServer: IWebsocketServer,
  ) {
    super();
  }

  async getById(id: string): Promise<RecipeModel> {
    const results = await this.database
      .select({
        recipe: recipes,
        nutrition: recipeNutritions,
      })
      .from(recipes)
      .leftJoin(recipeNutritions, eq(recipeNutritions.recipeId, recipes.id))
      .where(eq(recipes.id, id))
      .execute();

    if (!results.length) {
      throw new Error("Recipe not found");
    }

    const recipesMap = this.mapRecipeToModel(results);

    return recipesMap[id];
  }

  async create(payload: CreateRecipeDto): Promise<RecipeModel> {
    const [{ id }] = await this.database
      .insert(recipes)
      .values(payload)
      .returning({ id: recipes.id })
      .execute();
    return this.getById(id);
  }

  async uploadImage(recipeId: string, file: File): Promise<RecipeModel> {
    const [recipe] = await this.database
      .select()
      .from(recipes)
      .where(eq(recipes.id, recipeId))
      .execute();
    await this.transaction(async (tx) => {
      const fileName = await this.storage.upload(file, {
        isPublic: true,
        path: "recipes",
      });
      await tx
        .update(recipes)
        .set({ coverImage: fileName })
        .where(eq(recipes.id, recipeId))
        .execute();
    });
    if (recipe.coverImage) {
      await this.storage.delete(recipe.coverImage);
    }
    return await this.getById(recipe.id);
  }

  async getSteps(recipeId: string): Promise<RecipeStepModel[]> {
    const steps = await this.database
      .select()
      .from(recipeSteps)
      .where(eq(recipeSteps.recipeId, recipeId))
      .orderBy(asc(recipeSteps.stepNumber))
      .execute();
    return steps;
  }

  async createStep(
    recipeId: string,
    payload: CreateRecipeStepDto,
  ): Promise<RecipeStepModel> {
    return await this.transaction(async () => {
      await this.database
        .update(recipeSteps)
        .set({ stepNumber: sql`${recipeSteps.stepNumber} + 1` })
        .where(
          and(
            eq(recipeSteps.recipeId, recipeId),
            gte(recipeSteps.stepNumber, payload.order),
          ),
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

  async getIngredient(
    recipeId: string,
    ingredientId: number,
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
        eq(ingredients.id, recipeIngredients.ingredientId),
      )
      .leftJoin(
        measurements,
        eq(measurements.id, recipeIngredients.measurementId),
      )
      .where(
        and(
          eq(recipeIngredients.recipeId, recipeId),
          eq(recipeIngredients.ingredientId, ingredientId),
        ),
      )
      .execute();
    return {
      ...recipeIngredient.recipeIngredient,
      ingredient: recipeIngredient.ingredient.name,
      measurement: recipeIngredient.measurement?.name ?? null,
    };
  }

  async createManyNutritions(
    recipeId: string,
    payload: CreateRecipeNutritionDto[],
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

  async importRecipe(userId: string, recipeId: string, url: string) {
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
    const openai = new OpenAI();
    this.websocketServer.send(userId, {
      type: "recipe-import-updated",
      data: {
        recipeId,
        status: "translating",
      },
    });
    const translatedRecipe = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "developer",
          content: `Translate the following recipe to English and return it in the exact same JSON format as the original recipe. I only want the JSON, no other text: ${JSON.stringify(recipe)}`,
        },
      ],
      store: false,
    });
    this.websocketServer.send(userId, {
      type: "recipe-import-updated",
      data: {
        recipeId,
        status: "translated",
      },
    });
    const translatedRecipeContent = translatedRecipe.choices[0].message.content;
    if (!translatedRecipeContent) {
      throw new Error("Failed to translate recipe");
    }
    const jsonStartIndex = translatedRecipeContent.indexOf("{");
    const jsonEndIndex = translatedRecipeContent.lastIndexOf("}") + 1;
    const jsonString = translatedRecipeContent.substring(
      jsonStartIndex,
      jsonEndIndex,
    );
    const translatedRecipeJson = JSON.parse(jsonString) as AHRecipe;
    const imageUri = translatedRecipeJson.images[0].url;
    const imageFileName = imageUri.split("/").pop()!;
    const baseImageResponse = await fetch(
      recipe.images[recipe.images.length - 1].url,
      { method: "GET" },
    );
    const baseImageBuffer = await baseImageResponse.blob();
    const baseImageFile = new File([baseImageBuffer], imageFileName);
    this.websocketServer.send(userId, {
      type: "recipe-import-updated",
      data: {
        recipeId,
        status: "generating-image",
      },
    });
    const generatedImageResponse = await openai.images.edit({
      model: "gpt-image-1",
      quality: "auto",
      prompt: `Generate an image of a ${translatedRecipeJson.title} recipe. use the input image as a reference. Only generate the actual dish. use a angled camera position as if it was taken from the side / above. Make sure the image is in a high quality and has a good resolution. so that i can use it as a cover image for the recipe`,
      image: baseImageFile,
      size: "1024x1024",
    });
    this.websocketServer.send(userId, {
      type: "recipe-import-updated",
      data: {
        recipeId,
        status: "image-generated",
      },
    });
    const imageBase64 = generatedImageResponse.data![0]?.b64_json;
    const imageBuffer = imageBase64
      ? Buffer.from(imageBase64!, "base64")
      : baseImageBuffer;
    const imageFile = new File([imageBuffer], recipe.title);
    const coverImageUrl = await this.storage.upload(imageFile, {
      isPublic: true,
      path: "recipes",
    });
    this.websocketServer.send(userId, {
      type: "recipe-import-updated",
      data: {
        recipeId,
        status: "saving",
      },
    });
    const newRecipe = await this.create({
      id: recipeId,
      title: translatedRecipeJson.title,
      description: translatedRecipeJson.description,
      calories:
        (translatedRecipeJson.nutritions.energy &&
          translatedRecipeJson.nutritions?.energy.value) ||
        0,
      prepTime: translatedRecipeJson.cookTime,
      servings: translatedRecipeJson.servings.number,
      coverImage: coverImageUrl,
    });
    for (let i = 0; i < translatedRecipeJson.preparation.steps.length; i++) {
      const step = translatedRecipeJson.preparation.steps[i];
      await this.createStep(newRecipe.id, { description: step, order: i + 1 });
    }
    for (const ingredient of translatedRecipeJson.ingredients) {
      let measurement: MeasurementEntity | null = null;
      if (ingredient.quantityUnit.singular) {
        measurement = await this.measurementService.findByAbbreviation(
          ingredient.quantityUnit.singular,
        );
        if (!measurement) {
          measurement = await this.measurementService.create({
            name: ingredient.quantityUnit.singular,
            abbreviation: ingredient.quantityUnit.singular,
          });
        }
      }
      let existingIngredient = await this.ingredientService.findByName(
        ingredient.name.singular,
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
        measurementId: measurement ? measurement.id : undefined,
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
    if (nutritions.length) {
      await this.createManyNutritions(newRecipe.id, nutritions);
    }
    this.websocketServer.send(userId, {
      type: "recipe-import-updated",
      data: {
        recipeId,
        status: "done",
      },
    });
    return await this.getById(newRecipe.id);
  }

  private mapRecipeToModel(
    results: {
      recipe: RecipeEntity;
      nutrition: RecipeNutritionEntity | null;
    }[],
  ): Record<string, RecipeModel> {
    const recipesMap: Record<string, RecipeModel> = {};
    for (const result of results) {
      const recipe: RecipeModel = recipesMap[result.recipe.id] || {
        ...result.recipe,
        coverImageUrl: result.recipe.coverImage
          ? this.storage.getPublicUrl(result.recipe.coverImage)
          : null,
        nutrition: {},
      };
      if (result.nutrition) {
        recipe.nutrition[result.nutrition.name as Nutrition] = result.nutrition;
      }
      recipesMap[result.recipe.id] = recipe;
    }
    return recipesMap;
  }
}

export const recipeService = new RecipeService(
  storageService,
  measurementService,
  ingredientService,
  recipeBookService,
  websocketServer,
);
