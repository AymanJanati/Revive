import { runArbiterAgent } from "@/lib/agents/arbiterAgent";
import { runBatchUnderstandingAgent } from "@/lib/agents/batchUnderstandingAgent";
import { runImpactAgent } from "@/lib/agents/impactAgent";
import { runValueAgent } from "@/lib/agents/valueAgent";
import { ApiError } from "@/lib/errors/apiError";
import { maybePolishPhrasing } from "@/lib/llm/phrasing";
import { batchRepository } from "@/lib/repositories/batchRepository";
import type { AgentContext } from "@/types/analysis";
import type { AnalysisResult } from "@/types/revive";

export class AnalysisService {
  async run(batchId: string): Promise<AnalysisResult> {
    if (!batchId || typeof batchId !== "string") {
      throw new ApiError("INVALID_BATCH_ID", "Batch ID is required.", 400);
    }

    const batch = batchRepository.getById(batchId);
    if (!batch) {
      throw new ApiError("BATCH_NOT_FOUND", "The requested batch could not be found.", 404);
    }

    const startedAt = new Date();
    const ctx: AgentContext = { batch };

    try {
      batchRepository.setStatus(batchId, "UNDER_EVALUATION");

      const batchUnderstanding = runBatchUnderstandingAgent(ctx);
      const value = runValueAgent(ctx);
      const impact = runImpactAgent(ctx);
      const arbiter = runArbiterAgent(ctx);

      batchRepository.setStatus(batchId, arbiter.data.decision.batchStatus);

      const completedAt = new Date(startedAt.getTime() + 6000);
      const result: AnalysisResult = {
        batchId,
        startedAt: startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        batchStatus: arbiter.data.decision.batchStatus,
        timeline: [
          batchUnderstanding.timelineItem,
          value.timelineItem,
          impact.timelineItem,
          arbiter.timelineItem
        ],
        finalDecision: arbiter.data.finalDecision,
        valueSnapshot: arbiter.data.valueSnapshot
      };

      return await maybePolishPhrasing(result);
    } catch (e) {
      batchRepository.setStatus(batchId, "AWAITING_ANALYSIS");
      if (e instanceof ApiError) throw e;
      throw new ApiError("ANALYSIS_FAILED", "Analysis failed for the requested batch.", 500);
    }
  }
}

export const analysisService = new AnalysisService();
