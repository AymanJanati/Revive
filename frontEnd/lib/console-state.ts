import type { AnalysisResult, WasteBatch, WasteBatchQueueItem } from "../../types/revive";

export type QueueState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "empty" }
  | { kind: "ready"; items: WasteBatchQueueItem[] };

export type BatchState =
  | { kind: "idle" }
  | { kind: "loading"; id: string }
  | { kind: "error"; id: string; message: string }
  | { kind: "ready"; batch: WasteBatch };

export type AnalysisState =
  | { kind: "idle" }
  | { kind: "running"; batchId: string; startedAtIso: string }
  | { kind: "error"; batchId: string; message: string }
  | { kind: "ready"; result: AnalysisResult };
