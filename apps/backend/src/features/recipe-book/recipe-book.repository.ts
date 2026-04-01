import { DatabaseProvider } from "../../providers/database.provider";
import { recipeBooks } from "../../schema";
import { NotFoundError } from "../../common/errors/not-found.error";
import { and, eq } from "drizzle-orm";
import type { CreateRecipeBookDto } from "./dto/create-recipe-book.dto";
import { RecipeBookRepository } from "./types/interfaces/recipe-book.repository";
import { RecipeBookModel } from "./types/models";

class RecipeBookRepositoryImpl implements RecipeBookRepository {
  constructor(private readonly db: DatabaseProvider) {}

  async getRecipeBooks(userId: string): Promise<RecipeBookModel[]> {
    return await this.db.select().from(recipeBooks).where(eq(recipeBooks.userId, userId));
  }

  async getRecipeBook(userId: string, recipeBookId: number): Promise<RecipeBookModel> {
    const [row] = await this.db
      .select()
      .from(recipeBooks)
      .where(and(eq(recipeBooks.id, recipeBookId), eq(recipeBooks.userId, userId)));
    if (!row) {
      throw new NotFoundError({
        id: String(recipeBookId),
        message: "Recipe book not found"
      });
    }
    return row;
  }

  async getLikedRecipeBook(userId: string): Promise<RecipeBookModel> {
    const [row] = await this.db
      .select()
      .from(recipeBooks)
      .where(and(eq(recipeBooks.isLiked, true), eq(recipeBooks.userId, userId)));
    if (!row) {
      throw new NotFoundError({
        id: userId,
        message: "No liked recipe book found for user"
      });
    }
    return row;
  }

  async createRecipeBook(userId: string, payload: CreateRecipeBookDto): Promise<RecipeBookModel> {
    const [row] = await this.db
      .insert(recipeBooks)
      .values({ ...payload, userId })
      .returning();
    if (!row) throw new Error("Insert returned no row");
    return row;
  }
}

export function createRecipeBookRepository(db: DatabaseProvider): RecipeBookRepository {
  return new RecipeBookRepositoryImpl(db);
}
