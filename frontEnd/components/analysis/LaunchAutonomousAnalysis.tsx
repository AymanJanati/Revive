"use client";

import type { AnalysisState } from "@/lib/console-state";
import type { BatchStatus } from "../../../types/revive";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InlineAlert } from "@/components/ui/InlineAlert";
import { Badge } from "@/components/ui/Badge";
import { batchStatusLabel } from "@/lib/labels";

export function LaunchAutonomousAnalysis({
  disabled,
  batchStatus,
  analysisState,
  onLaunch,
  onRetry
}: {
  disabled: boolean;
  batchStatus: BatchStatus | undefined;
  analysisState: AnalysisState;
  onLaunch: () => void;
  onRetry: () => void;
}) {
  return (
    <Card
      title="Launch Autonomous Analysis"
      right={
        batchStatus ? (
          <Badge tone={batchStatus === "ROUTING_RECOMMENDED" ? "low" : batchStatus === "UNDER_EVALUATION" ? "medium" : "neutral"}>
            {batchStatusLabel[batchStatus]}
          </Badge>
        ) : null
      }
      className="overflow-hidden"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[14px] font-light text-base-text2">
            Start the 4-agent analysis flow to produce a deterministic routing recommendation for this waste batch.
          </p>
        </div>
        <div className="shrink-0">
          <Button variant="primary" disabled={disabled} onClick={onLaunch}>
            Launch Autonomous Analysis
          </Button>
        </div>
      </div>

      {analysisState.kind === "running" ? (
        <div className="mt-4 rounded-2xl border border-base-border bg-base-bg2 p-4">
          <p className="text-[13px] font-semibold text-base-text">Analysis in progress</p>
          <p className="mt-1 text-[13px] font-light text-base-text2">
            Parsing intake record, structuring batch profile, and resolving routing trade-offs.
          </p>
        </div>
      ) : null}

      {analysisState.kind === "error" ? (
        <div className="mt-4">
          <InlineAlert title="Analysis Failed" message={analysisState.message} tone="error" actionLabel="Retry Analysis" onAction={onRetry} />
        </div>
      ) : null}
    </Card>
  );
}
