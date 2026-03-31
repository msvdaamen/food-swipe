import { Result, UnhandledException } from "better-result";
import { DatabaseProvider } from "../../providers/database.provider";
import type { MeasurementEntity } from "../../schema";
import { createMeasurementRepository, MeasurementRepositoryImpl } from "./repository";
import type { CreateMeasurementDto } from "./dto/create-measurement.dto";
import type { UpdateMeasurementDto } from "./dto/update-measurement.dto";

export class MeasurementService {
  constructor(private readonly repo: MeasurementRepositoryImpl) {}

  all(): Promise<Result<MeasurementEntity[], UnhandledException>> {
    return this.repo.all();
  }

  create(
    payload: CreateMeasurementDto
  ): Promise<Result<MeasurementEntity, UnhandledException>> {
    return this.repo.create(payload);
  }

  update(
    id: number,
    payload: UpdateMeasurementDto
  ): Promise<Result<MeasurementEntity, UnhandledException>> {
    return this.repo.update(id, payload);
  }

  delete(id: number): Promise<Result<void, UnhandledException>> {
    return this.repo.delete(id);
  }

  findByAbbreviation(
    abbreviation: string
  ): Promise<Result<MeasurementEntity | null, UnhandledException>> {
    return this.repo.findByAbbreviation(abbreviation);
  }
}

export function createMeasurementService(db: DatabaseProvider): MeasurementService {
  return new MeasurementService(createMeasurementRepository(db));
}
