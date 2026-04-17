import { seededBatches } from "@/lib/seed/batches";
import type { BatchStatus, WasteBatch, WasteBatchQueueItem } from "@/types/revive";

const baseData = new Map<string, WasteBatch>(seededBatches.map((batch) => [batch.id, deepClone(batch)]));
const runtimeStatus = new Map<string, BatchStatus>(seededBatches.map((batch) => [batch.id, batch.status]));

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function withRuntimeStatus(batch: WasteBatch): WasteBatch {
  const status = runtimeStatus.get(batch.id) ?? batch.status;
  return { ...batch, status };
}

export class BatchRepository {
  listQueueItems(): WasteBatchQueueItem[] {
    return [...baseData.values()].map(withRuntimeStatus).map((batch) => ({
      id: batch.id,
      batchCode: batch.batchCode,
      sourceLine: batch.sourceLine,
      materialType: batch.materialType,
      quantityKg: batch.quantityKg,
      intakeDate: batch.intakeDate,
      status: batch.status
    }));
  }

  getById(id: string): WasteBatch | null {
    const found = baseData.get(id);
    if (!found) return null;
    return withRuntimeStatus(found);
  }

  setStatus(id: string, status: BatchStatus): boolean {
    if (!baseData.has(id)) return false;
    runtimeStatus.set(id, status);
    return true;
  }
}

export const batchRepository = new BatchRepository();

