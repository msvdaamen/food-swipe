import {DbService} from "../../common/db.service.ts";
import {type IngredientEntity, ingredientsSchema} from "./schema/ingredient.schema.ts";
import {and, asc, count, desc, eq, gt, lte, sql} from "drizzle-orm";
import type {CreateIngredientDto} from "./dto/update-ingredient.dto.ts";
import {PgColumn} from "drizzle-orm/pg-core";
import type {PaginatedData} from "../../common/types/paginated-data.ts";
import type {GetIngredientsDto} from "./dto/get-ingredients.dto.ts";
import {CreatePagination} from "../../common/create-pagination.ts";

export class IngredientService extends DbService {

    async all(payload: GetIngredientsDto): Promise<PaginatedData<IngredientEntity>> {
        const wheres = [];
        if (payload.search) {
            wheres.push(eq(ingredientsSchema.name, payload.search));
        }

        const sortColumn = this.getSortColumn(payload.sort);
        const sortFunction = this.getSortFunction(sortColumn, payload.order)
        const ingredients = await this.database.select().from(ingredientsSchema).where(and(...wheres)).orderBy(sortFunction, ingredientsSchema.id).limit(payload.amount).offset((payload.page - 1) * payload.amount);
        const [{total}] = await this.database.select({total: count(ingredientsSchema.id)}).from(ingredientsSchema).where(and(...wheres));

        return {
            data: ingredients,
            pagination: CreatePagination(total, payload.amount, payload.page)
        };
    }

    async create(payload: CreateIngredientDto): Promise<IngredientEntity> {
        const [ingredient] = await this.database.insert(ingredientsSchema).values(payload).returning();
        return ingredient;
    }

    async update(id: number, payload: CreateIngredientDto): Promise<IngredientEntity> {
        const [ingredient] = await this.database.update(ingredientsSchema).set(payload).where(eq(ingredientsSchema.id, id)).returning();
        return ingredient;
    }

    async delete(id: number): Promise<void> {
        await this.database.delete(ingredientsSchema).where(eq(ingredientsSchema.id, id)).execute();
    }

    private getSortColumn(column: string) {
        switch (column) {
            case 'name':
                return ingredientsSchema.name;
            default:
                return ingredientsSchema.id;
        }
    }

    private getSortFunction(sort: PgColumn, order: 'asc' | 'desc') {
        return order === 'asc' ? asc(sort) : desc(sort);
    }
}

export const ingredientService = new IngredientService();