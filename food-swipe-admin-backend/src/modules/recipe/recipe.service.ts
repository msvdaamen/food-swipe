import { DbService } from "../../common/db.service";
import { storageService, type StorageService } from "../../providers/storage/storage.service";
import {recipesSchema} from "./schema/recipe.schema.ts";
import type {RecipeModel} from "./models/recipe.model.ts";
import {files} from "../../providers/storage/file.schema.ts";
import {and, eq, gte, sql} from "drizzle-orm";
import {recipeStepSchema} from "./schema/recipe-step.schema.ts";
import {recipeIngredientsSchema} from "./schema/recipe-ingredients.schema.ts";
import type {RecipeStepModel} from "./models/recipe-step.model.ts";
import type {RecipeIngredientModel} from "./models/recipe-ingredient.model.ts";
import {ingredientsSchema} from "./../ingredient/schema/ingredient.schema.ts";
import {measurementsSchema} from "./../measurement/schema/measurement.schema.ts";
import type {UpdateRecipeDto} from "./dto/update-recipe.dto.ts";
import type {CreateRecipeStepDto} from "./dto/create-recipe-step.dto.ts";
import type {CreateRecipeIngredientDto} from "./dto/create-recipe-ingredient.dto.ts";

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

    async update(recipeId: number, payload: UpdateRecipeDto): Promise<RecipeModel> {
        await this.database.update(recipesSchema).set(payload).where(eq(recipesSchema.id, recipeId)).execute();
        return this.getById(recipeId);
    }

    async getSteps(recipeId: number): Promise<RecipeStepModel[]> {
        const steps = await this.database.select().from(recipeStepSchema).where(eq(recipeStepSchema.recipeId, recipeId)).execute();
        return steps;
    }

    async createSteps(recipeId: number, payload: CreateRecipeStepDto) {
        await this.transaction(async () => {
            await this.database.update(recipeStepSchema)
                .set({stepNumber: sql`${recipeStepSchema.stepNumber} + 1`})
                .where(and(
                    eq(recipeStepSchema.recipeId, recipeId),
                    gte(recipeStepSchema.stepNumber, payload.order)
                ))
                .execute();


            const [step] = await this.database.insert(recipeStepSchema).values({
                stepNumber: payload.order,
                description: payload.description,
                recipeId
            })
            .returning()
            .execute();
            return step;
        });
    }

    async getIngredients(recipeId: number): Promise<RecipeIngredientModel[]> {
        const ingredients = await this.database.select({
            recipeIngredient: recipeIngredientsSchema,
            ingredient: ingredientsSchema,
            measurement: measurementsSchema
        }).from(recipeIngredientsSchema)
            .innerJoin(ingredientsSchema, eq(ingredientsSchema.id, recipeIngredientsSchema.ingredientId))
            .leftJoin(measurementsSchema, eq(measurementsSchema.id, recipeIngredientsSchema.measurementId))
            .where(eq(recipeIngredientsSchema.recipeId, recipeId))
            .execute();
        const models = ingredients.map((ingredient) => ({
            ...ingredient.recipeIngredient,
            ingredient: ingredient.ingredient.name,
            measurement: ingredient.measurement?.name ?? null
        }));
        return models;
    }

    async createIngredient(recipeId: number, payload: CreateRecipeIngredientDto) {
        const [recipe] = await this.database.insert(recipeIngredientsSchema)
            .values({
                recipeId,
                ...payload
            })
            .returning()
            .execute();

        return recipe;
    }


}

export const recipeService = new RecipeService(storageService);