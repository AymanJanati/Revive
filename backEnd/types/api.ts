import type {
  AnalysisResult,
  ApiErrorCode,
  BatchStatus,
  MaterialType,
  PartnerType,
  RoutingOutcome,
  WasteBatch,
  WasteBatchQueueItem
} from "@/types/revive";

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
  };
}

export interface LaunchAnalysisBody {
  batchId: string;
}

export interface BatchesResponse {
  data: WasteBatchQueueItem[];
}

export interface BatchDetailResponse {
  data: WasteBatch;
}

export interface AnalysisResponse {
  data: AnalysisResult;
}

export interface PartnersResponse {
  data: Array<{
    id: string;
    partnerName: string;
    partnerType: PartnerType;
    acceptedMaterials: MaterialType[];
    valueProfile: number;
    impactProfile: number;
    operationalConstraints: string[];
  }>;
}

export interface HealthResponse {
  status: "ok";
}

export interface ScoringDecision {
  routingOutcome: RoutingOutcome;
  batchStatus: BatchStatus;
  businessScore: number;
  impactScore: number;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  scoreDelta: number;
}
