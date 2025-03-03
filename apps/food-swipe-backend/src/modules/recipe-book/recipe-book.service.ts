import { recipeBooks, type RecipeBookEntity } from "@food-swipe/database";
import { DbService } from "../../common/db.service";
import type { CreateRecipeBookDto } from "./dto/create-recipe-book.dto";
import { eq, and } from "drizzle-orm";
export class RecipeBookService extends DbService {
  async getRecipeBooks(userId: number): Promise<RecipeBookEntity[]> {
    const result = await this.database
      .select()
      .from(recipeBooks)
      .where(eq(recipeBooks.userId, userId));
    return result;
  }

  async getRecipeBook(
    userId: number,
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

  async createLikedRecipeBook(
    userId: number,
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
    userId: number,
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
