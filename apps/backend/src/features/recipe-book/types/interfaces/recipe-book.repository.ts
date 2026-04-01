import { CreateRecipeBookDto } from "../../dto/create-recipe-book.dto";
import { RecipeBookModel } from "../models";

export interface RecipeBookRepository {
  getRecipeBooks(userId: string): Promise<RecipeBookModel[]>;
  getRecipeBook(userId: string, recipeBookId: number): Promise<RecipeBookModel>;
  getLikedRecipeBook(userId: string): Promise<RecipeBookModel>;
  createRecipeBook(userId: string, payload: CreateRecipeBookDto): Promise<RecipeBookModel>;
}
