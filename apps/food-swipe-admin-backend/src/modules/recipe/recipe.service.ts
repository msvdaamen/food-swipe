import { DbService } from "../../common/db.service";
import { storageService, type StorageService } from "../../providers/storage/storage.service";
import {recipesSchema} from "./schema/recipe.schema.ts";
import type {RecipeModel} from "./models/recipe.model.ts";
import {files} from "../../providers/storage/file.schema.ts";
import {and, asc, eq, gt, gte, lt, lte, sql} from "drizzle-orm";
import {recipeStepSchema} from "./schema/recipe-step.schema.ts";
import {recipeIngredientsSchema} from "./schema/recipe-ingredients.schema.ts";
import type {RecipeStepModel} from "./models/recipe-step.model.ts";
import type {RecipeIngredientModel} from "./models/recipe-ingredient.model.ts";
import {ingredientsSchema} from "./../ingredient/schema/ingredient.schema.ts";
import {type MeasurementEntity, measurementsSchema} from "./../measurement/schema/measurement.schema.ts";
import type {UpdateRecipeDto} from "./dto/update-recipe.dto.ts";
import type {CreateRecipeStepDto} from "./dto/create-recipe-step.dto.ts";
import type {CreateRecipeIngredientDto} from "./dto/create-recipe-ingredient.dto.ts";
import type {UpdateRecipeStepDto} from "./dto/update-recipe-step.dto.ts";
import type {ReorderRecipeStepDto} from "./dto/reorder-recipe-step.dto.ts";
import type {UpdateRecipeIngredientDto} from "./dto/update-recipe-ingredient.dto.ts";
import type {LoadRecipesDto} from "./dto/load-recipes.dto.ts";
import {usersSchema} from "../user/schema/user.schema.ts";
import type {CreateRecipeDto} from "./dto/create-recipe.dto.ts";
import {fetchRecipeFromAh} from "./function/fetch-recipe-from-ah.ts";
import {measurementService, type MeasurementService} from "../measurement/measurement.service.ts";
import {ingredientService, type IngredientService} from "../ingredient/ingredient.service.ts";

export class RecipeService extends DbService {

    constructor(
        private readonly storage: StorageService,
        private readonly measurementService: MeasurementService,
        private readonly ingredientService: IngredientService
    ) {
        super();
    }

    async getAll(filters: LoadRecipesDto): Promise<RecipeModel[]> {
        const results = await this.database
            .select({recipe: recipesSchema, coverImage: files})
            .from(recipesSchema)
            .leftJoin(files, eq(files.id, recipesSchema.coverImageId))
            .where(filters.isPublished !== undefined ? eq(recipesSchema.isPublished, filters.isPublished) : undefined)
            .orderBy(asc(recipesSchema.title))
            .execute();

        return results.map((result) => ({
            ...result.recipe,
            coverImageUrl: result.coverImage ? this.storage.getPublicUrl(result.coverImage.filename) : null
        }));
    }

    async getById(id: number): Promise<RecipeModel> {
        const [result] = await this.database
            .select({recipe: recipesSchema, coverImage: files})
            .from(recipesSchema)
            .leftJoin(files, eq(files.id, recipesSchema.coverImageId))
            .where(eq(recipesSchema.id, id))
            .execute();

        if (!result) {
            throw new Error('Recipe not found');
        }

        return {
            ...result.recipe,
            coverImageUrl: result.coverImage ? this.storage.getPublicUrl(result.coverImage.filename) : null
        };
    }

    async create(payload: CreateRecipeDto): Promise<RecipeModel> {
        const [{id}] = await this.database.insert(recipesSchema).values(payload).returning({id: recipesSchema.id}).execute();
        return this.getById(id);
    }

    async update(recipeId: number, payload: UpdateRecipeDto): Promise<RecipeModel> {
        await this.database.update(recipesSchema).set(payload).where(eq(recipesSchema.id, recipeId)).execute();
        return this.getById(recipeId);
    }

    async uploadImage(userId: number, recipeId: number, file: File): Promise<RecipeModel> {
        const [recipe] = await this.database.select({id: recipesSchema.id, coverImageId: recipesSchema.coverImageId}).from(recipesSchema).where(eq(recipesSchema.id, recipeId)).execute();
        const oldFile = recipe.coverImageId ? await this.storage.getFile(recipe.coverImageId) : null;
        await this.transaction(async tx => {
            const {id} = await this.storage.upload(userId, file, true);
            await this.database.update(recipesSchema).set({coverImageId: id}).where(eq(recipesSchema.id, recipeId)).execute();
        });
        if (oldFile) {
            await this.storage.delete(oldFile.id);
        }
        return await this.getById(recipe.id);
    }

    async delete(recipeId: number) {
        await this.database.delete(recipesSchema).where(eq(recipesSchema.id, recipeId)).execute();
    }

    async getSteps(recipeId: number): Promise<RecipeStepModel[]> {
        const steps = await this.database.select().from(recipeStepSchema).where(eq(recipeStepSchema.recipeId, recipeId)).orderBy(asc(recipeStepSchema.stepNumber)).execute();
        return steps;
    }

    async createStep(recipeId: number, payload: CreateRecipeStepDto): Promise<RecipeStepModel> {
        return await this.transaction(async () => {
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

    async updateStep(recipeId: number, stepId: number, payload: UpdateRecipeStepDto): Promise<RecipeStepModel> {
        const [step] = await this.database.update(recipeStepSchema)
        .set(payload)
        .where(and(
            eq(recipeStepSchema.id, stepId),
            eq(recipeStepSchema.recipeId, recipeId)
        ))
        .returning();
        return step;
    }

    async deleteStep(recipeId: number, stepId: number) {
        await this.transaction(async () => {
            const [step] = await this.database.delete(recipeStepSchema).where(and(
                eq(recipeStepSchema.id, stepId),
                eq(recipeStepSchema.recipeId, recipeId),
            ))
            .returning()
            .execute();
            await this.database.update(recipeStepSchema)
                .set({stepNumber: sql`${recipeStepSchema.stepNumber} - 1`})
                .where(and(
                    eq(recipeStepSchema.recipeId, recipeId),
                    gt(recipeStepSchema.stepNumber, step.stepNumber)
                ))
                .execute();
        });
    }

    async reorderSteps(recipeId: number, stepId: number, {orderTo, orderFrom}: ReorderRecipeStepDto) {
        if (orderTo === orderFrom) {
            return this.getSteps(recipeId);
        }
        await this.transaction(async () => {
            const [step] = await this.database.select().from(recipeStepSchema).where(and(
                eq(recipeStepSchema.id, stepId),
                eq(recipeStepSchema.recipeId, recipeId)
            )).execute();
            if (!step) {
                throw new Error('Step not found');
            }
            if (orderTo < orderFrom) {
                await this.database.update(recipeStepSchema)
                    .set({stepNumber: sql`${recipeStepSchema.stepNumber} + 1`})
                    .where(and(
                        eq(recipeStepSchema.recipeId, recipeId),
                        gte(recipeStepSchema.stepNumber, orderTo),
                        lt(recipeStepSchema.stepNumber, orderFrom)
                    ))
                    .execute();
            } else {
                await this.database.update(recipeStepSchema)
                    .set({stepNumber: sql`${recipeStepSchema.stepNumber} - 1`})
                    .where(and(
                        eq(recipeStepSchema.recipeId, recipeId),
                        gt(recipeStepSchema.stepNumber, orderFrom),
                        lte(recipeStepSchema.stepNumber, orderTo)
                    ))
                    .execute();
            }
            await this.database.update(recipeStepSchema)
                .set({stepNumber: orderTo})
                .where(and(
                    eq(recipeStepSchema.id, stepId),
                    eq(recipeStepSchema.recipeId, recipeId)
                ))
                .execute();
        });
        return this.getSteps(recipeId);
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

    async getIngredient(recipeId: number, ingredientId: number): Promise<RecipeIngredientModel> {
        const [recipeIngredient] = await this.database.select({
            recipeIngredient: recipeIngredientsSchema,
            ingredient: ingredientsSchema,
            measurement: measurementsSchema
        }).from(recipeIngredientsSchema)
            .innerJoin(ingredientsSchema, eq(ingredientsSchema.id, recipeIngredientsSchema.ingredientId))
            .leftJoin(measurementsSchema, eq(measurementsSchema.id, recipeIngredientsSchema.measurementId))
            .where(and(
                eq(recipeIngredientsSchema.recipeId, recipeId),
                eq(recipeIngredientsSchema.ingredientId, ingredientId)
            ))
            .execute();
        return {
            ...recipeIngredient.recipeIngredient,
            ingredient: recipeIngredient.ingredient.name,
            measurement: recipeIngredient.measurement?.name ?? null
        };
    }

    async createIngredient(recipeId: number, payload: CreateRecipeIngredientDto): Promise<RecipeIngredientModel> {
        const [{ingredientId}] = await this.database.insert(recipeIngredientsSchema)
            .values({
                recipeId,
                ...payload
            })
            .returning({ingredientId: recipeIngredientsSchema.ingredientId});
        return await this.getIngredient(recipeId, ingredientId);
    }

    async updateIngredient(recipeId: number, ingredientId: number, payload: UpdateRecipeIngredientDto): Promise<RecipeIngredientModel> {
        const [{ingredientId: updatedIngredientId}] = await this.database.update(recipeIngredientsSchema)
            .set(payload)
            .where(and(
                eq(recipeIngredientsSchema.recipeId, recipeId),
                eq(recipeIngredientsSchema.ingredientId, ingredientId)
            ))
            .returning({ingredientId: recipeIngredientsSchema.ingredientId})
            .execute();
        return await this.getIngredient(recipeId, updatedIngredientId);
    }

    async deleteIngredient(recipeId: number, ingredientId: number) {
        await this.database.delete(recipeIngredientsSchema)
            .where(and(
                eq(recipeIngredientsSchema.recipeId, recipeId),
                eq(recipeIngredientsSchema.ingredientId, ingredientId)
            ))
            .execute();
    }

    async importRecipe(url: string) {
        // https://www.ah.nl/allerhande/recept/R-R1188160/mac-and-cheese-met-ham-en-prei
        const idPart = url.split('/').find((part) => part.startsWith('R-R'));
        if (!idPart) {
            throw new Error('Invalid URL');
        }
        const id = parseInt(idPart.split('R-R')[1], 10);
        const recipe = await fetchRecipeFromAh(id);
        if (!recipe) {
            throw new Error('Recipe not found');
        }
        const [exists] = await this.database.select().from(recipesSchema).where(eq(recipesSchema.title, recipe.title)).execute();
        if (exists) {
            throw new Error('Recipe already exists');
        }
        const imageResponse = await fetch(recipe.images[recipe.images.length - 1].url, {method: 'GET'});
        const imageBuffer = await imageResponse.blob();
        const imageFile = new File([imageBuffer], recipe.title);
        const {id: imageId} = await this.storage.upload(1, imageFile, true);

        const newRecipe = await this.create({
            title: recipe.title,
            description: recipe.description,
            calories: recipe.nutritions.energy.value,
            prepTime: recipe.cookTime,
            servings: recipe.servings.number,
            coverImageId: imageId,
        });
        for (let i = 0; i < recipe.preparation.steps.length; i++) {
            const step = recipe.preparation.steps[i];
            await this.createStep(newRecipe.id, {description: step, order: i + 1});
        }
        for (const ingredient of recipe.ingredients) {
            let measurement: MeasurementEntity | null = null;
            if (ingredient.quantityUnit.singular) {
                measurement = await this.measurementService.findByAbbreviation(ingredient.quantityUnit.singular);
                if (!measurement) {
                    measurement = await this.measurementService.create({name: ingredient.quantityUnit.singular, abbreviation: ingredient.quantityUnit.singular});
                }
            }
            let existingIngredient = await this.ingredientService.findByName(ingredient.name.singular);
            if (!existingIngredient) {
                existingIngredient = await this.ingredientService.create({name: ingredient.name.singular});
            }
            if (!existingIngredient) {
                throw new Error('Failed to create ingredient');
            }
            await this.createIngredient(newRecipe.id, {
                ingredientId: existingIngredient.id,
                measurementId: measurement ? measurement.id : null,
                amount: Math.round(ingredient.quantity),
            });
        }
        return await this.getById(newRecipe.id);
    }
}

export const recipeService = new RecipeService(storageService, measurementService, ingredientService);