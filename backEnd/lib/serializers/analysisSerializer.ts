import type { AnalysisResult } from "@/types/revive";

export function serializeAnalysis(result: AnalysisResult): AnalysisResult {
  return {
    ...result,
    timeline: result.timeline.map((item) => ({
      ...item,
      output: { ...item.output }
    })),
    finalDecision: { ...result.finalDecision },
    valueSnapshot: { ...result.valueSnapshot }
  };
}

