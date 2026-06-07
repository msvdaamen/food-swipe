import { DatabaseProvider } from "../../providers/database.provider";
import { createRecipeBookRepository, RecipeBookRepository } from "./recipe-book.repository";
import type { CreateRecipeBookDto } from "./dto/create-recipe-book.dto";
import { RecipeBook } from "@food-swipe/types";

export interface RecipeBookService {
  getRecipeBooks(userId: string): Promise<RecipeBook[]>;
  createRecipeBook(userId: string, payload: CreateRecipeBookDto): Promise<RecipeBook>;
  getLikedRecipeBook(userId: string): Promise<RecipeBook>;
  createRecipeBook(userId: string, payload: CreateRecipeBookDto): Promise<RecipeBook>;
}

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
