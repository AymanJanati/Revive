import { calculateImpactScore } from "@/lib/scoring/deterministicScoring";
import type { AgentContext, AgentRunResult, ImpactAgentData } from "@/types/analysis";

function impactRecommendedRoute(score: number): ImpactAgentData["recommendedRoute"] {
  if (score >= 75) return "REDIRECT_TO_COOPERATIVE";
  if (score >= 45) return "STORE_TEMPORARILY";
  return "REJECT_SPECIALIZED_TREATMENT";
}

export function runImpactAgent(ctx: AgentContext): AgentRunResult<ImpactAgentData> {
  const impactScore = calculateImpactScore(ctx.batch);
  const recommendedRoute = impactRecommendedRoute(impactScore);

  return {
    timelineItem: {
      agent: "IMPACT_AGENT",
      status: "COMPLETED",
      message: "Evaluating sustainability and social reuse potential.",
      reasoning:
        impactScore >= 75
          ? "Reuse pathways are strong, with higher social and environmental value through structured redirection."
          : impactScore >= 45
            ? "Impact potential is moderate and can improve with controlled handling."
            : "Impact risk is high; controlled treatment is safer than direct redistribution.",
      output: {
        impactScore,
        recommendedRoute
      }
    },
    data: {
      impactScore,
      recommendedRoute
    }
  };
}

