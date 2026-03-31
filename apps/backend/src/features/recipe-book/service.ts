import { DatabaseProvider } from "../../providers/database.provider";
import type { RecipeBookEntity } from "../../schema";
import {
  createRecipeBookRepository,
  RecipeBookRepositoryImpl
} from "./repository";
import type { CreateRecipeBookDto } from "./dto/create-recipe-book.dto";

export class RecipeBookService {
  constructor(private readonly repo: RecipeBookRepositoryImpl) {}

  getRecipeBooks(userId: string): Promise<RecipeBookEntity[]> {
    return this.repo.getRecipeBooks(userId);
  }

  createRecipeBook(userId: string, payload: CreateRecipeBookDto): Promise<RecipeBookEntity> {
    return this.repo.createRecipeBook(userId, payload);
  }

  getLikedRecipeBook(userId: string): Promise<RecipeBookEntity> {
    return this.repo.getLikedRecipeBook(userId);
  }
}

export function createRecipeBookService(db: DatabaseProvider): RecipeBookService {
  return new RecipeBookService(createRecipeBookRepository(db));
}
