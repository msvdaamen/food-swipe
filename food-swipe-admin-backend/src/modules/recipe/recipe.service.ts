import { DbService } from "../../common/db.service";
import { storageService, type StorageService } from "../../providers/storage/storage.service";
import {type RecipeEntity, recipesSchema} from "./schema/recipe.schema.ts";
import type {RecipeModel} from "./models/recipe.model.ts";
import {files} from "../../providers/storage/file.schema.ts";
import {eq} from "drizzle-orm";
import {type RecipeStepEntity, recipeStepSchema} from "./schema/recipe-step.schema.ts";
import {type RecipeIngredientEntity, recipeIngredientsSchema} from "./schema/recipe-ingredients.schema.ts";
import type {RecipeStepModel} from "./models/recipe-step.model.ts";
import type {RecipeIngredientModel} from "./models/recipe-ingredient.model.ts";
import {ingredientsSchema} from "./schema/ingredient.schema.ts";
import {measurementsSchema} from "./schema/measurement.schema.ts";

export class RecipeService extends DbService {

    constructor(
        private readonly storage: StorageService
    ) {
        super();
    }

    async getAll(): Promise<RecipeModel[]> {
        const results = await this.database
            .select({recipe: recipesSchema, coverImage: files})
            .from(recipesSchema)
            .innerJoin(files, eq(files.id, recipesSchema.coverImageId))
            .execute();

        return results.map((result) => ({
            ...result.recipe,
            coverImageUrl: this.storage.getPublicUrl(result.coverImage.filename)
        }));
    }

    async getById(id: number): Promise<RecipeModel> {
        const [result] = await this.database
            .select({recipe: recipesSchema, coverImage: files})
            .from(recipesSchema)
            .innerJoin(files, eq(files.id, recipesSchema.coverImageId))
            .where(eq(recipesSchema.id, id))
            .execute();

        if (!result) {
            throw new Error('Recipe not found');
        }

        return {
            ...result.recipe,
            coverImageUrl: this.storage.getPublicUrl(result.coverImage.filename)
        };
    }

    async getSteps(recipeId: number): Promise<RecipeStepModel[]> {
        const steps = await this.database.select().from(recipeStepSchema).execute();
        return steps;
    }

    async getIngredients(recipeId: number): Promise<RecipeIngredientModel[]> {
        const ingredients = await this.database.select({
            recipeIngredient: recipeIngredientsSchema,
            ingredient: ingredientsSchema,
            measurement: measurementsSchema
        }).from(recipeIngredientsSchema)
            .innerJoin(ingredientsSchema, eq(ingredientsSchema.id, recipeIngredientsSchema.ingredientId))
            .innerJoin(measurementsSchema, eq(measurementsSchema.id, recipeIngredientsSchema.measurementId))
            .execute();
        const models = ingredients.map((ingredient) => ({
            ...ingredient.recipeIngredient,
            ingredient: ingredient.ingredient.name,
            measurement: ingredient.measurement.name
        }));
        return models;
    }


}

export const recipeService = new RecipeService(storageService);