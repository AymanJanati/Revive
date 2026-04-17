import type { AgentRunResult, BatchUnderstandingData } from "@/types/analysis";
import type { AgentContext } from "@/types/analysis";

function qualityIndexFromBatch(ctx: AgentContext): number {
  const batch = ctx.batch;
  const condition = batch.conditionLevel === "HIGH" ? 35 : batch.conditionLevel === "MEDIUM" ? 24 : 12;
  const reuse = batch.reusePotential === "HIGH" ? 35 : batch.reusePotential === "MEDIUM_HIGH" ? 28 : batch.reusePotential === "MEDIUM" ? 20 : 10;
  const contamination = batch.contaminationLevel === "LOW" ? 5 : batch.contaminationLevel === "MEDIUM" ? 16 : 30;
  return Math.max(0, Math.min(100, condition + reuse - contamination + 35));
}

export function runBatchUnderstandingAgent(ctx: AgentContext): AgentRunResult<BatchUnderstandingData> {
  const contaminationPenalty =
    ctx.batch.contaminationLevel === "LOW"
      ? 8
      : ctx.batch.contaminationLevel === "MEDIUM"
        ? 20
        : 36;

  const data: BatchUnderstandingData = {
    normalizedMaterial: ctx.batch.materialType,
    qualityIndex: qualityIndexFromBatch(ctx),
    contaminationPenalty
  };

  return {
    timelineItem: {
      agent: "BATCH_UNDERSTANDING_AGENT",
      status: "COMPLETED",
      message: "Structuring intake record and normalizing waste profile.",
      reasoning: `Batch ${ctx.batch.batchCode} shows ${ctx.batch.conditionLevel.toLowerCase()} condition with ${ctx.batch.contaminationLevel.toLowerCase()} contamination and ${ctx.batch.reusePotential.toLowerCase().replace("_", "-")} reuse potential.`,
      output: {
        material: ctx.batch.materialType,
        quantityKg: ctx.batch.quantityKg,
        conditionLevel: ctx.batch.conditionLevel,
        contaminationLevel: ctx.batch.contaminationLevel,
        reusePotential: ctx.batch.reusePotential,
        qualityIndex: data.qualityIndex
      }
    },
    data
  };
}

