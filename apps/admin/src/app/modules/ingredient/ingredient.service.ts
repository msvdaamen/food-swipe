import { Ingredient } from "./types/ingredient.type";
import { GetIngredientsRequest } from "./requests/get-ingredients.request";
import { CreateIngredientRequest } from "./requests/create-ingredient.request";
import { UpdateIngredientRequest } from "./requests/update-ingredient.request";
import { PaginatedData } from "../../common/types/paginated-data";
import { httpApi } from "@/common/api";
import { objectToSearchParams } from "@/common/lib/utils";
export class IngredientService {
  getAll(payload: GetIngredientsRequest) {
    const params = objectToSearchParams(payload);

    return httpApi.get<PaginatedData<Ingredient>>(`/v1/ingredients?${params}`);
  }

  getNext(cursor: string | null = null) {
    const params = new URLSearchParams();
    if (cursor) {
      params.set("cursor", cursor);
    }
    return httpApi.get<PaginatedData<Ingredient>>(`/v1/ingredients?${params}`);
  }

  create(payload: CreateIngredientRequest) {
    return httpApi.post<Ingredient>(`/v1/ingredients`, payload);
  }

  update(id: number, payload: UpdateIngredientRequest) {
    return httpApi.put<Ingredient>(`/v1/ingredients/${id}`, payload);
  }

  delete(id: number) {
    return httpApi.delete(`/v1/ingredients/${id}`);
  }
}
