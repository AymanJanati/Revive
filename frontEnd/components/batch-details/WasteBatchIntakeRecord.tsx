"use client";

import type { BatchState } from "@/lib/console-state";
import { InlineAlert } from "@/components/ui/InlineAlert";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  batchStatusLabel,
  conditionLevelLabel,
  contaminationLevelLabel,
  materialTypeLabel,
  reusePotentialLabel
} from "@/lib/labels";
import { formatIsoDateTime, formatKg } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-base-border bg-base-bg2 p-4">
      <p className="text-[12px] font-light text-base-text2">{label}</p>
      <div className="mt-1 text-[14px] font-semibold text-base-text">{value}</div>
    </div>
  );
}

export function WasteBatchIntakeRecord({ state, onRetry }: { state: BatchState; onRetry: () => void }) {
  if (state.kind === "idle") {
    return (
      <p className="text-[14px] font-light text-base-text2">
        Select a batch from the Incoming Waste Queue to view the full intake record.
      </p>
    );
  }

  if (state.kind === "loading") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-[72px]" />
        <Skeleton className="h-[72px]" />
        <Skeleton className="h-[72px]" />
        <Skeleton className="h-[72px]" />
        <Skeleton className="h-[72px]" />
        <Skeleton className="h-[72px]" />
      </div>
    );
  }

  if (state.kind === "error") {
    return <InlineAlert title="Intake Record Unavailable" message={state.message} tone="error" actionLabel="Retry" onAction={onRetry} />;
  }

  const b = state.batch;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Batch Code" value={b.batchCode} />
        <Field label="Source Production Line" value={b.sourceLine} />
        <Field label="Material Type" value={materialTypeLabel[b.materialType]} />
        <Field label="Quantity" value={formatKg(b.quantityKg)} />
        <Field label="Condition Level" value={conditionLevelLabel[b.conditionLevel]} />
        <Field label="Contamination Level" value={contaminationLevelLabel[b.contaminationLevel]} />
        <Field label="Reuse Potential" value={reusePotentialLabel[b.reusePotential]} />
        <Field label="Market Demand" value={`${b.marketDemand}/100`} />
        <Field label="Warehouse Pressure" value={`${b.warehousePressure}/100`} />
        <Field label="Intake Timestamp" value={formatIsoDateTime(b.intakeDate)} />
        <Field
          label="Current Status"
          value={
            <Badge tone={b.status === "ROUTING_RECOMMENDED" ? "low" : b.status === "UNDER_EVALUATION" ? "medium" : "neutral"}>
              {batchStatusLabel[b.status]}
            </Badge>
          }
        />
      </div>

      <div className="rounded-2xl border border-base-border bg-base-bg2 p-4">
        <p className="text-[12px] font-light text-base-text2">Operator Note</p>
        <p className="mt-1 whitespace-pre-wrap text-[14px] font-light text-base-text">{b.notes}</p>
      </div>
    </div>
  );
}
