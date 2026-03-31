import { DatabaseProvider } from "../../providers/database.provider";
import type { MeasurementEntity } from "../../schema";
import { createMeasurementRepository, MeasurementRepositoryImpl } from "./repository";
import type { CreateMeasurementDto } from "./dto/create-measurement.dto";
import type { UpdateMeasurementDto } from "./dto/update-measurement.dto";

export class MeasurementService {
  constructor(private readonly repo: MeasurementRepositoryImpl) {}

  all(): Promise<MeasurementEntity[]> {
    return this.repo.all();
  }

  create(payload: CreateMeasurementDto): Promise<MeasurementEntity> {
    return this.repo.create(payload);
  }

  update(id: number, payload: UpdateMeasurementDto): Promise<MeasurementEntity> {
    return this.repo.update(id, payload);
  }

  delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }

  findByAbbreviation(abbreviation: string): Promise<MeasurementEntity | null> {
    return this.repo.findByAbbreviation(abbreviation);
  }
}

export function createMeasurementService(db: DatabaseProvider): MeasurementService {
  return new MeasurementService(createMeasurementRepository(db));
}
