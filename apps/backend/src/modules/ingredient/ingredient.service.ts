import {DbService} from "../../common/db.service.ts";
import {type IngredientEntity, ingredients} from "../../schema";
import {and, asc, count, desc, eq, ilike} from "drizzle-orm";
import type {CreateIngredientDto} from "./dto/update-ingredient.dto.ts";
import {PgColumn} from "drizzle-orm/pg-core";
import type {PaginatedData} from "../../common/types/paginated-data.ts";
import type {GetIngredientsDto} from "./dto/get-ingredients.dto.ts";
import {CreatePagination} from "../../common/create-pagination.ts";

export class IngredientService extends DbService {

    async all(payload: GetIngredientsDto): Promise<PaginatedData<IngredientEntity>> {
        const wheres = [];
        if (payload.search) {
            wheres.push(ilike(ingredients.name, `%${payload.search}%`));
        }

        const sortColumn = this.getSortColumn(payload.sort);
        const sortFunction = this.getSortFunction(sortColumn, payload.order)
        const result = await this.database.select().from(ingredients).where(and(...wheres)).orderBy(sortFunction, ingredients.id).limit(payload.amount).offset((payload.page - 1) * payload.amount);
        const [{total}] = await this.database.select({total: count(ingredients.id)}).from(ingredients).where(and(...wheres));

        return {
            data: result,
            pagination: CreatePagination(total, payload.amount, payload.page)
        };
    }

    async findByName(name: string): Promise<IngredientEntity | null> {
        const [ingredient] = await this.database.select().from(ingredients).where(eq(ingredients.name, name)).execute();
        return ingredient || null;
    }

    async create(payload: CreateIngredientDto): Promise<IngredientEntity> {
        const [ingredient] = await this.database.insert(ingredients).values(payload).returning();
        return ingredient;
    }

    async update(id: number, payload: CreateIngredientDto): Promise<IngredientEntity> {
        const [ingredient] = await this.database.update(ingredients).set(payload).where(eq(ingredients.id, id)).returning();
        return ingredient;
    }

    async delete(id: number): Promise<void> {
        await this.database.delete(ingredients).where(eq(ingredients.id, id)).execute();
    }

    private getSortColumn(column?: string) {
        switch (column) {
            case 'name':
                return ingredients.name;
            default:
                return ingredients.id;
        }
    }

    private getSortFunction(sort: PgColumn, order?: 'asc' | 'desc') {
        return order === 'asc' ? asc(sort) : desc(sort);
    }
}

export const ingredientService = new IngredientService();
