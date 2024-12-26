import {DbService} from "../../common/db.service.ts";
import {type MeasurementEntity, measurementsSchema} from "./schema/measurement.schema.ts";
import type {CreateMeasurementDto} from "./dto/create-measurement.dto.ts";
import type {UpdateMeasurementDto} from "./dto/update-measurement.dto.ts";
import {eq} from "drizzle-orm";


export class MeasurementService extends DbService {
    constructor() {
        super();
    }

    async all(): Promise<MeasurementEntity[]> {
        return await this.database.select().from(measurementsSchema).execute();
    }

    async findByAbbreviation(abbreviation: string): Promise<MeasurementEntity | null> {
        const [measurement] = await this.database.select().from(measurementsSchema).where(eq(measurementsSchema.abbreviation, abbreviation)).execute();
        return measurement || null
    }

    async create(payload: CreateMeasurementDto): Promise<MeasurementEntity> {
        const [measurement] =  await this.database.insert(measurementsSchema).values(payload).returning().execute();
        return measurement;
    }

    async update(id: number, payload: UpdateMeasurementDto): Promise<MeasurementEntity> {
        const [measurement] = await this.database.update(measurementsSchema).set(payload).where(eq(measurementsSchema.id, id)).returning().execute();
        return measurement;
    }

    async delete(id: number): Promise<void> {
        await this.database.delete(measurementsSchema).where(eq(measurementsSchema.id, id)).execute();
    }
}

export const measurementService = new MeasurementService();