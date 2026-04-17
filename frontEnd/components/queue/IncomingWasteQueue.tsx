"use client";

import type { QueueState } from "@/lib/console-state";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { InlineAlert } from "@/components/ui/InlineAlert";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { batchStatusLabel, materialTypeLabel } from "@/lib/labels";
import { formatIsoDateTime, formatKg } from "@/lib/format";

export function IncomingWasteQueue({
  queue,
  selectedId,
  onSelect,
  onRetry
}: {
  queue: QueueState;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRetry: () => void;
}) {
  return (
    <Card title="Incoming Waste Queue">
      {queue.kind === "loading" ? (
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : queue.kind === "error" ? (
        <InlineAlert title="Queue Unavailable" message={queue.message} tone="error" actionLabel="Retry" onAction={onRetry} />
      ) : queue.kind === "empty" ? (
        <InlineAlert title="No Incoming Batches" message="The queue is currently empty." actionLabel="Refresh" onAction={onRetry} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-base-border">
          <div className="grid grid-cols-12 gap-3 border-b border-base-border bg-base-bg2 px-4 py-3 text-[12px] font-light text-base-text2">
            <div className="col-span-3">Batch Code</div>
            <div className="col-span-3">Source Line</div>
            <div className="col-span-2">Material</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Status</div>
          </div>

          <ul className="divide-y divide-base-border">
            {queue.items.map((item) => {
              const isActive = item.id === selectedId;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    className={cn(
                      "group relative grid w-full grid-cols-12 items-center gap-3 px-4 py-3 text-left transition-colors",
                      "hover:bg-base-bg2",
                      isActive ? "bg-base-bg2" : "bg-base-bg"
                    )}
                  >
                    <span className={cn("absolute left-0 top-0 h-full w-1", isActive ? "[background:var(--revive-gradient)]" : "bg-transparent")} />

                    <div className="col-span-3 min-w-0">
                      <p className="truncate text-[14px] font-semibold text-base-text">{item.batchCode}</p>
                      <p className="truncate text-[12px] font-light text-base-text2">{formatIsoDateTime(item.intakeDate)}</p>
                    </div>
                    <div className="col-span-3 min-w-0">
                      <p className="truncate text-[13px] font-light text-base-text">{item.sourceLine}</p>
                    </div>
                    <div className="col-span-2 min-w-0">
                      <p className="truncate text-[13px] font-light text-base-text">{materialTypeLabel[item.materialType]}</p>
                    </div>
                    <div className="col-span-2 min-w-0">
                      <p className="truncate text-[13px] font-light text-base-text">{formatKg(item.quantityKg)}</p>
                    </div>
                    <div className="col-span-2 min-w-0">
                      <Badge
                        tone={item.status === "ROUTING_RECOMMENDED" ? "low" : item.status === "UNDER_EVALUATION" ? "medium" : "neutral"}
                      >
                        {batchStatusLabel[item.status]}
                      </Badge>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Card>
  );
}
