import {DbService} from "../../common/db.service.ts";
import {type MeasurementEntity, measurements} from "@food-swipe/database";
import type {CreateMeasurementDto} from "./dto/create-measurement.dto.ts";
import type {UpdateMeasurementDto} from "./dto/update-measurement.dto.ts";
import {eq} from "drizzle-orm";


export class MeasurementService extends DbService {
    constructor() {
        super();
    }

    async all(): Promise<MeasurementEntity[]> {
        return await this.database.select().from(measurements).execute();
    }

    async findByAbbreviation(abbreviation: string): Promise<MeasurementEntity | null> {
        const [measurement] = await this.database.select().from(measurements).where(eq(measurements.abbreviation, abbreviation)).execute();
        return measurement || null
    }

    async create(payload: CreateMeasurementDto): Promise<MeasurementEntity> {
        const [measurement] =  await this.database.insert(measurements).values(payload).returning().execute();
        return measurement;
    }

    async update(id: number, payload: UpdateMeasurementDto): Promise<MeasurementEntity> {
        const [measurement] = await this.database.update(measurements).set(payload).where(eq(measurements.id, id)).returning().execute();
        return measurement;
    }

    async delete(id: number): Promise<void> {
        await this.database.delete(measurements).where(eq(measurements.id, id)).execute();
    }
}

export const measurementService = new MeasurementService();