import { Result, UnhandledException } from "better-result";
import { DatabaseProvider } from "../../providers/database.provider";
import { ingredients, type IngredientEntity } from "../../schema";
import { PaginatedData } from "../../common/types/paginated-data";
import { CreatePagination } from "../../common/create-pagination";
import { and, asc, count, desc, eq, ilike, type SQLWrapper } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import type { GetIngredientsDto } from "./dto/get-ingredients.dto";
import type { CreateIngredientDto } from "./dto/create-ingredient.dto";
import type { UpdateIngredientDto } from "./dto/update-ingredient.dto";

export class IngredientRepositoryImpl {
  constructor(private readonly db: DatabaseProvider) {}

  private getSortColumn(column?: string): PgColumn {
    switch (column) {
      case "name":
        return ingredients.name;
      default:
        return ingredients.id;
    }
  }

  private getSortOrder(sort: PgColumn, order?: "asc" | "desc") {
    return order === "asc" ? asc(sort) : desc(sort);
  }

  all(
    payload: GetIngredientsDto
  ): Promise<Result<PaginatedData<IngredientEntity>, UnhandledException>> {
    return Result.tryPromise(async () => {
      const wheres: SQLWrapper[] = [];
      if (payload.search) {
        wheres.push(ilike(ingredients.name, `%${payload.search}%`));
      }
      const whereClause = wheres.length ? and(...wheres) : undefined;
      const sortColumn = this.getSortColumn(payload.sort);
      const sortFn = this.getSortOrder(sortColumn, payload.order);
      const result = await this.db
        .select()
        .from(ingredients)
        .where(whereClause)
        .orderBy(sortFn, ingredients.id)
        .limit(payload.amount)
        .offset((payload.page - 1) * payload.amount);
      const [{ total }] = await this.db
        .select({ total: count(ingredients.id) })
        .from(ingredients)
        .where(whereClause);
      return {
        data: result,
        pagination: CreatePagination(total, payload.amount, payload.page)
      };
    });
  }

  findByName(
    name: string
  ): Promise<Result<IngredientEntity | null, UnhandledException>> {
    return Result.tryPromise(async () => {
      const [row] = await this.db.select().from(ingredients).where(eq(ingredients.name, name));
      return row ?? null;
    });
  }

  create(
    payload: CreateIngredientDto
  ): Promise<Result<IngredientEntity, UnhandledException>> {
    return Result.tryPromise(async () => {
      const [row] = await this.db.insert(ingredients).values(payload).returning();
      if (!row) throw new Error("Insert returned no row");
      return row;
    });
  }

  update(
    id: number,
    payload: UpdateIngredientDto
  ): Promise<Result<IngredientEntity, UnhandledException>> {
    return Result.tryPromise(async () => {
      const [row] = await this.db
        .update(ingredients)
        .set(payload)
        .where(eq(ingredients.id, id))
        .returning();
      if (!row) throw new Error("Update returned no row");
      return row;
    });
  }

  delete(id: number): Promise<Result<void, UnhandledException>> {
    return Result.tryPromise(async () => {
      await this.db.delete(ingredients).where(eq(ingredients.id, id));
    });
  }
}

export function createIngredientRepository(db: DatabaseProvider): IngredientRepositoryImpl {
  return new IngredientRepositoryImpl(db);
}
