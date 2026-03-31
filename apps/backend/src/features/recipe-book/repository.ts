import { Result, UnhandledException } from "better-result";
import { DatabaseProvider } from "../../providers/database.provider";
import { recipeBooks, type RecipeBookEntity } from "../../schema";
import { NotFoundError } from "../../common/errors/not-found.error";
import { and, eq } from "drizzle-orm";
import type { CreateRecipeBookDto } from "./dto/create-recipe-book.dto";

export class RecipeBookRepositoryImpl {
  constructor(private readonly db: DatabaseProvider) {}

  getRecipeBooks(
    userId: string
  ): Promise<Result<RecipeBookEntity[], UnhandledException>> {
    return Result.tryPromise(() =>
      this.db.select().from(recipeBooks).where(eq(recipeBooks.userId, userId))
    );
  }

  async getRecipeBook(
    userId: string,
    recipeBookId: number
  ): Promise<Result<RecipeBookEntity, NotFoundError | UnhandledException>> {
    const result = await Result.tryPromise(() =>
      this.db
        .select()
        .from(recipeBooks)
        .where(and(eq(recipeBooks.id, recipeBookId), eq(recipeBooks.userId, userId)))
    );
    if (result.isErr()) return result;
    const [row] = result.value;
    if (!row) {
      return Result.err(
        new NotFoundError({
          id: String(recipeBookId),
          message: "Recipe book not found"
        })
      );
    }
    return Result.ok(row);
  }

  async getLikedRecipeBook(
    userId: string
  ): Promise<Result<RecipeBookEntity, NotFoundError | UnhandledException>> {
    const result = await Result.tryPromise(() =>
      this.db
        .select()
        .from(recipeBooks)
        .where(and(eq(recipeBooks.isLiked, true), eq(recipeBooks.userId, userId)))
    );
    if (result.isErr()) return result;
    const [row] = result.value;
    if (!row) {
      return Result.err(
        new NotFoundError({
          id: userId,
          message: "No liked recipe book found for user"
        })
      );
    }
    return Result.ok(row);
  }

  createRecipeBook(
    userId: string,
    payload: CreateRecipeBookDto
  ): Promise<Result<RecipeBookEntity, UnhandledException>> {
    return Result.tryPromise(async () => {
      const [row] = await this.db
        .insert(recipeBooks)
        .values({ ...payload, userId })
        .returning();
      if (!row) throw new Error("Insert returned no row");
      return row;
    });
  }
}

export function createRecipeBookRepository(db: DatabaseProvider): RecipeBookRepositoryImpl {
  return new RecipeBookRepositoryImpl(db);
}
