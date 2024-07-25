import { eq, gt, inArray } from "drizzle-orm";
import { DbService } from "../../common/db.service";
import { recipes, type NewRecipe, type Recipe } from "./schema/recipe.schema";
import type { CursorPagination } from "../../common/types/cursor-pagination";
import { ingredients, type Ingredient } from "./schema/ingredient.schema";
import { recipeIngredients } from "./schema/recipe-ingredients.schema";
import { NotFoundError } from "../../common/errors/not-found.error";
import { measurements } from "./schema/measurement.schema";
import { recipeStep, type RecipeStep } from "./schema/recipe-step.schema";
import type { RecipeSerialized } from "./models/recipe.model";
import { storageService, type StorageService } from "../../providers/storage/storage.service";
import { files, type FileObj as FileModel } from "../../providers/storage/file.schema";

export type FullRecipe = Recipe & {
    ingredients: (Ingredient & {measurement: string | null, abbreviation: string | null, amount: number})[],
    steps: RecipeStep[]
};

export class RecipeService extends DbService {

    constructor(
        private readonly storageService: StorageService
    ) {
        super();
    }


    async allCursor(limit: number, cursor?: number): Promise<CursorPagination<RecipeSerialized>> {
        if (!cursor) {
            cursor = 0;
        }
        const result = await this.database.select({id: recipes.id}).from(recipes).where(...[gt(recipes.id, cursor)]).limit(limit).execute();
        const cursorResult = result.length === limit ? result[result.length - 1].id : null;
        const recipeModels = await this.getMany(result.map(row => row.id));
        return {
            data: recipeModels,
            cursor: cursorResult
        }
    }

    async get(id: number): Promise<RecipeSerialized> {
        const [recipe] = await this.getMany([id]);
    
        return recipe;
    }

    async getMany(ids: number[]): Promise<RecipeSerialized[]> {
        const recipeRows = await this.database.select({
            recipe: recipes,
            coverImage: files
        }).from(recipes)
        .innerJoin(files, eq(recipes.coverImageId, files.id))
        .where(inArray(recipes.id, ids))
        .execute();

        const ingredientRows = await this.database.select({
            id: ingredients.id,
            name: ingredients.name,
            measurement: measurements.name,
            abbreviation: measurements.abbreviation,
            amount: recipeIngredients.amount,
            recipeId: recipeIngredients.recipeId
        })
        .from(recipeIngredients)
        .innerJoin(ingredients, eq(recipeIngredients.ingredientId, ingredients.id))
        .leftJoin(measurements, eq(recipeIngredients.measurementId, measurements.id))
        .where(inArray(recipeIngredients.recipeId, ids))
        .execute();

        const stepRows = await this.database.select()
        .from(recipeStep)
        .where(inArray(recipeStep.recipeId, ids))
        .execute();

        const recipeMap = new Map<number, RecipeSerialized>();
        for (const recipeRow of recipeRows) {
            recipeMap.set(recipeRow.recipe.id, this.serializeRecipe(recipeRow.recipe, recipeRow.coverImage, [], []));
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

        return recipeRows.map(row => recipeMap.get(row.recipe.id)!);
    }

    async create(userId: number, payload: NewRecipe, coverImage: File): Promise<RecipeSerialized> {
        const recipe = await this.database.transaction(async (transaction) => {
            const recipe = await transaction.insert(recipes).values(payload).returning().execute().then((result) => result[0]);
            const file = await this.storageService.upload(userId, coverImage, true);
            await transaction.update(recipes).set({coverImageId: file.id}).where(eq(recipes.id, recipe.id)).execute();
            return recipe;
        });
        return this.get(recipe.id);
    }

    serializeRecipe(recipe: Recipe, coverImage: FileModel, ingredients: Ingredient[], steps: RecipeStep[]): RecipeSerialized {
        const coverImageUrl = this.storageService.getPublicUrl(coverImage.filename)
        return {
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            prepTime: recipe.prepTime,
            servings: recipe.servings,
            calories: recipe.calories,
            isPublished: recipe.isPublished,
            coverImageUrl,
            createdAt: recipe.createdAt,
            updatedAt: recipe.updatedAt,
            ingredients,
            steps
        }
    }
}

export const recipeService = new RecipeService(storageService);