import { DatabaseProvider } from "../../providers/database.provider";
import { measurements, type MeasurementEntity } from "../../schema";
import { eq } from "drizzle-orm";
import type { CreateMeasurementDto } from "./dto/create-measurement.dto";
import type { UpdateMeasurementDto } from "./dto/update-measurement.dto";

export class MeasurementRepositoryImpl {
  constructor(private readonly db: DatabaseProvider) {}

  all(): Promise<MeasurementEntity[]> {
    return this.db.select().from(measurements);
  }

  async create(payload: CreateMeasurementDto): Promise<MeasurementEntity> {
    const [row] = await this.db.insert(measurements).values(payload).returning();
    if (!row) throw new Error("Insert returned no row");
    return row;
  }

  async update(id: number, payload: UpdateMeasurementDto): Promise<MeasurementEntity> {
    const [row] = await this.db
      .update(measurements)
      .set(payload)
      .where(eq(measurements.id, id))
      .returning();
    if (!row) throw new Error("Update returned no row");
    return row;
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(measurements).where(eq(measurements.id, id));
  }

  async findByAbbreviation(abbreviation: string): Promise<MeasurementEntity | null> {
    const [row] = await this.db
      .select()
      .from(measurements)
      .where(eq(measurements.abbreviation, abbreviation));
    return row ?? null;
  }
}

export function createMeasurementRepository(db: DatabaseProvider): MeasurementRepositoryImpl {
  return new MeasurementRepositoryImpl(db);
}
