import { ApiError } from "@/lib/errors/apiError";
import { batchRepository } from "@/lib/repositories/batchRepository";
import type { WasteBatch, WasteBatchQueueItem } from "@/types/revive";

export class BatchService {
  getQueue(): WasteBatchQueueItem[] {
    return batchRepository.listQueueItems();
  }

  getBatchById(batchId: string): WasteBatch {
    if (!batchId || typeof batchId !== "string") {
      throw new ApiError("INVALID_BATCH_ID", "Batch ID is required.", 400);
    }
    const batch = batchRepository.getById(batchId);
    if (!batch) {
      throw new ApiError("BATCH_NOT_FOUND", "The requested batch could not be found.", 404);
    }
    return batch;
  }
}

export const batchService = new BatchService();

