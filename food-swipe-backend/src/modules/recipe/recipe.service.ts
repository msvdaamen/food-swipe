import {and, eq, gt, inArray} from "drizzle-orm";
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
import {userLikedRecipes} from "./schema/user-liked-recipe.schema.ts";

export class RecipeService extends DbService {

    constructor(
        private readonly storageService: StorageService
    ) {
        super();
    }


    async allCursor(userId: number, limit: number, cursor?: number, liked?: boolean): Promise<CursorPagination<RecipeSerialized>> {
        if (!cursor) {
            cursor = 0;
        }
        const builder = this.database.select({id: recipes.id}).from(recipes).where(
            and(gt(recipes.id, cursor), eq(recipes.isPublished, true))
        ).limit(limit).$dynamic();
        if (liked) {
            builder.innerJoin(userLikedRecipes, and(eq(recipes.id, userLikedRecipes.recipeId), eq(userLikedRecipes.userId, userId)));
        }
        const result = await builder.execute();
        const cursorResult = result.length === limit ? result[result.length - 1].id : null;
        const recipeModels = result.length ? await this.getMany(userId, result.map(row => row.id)) : [];
        return {
            data: recipeModels,
            cursor: cursorResult
        }
    }

    async get(userId: number, id: number): Promise<RecipeSerialized> {
        const [{id: recipeId}] = await this.database.select({id: recipes.id}).from(recipes).where(
            and(eq(recipes.id, id), eq(recipes.isPublished, true))
        ).execute();
        if (!recipeId) throw new NotFoundError();
        const [recipe] = await this.getMany(userId, [recipeId]);
    
        return recipe;
    }

    async getMany(userId: number, ids: number[]): Promise<RecipeSerialized[]> {
        const recipeRows = await this.database.select({
            recipe: recipes,
            coverImage: files,
            liked: userLikedRecipes
        }).from(recipes)
        .innerJoin(files, eq(recipes.coverImageId, files.id))
        .leftJoin(userLikedRecipes, and(eq(recipes.id, userLikedRecipes.recipeId), eq(userLikedRecipes.userId, userId)))
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
            recipeMap.set(recipeRow.recipe.id, this.serializeRecipe(recipeRow.recipe, recipeRow.coverImage, [], [], !!recipeRow.liked));
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

    async create(userId: number, payload: NewRecipe, coverImage: File): Promise<void> {
        await this.transaction(async (transaction) => {
            const recipe = await transaction.insert(recipes).values(payload).returning().execute().then((result) => result[0]);
            const file = await this.storageService.upload(userId, coverImage, true);
            await transaction.update(recipes).set({coverImageId: file.id}).where(eq(recipes.id, recipe.id)).execute();
            return recipe;
        });
    }

    async like(userId: number, recipeId: number, like: boolean) {
        if (!like) {
            await this.database.delete(userLikedRecipes).where(and(eq(userLikedRecipes.userId, userId), eq(userLikedRecipes.recipeId, recipeId))).execute();
            return this.get(userId, recipeId);
        }
        await this.database.insert(userLikedRecipes).values({userId, recipeId}).onConflictDoNothing().execute();
        return this.get(userId, recipeId);
    }

    serializeRecipe(recipe: Recipe, coverImage: FileModel, ingredients: Ingredient[], steps: RecipeStep[], liked: boolean): RecipeSerialized {
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
            liked,
            createdAt: recipe.createdAt,
            updatedAt: recipe.updatedAt,
            ingredients,
            steps
        }
    }
}

export const recipeService = new RecipeService(storageService);