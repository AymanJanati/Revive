"use client";

import type { BatchAttachment } from "../../../types/revive";
import { InlineAlert } from "@/components/ui/InlineAlert";
import { Skeleton } from "@/components/ui/Skeleton";
import { attachmentTypeLabel } from "@/lib/labels";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

function FileCard({ att }: { att: BatchAttachment }) {
  const href = att.fileUrl ?? att.previewUrl ?? null;
  const meta = [attachmentTypeLabel[att.type], att.mimeType].filter(Boolean).join(" | ");

  return (
    <div className="rounded-2xl border border-base-border bg-base-bg p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-base-text">{att.name}</p>
          <p className="mt-1 truncate text-[12px] font-light text-base-text2">{meta}</p>
        </div>
        {href ? (
          <Button size="sm" variant="secondary" onClick={() => window.open(href, "_blank", "noopener,noreferrer")}>
            Open
          </Button>
        ) : (
          <Button size="sm" variant="secondary" disabled>
            Open
          </Button>
        )}
      </div>

      {att.previewUrl && att.mimeType?.startsWith("image/") ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-base-border bg-base-bg2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={att.name} src={att.previewUrl} className={cn("h-40 w-full object-cover")} />
        </div>
      ) : null}
    </div>
  );
}

export function SupportingIntakeFiles({
  attachments,
  isLoading,
  isEmpty
}: {
  attachments: BatchAttachment[];
  isLoading: boolean;
  isEmpty: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Skeleton className="h-[92px]" />
        <Skeleton className="h-[92px]" />
      </div>
    );
  }

  if (isEmpty) {
    return <InlineAlert title="No Supporting Files" message="No attachments were provided with this intake." />;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {attachments.map((a) => (
        <FileCard key={a.id} att={a} />
      ))}
    </div>
  );
}
