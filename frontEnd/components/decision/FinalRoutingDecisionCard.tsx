"use client";

import type { AnalysisResult } from "../../../types/revive";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { confidenceLabel, partnerTypeLabel, routingOutcomeLabel } from "@/lib/labels";
import { formatScore } from "@/lib/format";

function ScoreBar({ label, value }: { label: string; value: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-light text-base-text2">{label}</p>
        <p className="text-[13px] font-semibold text-base-text">{formatScore(v)}</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full border border-base-border bg-base-bg">
        <div className="h-full [background:var(--revive-gradient)]" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

export function FinalRoutingDecisionCard({ result }: { result: AnalysisResult | null }) {
  return (
    <Card title="Final Routing Decision Card" className="relative overflow-hidden">
      <div className="absolute left-0 top-0 h-1 w-full [background:var(--revive-gradient)]" />

      {!result ? (
        <div className="rounded-2xl border border-base-border bg-base-bg2 p-4">
          <p className="text-[13px] font-semibold text-base-text">No routing decision yet</p>
          <p className="mt-1 text-[13px] font-light text-base-text2">Launch autonomous analysis to generate a recommendation.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[20px] font-bold text-base-text">{routingOutcomeLabel[result.finalDecision.routingOutcome]}</p>
              <p className="mt-1 text-[14px] font-light text-base-text2">Recommended Destination</p>
              <p className="truncate text-[16px] font-semibold text-base-text">{result.finalDecision.recommendedDestination}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="gradient">{partnerTypeLabel[result.finalDecision.partnerType]}</Badge>
              <Badge
                tone={
                  result.finalDecision.confidence === "HIGH"
                    ? "low"
                    : result.finalDecision.confidence === "MEDIUM"
                      ? "medium"
                      : "high"
                }
              >
                Confidence: {confidenceLabel[result.finalDecision.confidence]}
              </Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-base-border bg-base-bg2 p-4">
            <p className="text-[12px] font-light text-base-text2">Explanation</p>
            <p className="mt-1 text-[14px] font-light text-base-text">{result.finalDecision.explanation}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ScoreBar label="Business Score" value={result.finalDecision.businessScore} />
            <ScoreBar label="Impact Score" value={result.finalDecision.impactScore} />
          </div>

          <div className="rounded-2xl border border-base-border bg-base-bg2 p-4">
            <p className="text-[12px] font-light text-base-text2">Next Action</p>
            <p className="mt-1 text-[14px] font-semibold text-base-text">{result.finalDecision.nextAction}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
