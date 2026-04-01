import { RecipeBook } from "@food-swipe/types";
import { CreateRecipeBookDto } from "../../dto/create-recipe-book.dto";
import { RecipeBookModel } from "../models";

export interface RecipeBookService {
  getRecipeBooks(userId: string): Promise<RecipeBook[]>;
  createRecipeBook(userId: string, payload: CreateRecipeBookDto): Promise<RecipeBook>;
  getLikedRecipeBook(userId: string): Promise<RecipeBook>;
  createRecipeBook(userId: string, payload: CreateRecipeBookDto): Promise<RecipeBookModel>;
}
