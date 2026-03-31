import { DbService } from "../../common/db.service";
import { recipeBooks, type RecipeBookEntity } from "../../schema";
import type { CreateRecipeBookDto } from "./dto/create-recipe-book.dto";
import { eq, and } from "drizzle-orm";
export class RecipeBookService extends DbService {
  async getRecipeBooks(userId: string): Promise<RecipeBookEntity[]> {
    const result = await this.database
      .select()
      .from(recipeBooks)
      .where(eq(recipeBooks.userId, userId));
    return result;
  }

  async getRecipeBook(
    userId: string,
    recipeBookId: number
  ): Promise<RecipeBookEntity> {
    const [result] = await this.database
      .select()
      .from(recipeBooks)
      .where(
        and(eq(recipeBooks.id, recipeBookId), eq(recipeBooks.userId, userId))
      );
    return result;
  }

  async getLikedRecipeBook(userId: string): Promise<RecipeBookEntity> {
    const [result] = await this.database
      .select()
      .from(recipeBooks)
      .where(
        and(eq(recipeBooks.isLiked, true), eq(recipeBooks.userId, userId))
      );
    if (!result) {
      throw new Error(`No liked recipe book found for user ${userId}`);
    }
    return result;
  }

  async createLikedRecipeBook(
    userId: string,
    payload: CreateRecipeBookDto
  ): Promise<RecipeBookEntity> {
    const [result] = await this.database
      .insert(recipeBooks)
      .values({
        ...payload,
        isLiked: true,
        userId,
      })
      .returning();
    return result;
  }

  async createRecipeBook(
    userId: string,
    payload: CreateRecipeBookDto
  ): Promise<RecipeBookEntity> {
    const [result] = await this.database
      .insert(recipeBooks)
      .values({
        ...payload,
        userId,
      })
      .returning();
    return result;
  }
}

export const recipeBookService = new RecipeBookService();
