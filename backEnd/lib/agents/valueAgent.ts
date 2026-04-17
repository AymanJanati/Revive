import { calculateBusinessScore } from "@/lib/scoring/deterministicScoring";
import type { AgentContext, AgentRunResult, ValueAgentData } from "@/types/analysis";

function valueRecommendedRoute(score: number): ValueAgentData["recommendedRoute"] {
  if (score >= 75) return "SELL";
  if (score >= 45) return "STORE_TEMPORARILY";
  return "REJECT_SPECIALIZED_TREATMENT";
}

export function runValueAgent(ctx: AgentContext): AgentRunResult<ValueAgentData> {
  const valueScore = calculateBusinessScore(ctx.batch);
  const recommendedRoute = valueRecommendedRoute(valueScore);

  return {
    timelineItem: {
      agent: "VALUE_AGENT",
      status: "COMPLETED",
      message: "Evaluating commercial attractiveness.",
      reasoning:
        valueScore >= 75
          ? "Commercial fit is strong with healthy market demand and acceptable quality."
          : valueScore >= 45
            ? "Commercial value is moderate and may require short-term handling before allocation."
            : "Commercial upside is limited under current contamination and quality conditions.",
      output: {
        valueScore,
        recommendedRoute
      }
    },
    data: {
      valueScore,
      recommendedRoute
    }
  };
}

