import { Result, UnhandledException } from "better-result";
import { DatabaseProvider } from "../../providers/database.provider";
import { measurements, type MeasurementEntity } from "../../schema";
import { eq } from "drizzle-orm";
import type { CreateMeasurementDto } from "./dto/create-measurement.dto";
import type { UpdateMeasurementDto } from "./dto/update-measurement.dto";

export class MeasurementRepositoryImpl {
  constructor(private readonly db: DatabaseProvider) {}

  all(): Promise<Result<MeasurementEntity[], UnhandledException>> {
    return Result.tryPromise(() => this.db.select().from(measurements));
  }

  create(
    payload: CreateMeasurementDto
  ): Promise<Result<MeasurementEntity, UnhandledException>> {
    return Result.tryPromise(async () => {
      const [row] = await this.db.insert(measurements).values(payload).returning();
      if (!row) throw new Error("Insert returned no row");
      return row;
    });
  }

  update(
    id: number,
    payload: UpdateMeasurementDto
  ): Promise<Result<MeasurementEntity, UnhandledException>> {
    return Result.tryPromise(async () => {
      const [row] = await this.db
        .update(measurements)
        .set(payload)
        .where(eq(measurements.id, id))
        .returning();
      if (!row) throw new Error("Update returned no row");
      return row;
    });
  }

  delete(id: number): Promise<Result<void, UnhandledException>> {
    return Result.tryPromise(async () => {
      await this.db.delete(measurements).where(eq(measurements.id, id));
    });
  }

  findByAbbreviation(
    abbreviation: string
  ): Promise<Result<MeasurementEntity | null, UnhandledException>> {
    return Result.tryPromise(async () => {
      const [row] = await this.db
        .select()
        .from(measurements)
        .where(eq(measurements.abbreviation, abbreviation));
      return row ?? null;
    });
  }
}

export function createMeasurementRepository(db: DatabaseProvider): MeasurementRepositoryImpl {
  return new MeasurementRepositoryImpl(db);
}
