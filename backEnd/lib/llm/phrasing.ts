import type { AnalysisResult } from "@/types/revive";
import { geminiGenerateJson, hasGeminiKey } from "@/lib/llm/geminiClient";

type PhrasingJson = {
  finalDecisionExplanation: string;
  agentReasoning: {
    BATCH_UNDERSTANDING_AGENT: string;
    VALUE_AGENT: string;
    IMPACT_AGENT: string;
    ARBITER_AGENT: string;
  };
};

export async function maybePolishPhrasing(result: AnalysisResult): Promise<AnalysisResult> {
  if (!hasGeminiKey()) return result;

  const prompt = [
    "You are writing concise, professional phrasing for an internal textile waste routing console.",
    "Return ONLY valid JSON matching this schema:",
    "{",
    '  "finalDecisionExplanation": string,',
    '  "agentReasoning": {',
    '    "BATCH_UNDERSTANDING_AGENT": string,',
    '    "VALUE_AGENT": string,',
    '    "IMPACT_AGENT": string,',
    '    "ARBITER_AGENT": string',
    "  }",
    "}",
    "",
    "Constraints:",
    "- Keep each string 1-2 sentences, operational tone, no hype, no emojis.",
    "- Do not change numeric values or enum identifiers.",
    "",
    "Context (do not echo verbatim):",
    `- routingOutcome: ${result.finalDecision.routingOutcome}`,
    `- partnerType: ${result.finalDecision.partnerType}`,
    `- destination: ${result.finalDecision.recommendedDestination}`,
    `- businessScore: ${result.finalDecision.businessScore}`,
    `- impactScore: ${result.finalDecision.impactScore}`,
    `- confidence: ${result.finalDecision.confidence}`,
    `- nextAction: ${result.finalDecision.nextAction}`
  ].join("\n");

  try {
    const phrasing = await geminiGenerateJson<PhrasingJson>(prompt, { timeoutMs: 3000 });

    const updated: AnalysisResult = {
      ...result,
      timeline: result.timeline.map((t) => {
        const agentReasoning =
          t.agent === "BATCH_UNDERSTANDING_AGENT"
            ? phrasing.agentReasoning.BATCH_UNDERSTANDING_AGENT
            : t.agent === "VALUE_AGENT"
              ? phrasing.agentReasoning.VALUE_AGENT
              : t.agent === "IMPACT_AGENT"
                ? phrasing.agentReasoning.IMPACT_AGENT
                : phrasing.agentReasoning.ARBITER_AGENT;
        return { ...t, reasoning: agentReasoning };
      }),
      finalDecision: {
        ...result.finalDecision,
        explanation: phrasing.finalDecisionExplanation
      }
    };

    return updated;
  } catch {
    // Demo-safe: if Gemini fails, keep deterministic phrasing.
    return result;
  }
}

