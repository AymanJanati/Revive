import { ApiError } from "@/lib/errors/apiError";
import { batchRepository } from "@/lib/repositories/batchRepository";
import type { AnalysisResult } from "@/types/revive";
import { geminiGenerateJson } from "@/lib/llm/geminiClient";

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
    batchRepository.setStatus(batchId, "UNDER_EVALUATION");

    try {
      const prompt = `
You are Revive, an autonomous AI routing console for textile waste.
Your job is to analyze this waste batch through 4 agents sequentially and output a final decision.
Waste Batch Context:
- Batch Code: ${batch.batchCode}
- Material: ${batch.materialType}
- Quantity: ${batch.quantityKg} kg
- Condition Level: ${batch.conditionLevel}
- Contamination Level: ${batch.contaminationLevel}
- Reuse Potential: ${batch.reusePotential}
- Market Demand: ${batch.marketDemand}/100
- Warehouse Pressure: ${batch.warehousePressure}/100

Generate a valid JSON object matching exactly this structure:
{
  "batchStatus": "ROUTING_RECOMMENDED",
  "timeline": [
    {
      "agent": "BATCH_UNDERSTANDING_AGENT",
      "status": "COMPLETED",
      "message": "...",
      "reasoning": "...",
      "output": {}
    },
    { "agent": "VALUE_AGENT", "status": "COMPLETED", "message": "...", "reasoning": "...", "output": {} },
    { "agent": "IMPACT_AGENT", "status": "COMPLETED", "message": "...", "reasoning": "...", "output": {} },
    { "agent": "ARBITER_AGENT", "status": "COMPLETED", "message": "...", "reasoning": "...", "output": {} }
  ],
  "decisionConflict": {
    "valueAgentRecommendation": "SELL" | "REDIRECT_TO_COOPERATIVE" | "STORE_TEMPORARILY" | "REJECT_SPECIALIZED_TREATMENT",
    "valueAgentReasoning": "...",
    "impactAgentRecommendation": "SELL" | "REDIRECT_TO_COOPERATIVE" | "STORE_TEMPORARILY" | "REJECT_SPECIALIZED_TREATMENT",
    "impactAgentReasoning": "...",
    "hasConflict": true,
    "resolutionRationale": "..."
  },
  "finalDecision": {
    "recommendedDestination": "Name of Buyer or Cooperative",
    "partnerType": "INDUSTRIAL_BUYER" | "COOPERATIVE" | "RECOVERY_UNIT" | "WAREHOUSE",
    "routingOutcome": "SELL" | "REDIRECT_TO_COOPERATIVE" | "STORE_TEMPORARILY" | "REJECT_SPECIALIZED_TREATMENT",
    "explanation": "Short sentence explaining why.",
    "businessScore": 0-100,
    "impactScore": 0-100,
    "confidence": "LOW" | "MEDIUM" | "HIGH",
    "nextAction": "Action instruction for operator.",
    "rejectedRoutes": [
      { "route": "SELL" | "REDIRECT_TO_COOPERATIVE" | "STORE_TEMPORARILY" | "REJECT_SPECIALIZED_TREATMENT", "reason": "Why this was rejected." }
    ]
  },
  "valueSnapshot": {
    "recoverableValueEstimate": number,
    "wasteDivertedKg": ${batch.quantityKg},
    "socialReusePotential": "LOW" | "MEDIUM" | "HIGH",
    "sustainabilityContribution": "LOW" | "MEDIUM" | "HIGH" | "STRONG",
    "urgencyLevel": "IMMEDIATE" | "STANDARD" | "LOW",
    "destinationFitScore": 0-100
  }
}

Constraint: Do not return trailing commas or markdown wrappers. Only pure JSON matching the above interface exactly.
`;

      const aiResponse = await geminiGenerateJson<any>(prompt, { timeoutMs: 45000 });
      
      batchRepository.setStatus(batchId, aiResponse.batchStatus || "ROUTING_RECOMMENDED");

      const completedAt = new Date();
      const result: AnalysisResult = {
        batchId,
        startedAt: startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        batchStatus: aiResponse.batchStatus || "ROUTING_RECOMMENDED",
        timeline: aiResponse.timeline,
        decisionConflict: aiResponse.decisionConflict,
        finalDecision: aiResponse.finalDecision,
        valueSnapshot: aiResponse.valueSnapshot
      };

      return result;
    } catch (e) {
      batchRepository.setStatus(batchId, "AWAITING_ANALYSIS");
      console.error(e);
      if (e instanceof ApiError) throw e;
      throw new ApiError("ANALYSIS_FAILED", "Analysis failed for the requested batch.", 500);
    }
  }
}

export const analysisService = new AnalysisService();
