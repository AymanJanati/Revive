import type {
  AnalysisTimelineItem,
  FinalDecision,
  ValueSnapshot,
  WasteBatch
} from "@/types/revive";
import type { ScoringDecision } from "@/types/api";

export interface AgentContext {
  batch: WasteBatch;
}

export interface BatchUnderstandingData {
  normalizedMaterial: string;
  qualityIndex: number;
  contaminationPenalty: number;
}

export interface ValueAgentData {
  valueScore: number;
  recommendedRoute: ScoringDecision["routingOutcome"];
}

export interface ImpactAgentData {
  impactScore: number;
  recommendedRoute: ScoringDecision["routingOutcome"];
}

export interface ArbiterData {
  decision: ScoringDecision;
  finalDecision: FinalDecision;
  valueSnapshot: ValueSnapshot;
}

export interface AgentRunResult<TData> {
  timelineItem: AnalysisTimelineItem;
  data: TData;
}

