import type { WasteBatch, WasteBatchQueueItem } from "@/types/revive";

export function serializeQueueItems(items: WasteBatchQueueItem[]): WasteBatchQueueItem[] {
  return items.map((item) => ({ ...item }));
}

export function serializeBatchDetail(batch: WasteBatch): WasteBatch {
  return {
    ...batch,
    attachments: batch.attachments.map((att) => ({ ...att }))
  };
}

