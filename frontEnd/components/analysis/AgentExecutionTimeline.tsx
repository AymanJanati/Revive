"use client";

import { useEffect, useState } from "react";
import type { AnalysisState } from "@/lib/console-state";
import type { AgentExecutionStatus, AgentName, AnalysisTimelineItem } from "../../../types/revive";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { agentNameLabel } from "@/lib/labels";
import { formatIsoDateTime, safeEntries } from "@/lib/format";
import { cn } from "@/lib/cn";

const agentOrder: AgentName[] = ["BATCH_UNDERSTANDING_AGENT", "VALUE_AGENT", "IMPACT_AGENT", "ARBITER_AGENT"];

function statusTone(status: AgentExecutionStatus) {
  if (status === "COMPLETED") return "low";
  if (status === "FAILED") return "high";
  if (status === "RUNNING") return "gradient";
  return "neutral";
}

function statusLabel(status: AgentExecutionStatus) {
  if (status === "PENDING") return "Pending";
  if (status === "RUNNING") return "Running";
  if (status === "COMPLETED") return "Completed";
  return "Failed";
}

function OutputGrid({ output }: { output: Record<string, unknown> }) {
  const entries = safeEntries(output);
  if (entries.length === 0) return null;
  return (
    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
      {entries.slice(0, 6).map(([k, v]) => (
        <div key={k} className="rounded-2xl border border-base-border bg-base-bg2 px-3 py-2">
          <p className="text-[12px] font-light text-base-text2">{k}</p>
          <p className="truncate text-[13px] font-semibold text-base-text">{typeof v === "string" ? v : JSON.stringify(v)}</p>
        </div>
      ))}
    </div>
  );
}

function TimelineItemCard({ item }: { item: AnalysisTimelineItem }) {
  return (
    <div className="rounded-2xl border border-base-border bg-base-bg p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-base-text">{agentNameLabel[item.agent]}</p>
          <p className="mt-1 text-[13px] font-light text-base-text2">{item.message}</p>
        </div>
        <Badge tone={statusTone(item.status)}>{statusLabel(item.status)}</Badge>
      </div>

      <p className="mt-3 text-[13px] font-light text-base-text">{item.reasoning}</p>
      <OutputGrid output={item.output} />
    </div>
  );
}

function buildSimulatedTimeline(stepIndex: number): AnalysisTimelineItem[] {
  const messages = [
    {
      message: "Parsing intake record and structuring batch profile.",
      reasoning: "Normalizing material, condition, contamination, and reuse indicators.",
      output: {}
    },
    {
      message: "Evaluating commercial value and buyer fit.",
      reasoning: "Estimating value score based on market demand and batch quality.",
      output: {}
    },
    {
      message: "Evaluating sustainability and social reuse potential.",
      reasoning: "Assessing impact score and potential cooperative pathways.",
      output: {}
    },
    {
      message: "Resolving routing trade-offs and issuing final recommendation.",
      reasoning: "Arbitrating between value and impact to produce one deterministic route.",
      output: {}
    }
  ];

  return agentOrder.map((agent, idx) => {
    let status: AgentExecutionStatus = "PENDING";
    if (idx < stepIndex) status = "COMPLETED";
    else if (idx === stepIndex) status = "RUNNING";
    return { agent, status, ...messages[idx] } as AnalysisTimelineItem;
  });
}

export function AgentExecutionTimeline({
  state,
  isForBatchId
}: {
  state: AnalysisState;
  isForBatchId?: string;
}) {
  // For non-streaming mode, we simulate the progressive flow locally while awaiting the backend response.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (state.kind !== "running") return;
    const t = setInterval(() => setTick((x) => x + 1), 300);
    return () => clearInterval(t);
  }, [state.kind]);
  void tick;

  const runningStep =
    state.kind === "running"
      ? Math.min(3, Math.floor((Date.now() - new Date(state.startedAtIso).getTime()) / 1200))
      : 0;

  const subtitle =
    state.kind === "ready"
      ? `Completed for batch ${state.result.batchId}`
      : state.kind === "running"
        ? `Running for batch ${state.batchId}`
        : isForBatchId
          ? `Ready for batch ${isForBatchId}`
          : "Select a batch to begin";

  return (
    <Card title="Agent Execution Timeline" right={<p className="text-[12px] font-light text-base-text2">{subtitle}</p>} className="overflow-hidden">
      {state.kind === "idle" ? (
        <div className="rounded-2xl border border-base-border bg-base-bg2 p-4">
          <p className="text-[13px] font-semibold text-base-text">Awaiting Analysis</p>
          <p className="mt-1 text-[13px] font-light text-base-text2">
            Launch autonomous analysis to view the 4-agent execution flow and final routing recommendation.
          </p>
        </div>
      ) : null}

      {state.kind === "running" ? (
        <div className="space-y-3">
          {buildSimulatedTimeline(runningStep).map((item) => (
            <TimelineItemCard key={item.agent} item={item} />
          ))}
        </div>
      ) : null}

      {state.kind === "error" ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-[13px] font-semibold text-rose-900">Execution halted</p>
          <p className="mt-1 text-[13px] font-light text-rose-800">{state.message}</p>
        </div>
      ) : null}

      {state.kind === "ready" ? (
        <div className="space-y-3">
          {agentOrder.map((agent) => {
            const item = state.result.timeline.find((t) => t.agent === agent);
            if (!item) {
              return (
                <div key={agent} className="rounded-2xl border border-base-border bg-base-bg p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[14px] font-semibold text-base-text">{agentNameLabel[agent]}</p>
                    <Badge tone="neutral">Pending</Badge>
                  </div>
                  <div className="mt-3">
                    <Skeleton className="h-4 w-10/12" />
                    <Skeleton className="mt-2 h-4 w-8/12" />
                  </div>
                </div>
              );
            }
            return <TimelineItemCard key={agent} item={item} />;
          })}

          <div className={cn("rounded-2xl border border-base-border bg-base-bg2 p-4")}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] font-semibold text-base-text">Execution Window</p>
              <Badge tone="gradient">
                {formatIsoDateTime(state.result.startedAt)} to {formatIsoDateTime(state.result.completedAt)}
              </Badge>
            </div>
            <p className="mt-1 text-[13px] font-light text-base-text2">Execution timestamps are derived from backend ISO values.</p>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
