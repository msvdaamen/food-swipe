import { DatabaseProvider } from "../../providers/database.provider";
import type { IngredientEntity } from "../../schema";
import { PaginatedData } from "../../common/types/paginated-data";
import { createIngredientRepository, IngredientRepositoryImpl } from "./repository";
import type { GetIngredientsDto } from "./dto/get-ingredients.dto";
import type { CreateIngredientDto } from "./dto/create-ingredient.dto";
import type { UpdateIngredientDto } from "./dto/update-ingredient.dto";

export class IngredientService {
  constructor(private readonly repo: IngredientRepositoryImpl) {}

  all(payload: GetIngredientsDto): Promise<PaginatedData<IngredientEntity>> {
    return this.repo.all(payload);
  }

  findByName(name: string): Promise<IngredientEntity | null> {
    return this.repo.findByName(name);
  }

  create(payload: CreateIngredientDto): Promise<IngredientEntity> {
    return this.repo.create(payload);
  }

  update(id: number, payload: UpdateIngredientDto): Promise<IngredientEntity> {
    return this.repo.update(id, payload);
  }

  delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}

export function createIngredientService(db: DatabaseProvider): IngredientService {
  return new IngredientService(createIngredientRepository(db));
}
