import { partnerRepository } from "@/lib/repositories/partnerRepository";
import { runDeterministicDecision } from "@/lib/scoring/deterministicScoring";
import type { AgentContext, AgentRunResult, ArbiterData } from "@/types/analysis";
import type { FinalDecision, ValueSnapshot } from "@/types/revive";

function explanationForRoute(route: FinalDecision["routingOutcome"]): string {
  if (route === "SELL") return "High-quality material and market fit support direct industrial resale.";
  if (route === "REDIRECT_TO_COOPERATIVE") return "Balanced economics with stronger social reuse and sustainability benefit.";
  if (route === "STORE_TEMPORARILY") return "Current constraints suggest temporary holding pending improved routing conditions.";
  return "Contamination and quality constraints require specialized treatment for safe recovery.";
}

function nextActionForRoute(route: FinalDecision["routingOutcome"]): string {
  if (route === "SELL") return "Initiate buyer allocation and dispatch preparation";
  if (route === "REDIRECT_TO_COOPERATIVE") return "Prepare batch for cooperative dispatch";
  if (route === "STORE_TEMPORARILY") return "Move batch to temporary storage and schedule reassessment";
  return "Prepare transfer manifest for specialized treatment";
}

function snapshotFromDecision(ctx: AgentContext, finalDecision: FinalDecision): ValueSnapshot {
  return {
    recoverableValueEstimate:
      finalDecision.routingOutcome === "SELL"
        ? Math.round(ctx.batch.quantityKg * 11.2)
        : finalDecision.routingOutcome === "REDIRECT_TO_COOPERATIVE"
          ? Math.round(ctx.batch.quantityKg * 6.8)
          : finalDecision.routingOutcome === "STORE_TEMPORARILY"
            ? Math.round(ctx.batch.quantityKg * 4.5)
            : Math.round(ctx.batch.quantityKg * 1.2),
    wasteDivertedKg: ctx.batch.quantityKg,
    socialReusePotential:
      finalDecision.routingOutcome === "REDIRECT_TO_COOPERATIVE"
        ? "HIGH"
        : finalDecision.routingOutcome === "SELL" || finalDecision.routingOutcome === "STORE_TEMPORARILY"
          ? "MEDIUM"
          : "LOW",
    sustainabilityContribution:
      finalDecision.routingOutcome === "REDIRECT_TO_COOPERATIVE"
        ? "STRONG"
        : finalDecision.routingOutcome === "SELL" || finalDecision.routingOutcome === "STORE_TEMPORARILY"
          ? "HIGH"
          : "MEDIUM"
  };
}

export function runArbiterAgent(ctx: AgentContext): AgentRunResult<ArbiterData> {
  const decision = runDeterministicDecision(ctx.batch);
  const partner = partnerRepository.findPreferredByOutcome(decision.routingOutcome);
  const finalDecision: FinalDecision = {
    recommendedDestination: partner.partnerName,
    partnerType: partner.partnerType,
    routingOutcome: decision.routingOutcome,
    explanation: explanationForRoute(decision.routingOutcome),
    businessScore: decision.businessScore,
    impactScore: decision.impactScore,
    confidence: decision.confidence,
    nextAction: nextActionForRoute(decision.routingOutcome)
  };
  const valueSnapshot = snapshotFromDecision(ctx, finalDecision);

  return {
    timelineItem: {
      agent: "ARBITER_AGENT",
      status: "COMPLETED",
      message: "Resolving trade-offs and issuing final routing decision.",
      reasoning: `Arbitration completed with business score ${decision.businessScore} and impact score ${decision.impactScore}; selected route is ${decision.routingOutcome}.`,
      output: {
        finalRoute: finalDecision.routingOutcome,
        confidence: finalDecision.confidence,
        nextAction: finalDecision.nextAction
      }
    },
    data: {
      decision,
      finalDecision,
      valueSnapshot
    }
  };
}

