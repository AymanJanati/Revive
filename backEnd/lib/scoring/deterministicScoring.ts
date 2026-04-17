import type {
  ConditionLevel,
  ContaminationLevel,
  ReusePotential,
  RoutingOutcome,
  WasteBatch
} from "@/types/revive";
import type { ScoringDecision } from "@/types/api";

const conditionWeight: Record<ConditionLevel, number> = {
  HIGH: 30,
  MEDIUM: 18,
  LOW: 8
};

const contaminationPenalty: Record<ContaminationLevel, number> = {
  LOW: 5,
  MEDIUM: 20,
  HIGH: 42
};

const reuseWeight: Record<ReusePotential, number> = {
  HIGH: 26,
  MEDIUM_HIGH: 20,
  MEDIUM: 14,
  LOW: 5
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateBusinessScore(batch: WasteBatch): number {
  const raw =
    0.48 * batch.marketDemand +
    0.2 * conditionWeight[batch.conditionLevel] +
    0.22 * reuseWeight[batch.reusePotential] -
    0.2 * contaminationPenalty[batch.contaminationLevel] -
    0.07 * batch.warehousePressure;

  return clampScore(raw + 30);
}

export function calculateImpactScore(batch: WasteBatch): number {
  const contaminationFactor =
    batch.contaminationLevel === "LOW" ? 24 : batch.contaminationLevel === "MEDIUM" ? 14 : 5;
  const raw =
    0.36 * contaminationFactor +
    0.34 * reuseWeight[batch.reusePotential] +
    0.2 * conditionWeight[batch.conditionLevel] +
    0.1 * (100 - batch.warehousePressure) -
    0.08 * (100 - batch.marketDemand);

  return clampScore(raw + 35);
}

function inferRoute(
  batch: WasteBatch,
  businessScore: number,
  impactScore: number
): RoutingOutcome {
  if (
    batch.contaminationLevel === "HIGH" ||
    (batch.conditionLevel === "LOW" && batch.reusePotential === "LOW")
  ) {
    return "REJECT_SPECIALIZED_TREATMENT";
  }

  if (batch.warehousePressure >= 82 && impactScore < 65) {
    return "STORE_TEMPORARILY";
  }

  if (businessScore >= 78 && batch.contaminationLevel === "LOW") {
    return "SELL";
  }

  if (impactScore - businessScore >= 12) {
    return "REDIRECT_TO_COOPERATIVE";
  }

  if (businessScore < 46 && impactScore < 58) {
    return "STORE_TEMPORARILY";
  }

  return businessScore >= impactScore ? "SELL" : "REDIRECT_TO_COOPERATIVE";
}

function inferConfidence(scoreDelta: number): "LOW" | "MEDIUM" | "HIGH" {
  const absDelta = Math.abs(scoreDelta);
  if (absDelta >= 20) return "HIGH";
  if (absDelta >= 10) return "MEDIUM";
  return "LOW";
}

export function runDeterministicDecision(batch: WasteBatch): ScoringDecision {
  const businessScore = calculateBusinessScore(batch);
  const impactScore = calculateImpactScore(batch);
  const routingOutcome = inferRoute(batch, businessScore, impactScore);
  const scoreDelta = impactScore - businessScore;
  const confidence = inferConfidence(scoreDelta);

  return {
    routingOutcome,
    batchStatus: "ROUTING_RECOMMENDED",
    businessScore,
    impactScore,
    confidence,
    scoreDelta
  };
}

