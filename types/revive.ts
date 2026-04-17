// Shared frontend/backend contract types for Revive.
// Source of truth: frontend-backend-contract.md

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

// Queue endpoint returns summary records only.
export type WasteBatchQueueItem = Pick<
  WasteBatch,
  "id" | "batchCode" | "sourceLine" | "materialType" | "quantityKg" | "intakeDate" | "status"
>;

export type PartnerType =
  | "INDUSTRIAL_BUYER"
  | "COOPERATIVE"
  | "RECOVERY_UNIT"
  | "WAREHOUSE";

export interface PartnerProfile {
  id: string;
  partnerName: string;
  partnerType: PartnerType;
  acceptedMaterials: MaterialType[];
  valueProfile: number; // 0-100
  impactProfile: number; // 0-100
  operationalConstraints: string[];
}

export type RoutingOutcome =
  | "SELL"
  | "REDIRECT_TO_COOPERATIVE"
  | "STORE_TEMPORARILY"
  | "REJECT_SPECIALIZED_TREATMENT";

export type AgentName =
  | "BATCH_UNDERSTANDING_AGENT"
  | "VALUE_AGENT"
  | "IMPACT_AGENT"
  | "ARBITER_AGENT";

export type AgentExecutionStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

export interface AnalysisTimelineItem {
  agent: AgentName;
  status: AgentExecutionStatus;
  message: string;
  reasoning: string;
  output: Record<string, unknown>;
}

export type ConfidenceLevel = "LOW" | "MEDIUM" | "HIGH";

export interface FinalDecision {
  recommendedDestination: string;
  partnerType: PartnerType;
  routingOutcome: RoutingOutcome;
  explanation: string;
  businessScore: number; // 0-100
  impactScore: number; // 0-100
  confidence: ConfidenceLevel;
  nextAction: string;
}

export type QualitativeLevel = "LOW" | "MEDIUM" | "HIGH" | "STRONG";

export interface ValueSnapshot {
  recoverableValueEstimate: number;
  wasteDivertedKg: number;
  socialReusePotential: "LOW" | "MEDIUM" | "HIGH";
  sustainabilityContribution: QualitativeLevel;
}

export interface AnalysisResult {
  batchId: string;
  startedAt: string; // ISO date string
  completedAt: string; // ISO date string
  batchStatus: BatchStatus;
  timeline: AnalysisTimelineItem[];
  finalDecision: FinalDecision;
  valueSnapshot: ValueSnapshot;
}

// API request/response wrappers (contracted shapes).
export interface ApiSuccess<T> {
  data: T;
}

export type ApiErrorCode =
  | "BATCH_NOT_FOUND"
  | "INVALID_BATCH_ID"
  | "ANALYSIS_FAILED"
  | "INVALID_REQUEST"
  | "INTERNAL_SERVER_ERROR";

export interface ApiErrorShape {
  code: ApiErrorCode;
  message: string;
}

export interface ApiErrorResponse {
  error: ApiErrorShape;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorResponse;

export interface LaunchAnalysisRequest {
  batchId: string;
}

