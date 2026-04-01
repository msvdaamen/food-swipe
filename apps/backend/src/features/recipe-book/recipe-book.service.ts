import { DatabaseProvider } from "../../providers/database.provider";
import { createRecipeBookRepository } from "./recipe-book.repository";
import type { CreateRecipeBookDto } from "./dto/create-recipe-book.dto";
import { RecipeBookService } from "./types/interfaces/recipe-book.service";
import { RecipeBook } from "@food-swipe/types";
import { RecipeBookRepository } from "./types/interfaces/recipe-book.repository";

class RecipeBookServiceImpl implements RecipeBookService {
  constructor(private readonly repo: RecipeBookRepository) {}

  getRecipeBooks(userId: string): Promise<RecipeBook[]> {
    return this.repo.getRecipeBooks(userId);
  }

  createRecipeBook(userId: string, payload: CreateRecipeBookDto): Promise<RecipeBook> {
    return this.repo.createRecipeBook(userId, payload);
  }

  getLikedRecipeBook(userId: string): Promise<RecipeBook> {
    return this.repo.getLikedRecipeBook(userId);
  }
}

export function createRecipeBookService(db: DatabaseProvider): RecipeBookService {
  const repository = createRecipeBookRepository(db);
  return new RecipeBookServiceImpl(repository);
}
