import { DbService } from "../../common/db.service";
import { storageService, type StorageService } from "../../providers/storage/storage.service";
import {type RecipeEntity, recipes} from "./schema/recipe.schema.ts";
import type {RecipeModel} from "./models/recipe.model.ts";
import {files} from "../../providers/storage/file.schema.ts";
import {eq} from "drizzle-orm";

export class RecipeService extends DbService {

    constructor(
        private readonly storage: StorageService
    ) {
        super();
    }

    async getAll(): Promise<RecipeModel[]> {
        const results = await this.database
            .select({recipe: recipes, coverImage: files})
            .from(recipes)
            .innerJoin(files, eq(files.id, recipes.coverImageId))
            .execute();

        return results.map((result) => ({
            ...result.recipe,
            coverImageUrl: this.storage.getPublicUrl(result.coverImage.filename)
        }));
    }

    async getById(id: number): Promise<RecipeModel> {
        const [result] = await this.database
            .select({recipe: recipes, coverImage: files})
            .from(recipes)
            .innerJoin(files, eq(files.id, recipes.coverImageId))
            .where(eq(recipes.id, id))
            .execute();

        if (!result) {
            throw new Error('Recipe not found');
        }

        return {
            ...result.recipe,
            coverImageUrl: this.storage.getPublicUrl(result.coverImage.filename)
        };
    }

}

export const recipeService = new RecipeService(storageService);