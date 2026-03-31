import { Result, UnhandledException } from "better-result";
import { DatabaseProvider } from "../../providers/database.provider";
import type { IngredientEntity } from "../../schema";
import { PaginatedData } from "../../common/types/paginated-data";
import { createIngredientRepository, IngredientRepositoryImpl } from "./repository";
import type { GetIngredientsDto } from "./dto/get-ingredients.dto";
import type { CreateIngredientDto } from "./dto/create-ingredient.dto";
import type { UpdateIngredientDto } from "./dto/update-ingredient.dto";

export class IngredientService {
  constructor(private readonly repo: IngredientRepositoryImpl) {}

  all(
    payload: GetIngredientsDto
  ): Promise<Result<PaginatedData<IngredientEntity>, UnhandledException>> {
    return this.repo.all(payload);
  }

  findByName(
    name: string
  ): Promise<Result<IngredientEntity | null, UnhandledException>> {
    return this.repo.findByName(name);
  }

  create(
    payload: CreateIngredientDto
  ): Promise<Result<IngredientEntity, UnhandledException>> {
    return this.repo.create(payload);
  }

  update(
    id: number,
    payload: UpdateIngredientDto
  ): Promise<Result<IngredientEntity, UnhandledException>> {
    return this.repo.update(id, payload);
  }

  delete(id: number): Promise<Result<void, UnhandledException>> {
    return this.repo.delete(id);
  }
}

export function createIngredientService(db: DatabaseProvider): IngredientService {
  return new IngredientService(createIngredientRepository(db));
}
