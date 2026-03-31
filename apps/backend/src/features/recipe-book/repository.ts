import { DatabaseProvider } from "../../providers/database.provider";
import { recipeBooks, type RecipeBookEntity } from "../../schema";
import { NotFoundError } from "../../common/errors/not-found.error";
import { and, eq } from "drizzle-orm";
import type { CreateRecipeBookDto } from "./dto/create-recipe-book.dto";

export class RecipeBookRepositoryImpl {
  constructor(private readonly db: DatabaseProvider) {}

  getRecipeBooks(userId: string): Promise<RecipeBookEntity[]> {
    return this.db.select().from(recipeBooks).where(eq(recipeBooks.userId, userId));
  }

  async getRecipeBook(userId: string, recipeBookId: number): Promise<RecipeBookEntity> {
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

  async getLikedRecipeBook(userId: string): Promise<RecipeBookEntity> {
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

  async createRecipeBook(userId: string, payload: CreateRecipeBookDto): Promise<RecipeBookEntity> {
    const [row] = await this.db
      .insert(recipeBooks)
      .values({ ...payload, userId })
      .returning();
    if (!row) throw new Error("Insert returned no row");
    return row;
  }
}

export function createRecipeBookRepository(db: DatabaseProvider): RecipeBookRepositoryImpl {
  return new RecipeBookRepositoryImpl(db);
}
