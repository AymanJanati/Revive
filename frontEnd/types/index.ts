export type BatchStatus =
  | "AWAITING_ANALYSIS"
  | "UNDER_EVALUATION"
  | "ROUTING_RECOMMENDED";

export type ConditionLevel = "HIGH" | "MEDIUM" | "LOW";
export type ContaminationLevel = "LOW" | "MEDIUM" | "HIGH";
export type ReusePotential = "HIGH" | "MEDIUM_HIGH" | "MEDIUM" | "LOW";
export type MaterialType =
  | "COTTON"
  | "POLYESTER"
  | "COTTON_POLY_BLEND"
  | "DENIM"
  | "MIXED_TEXTILE"
  | "WOOL_BLEND"
  | "OTHER";

export type AttachmentType =
  | "INTAKE_SHEET"
  | "BATCH_IMAGE"
  | "OPERATOR_NOTE"
  | "MATERIAL_DECLARATION";

export interface BatchAttachment {
  id: string;
  name: string;
  type: AttachmentType;
  fileUrl?: string;
  previewUrl?: string;
  mimeType?: string;
}

export interface WasteBatch {
  id: string;
  batchCode: string;
  sourceLine: string;
  materialType: MaterialType;
  quantityKg: number;
  conditionLevel: ConditionLevel;
  contaminationLevel: ContaminationLevel;
  reusePotential: ReusePotential;
  marketDemand: number; // 0-100
  warehousePressure: number; // 0-100
  intakeDate: string; // ISO date string
  status: BatchStatus;
  notes: string;
  attachments: BatchAttachment[];
}

export interface SummaryBatch {
  id: string;
  batchCode: string;
  sourceLine: string;
  materialType: MaterialType;
  quantityKg: number;
  intakeDate: string;
  status: BatchStatus;
}
