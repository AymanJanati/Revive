"use client";

import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

export function InlineAlert({
  title,
  message,
  tone = "neutral",
  actionLabel,
  onAction
}: {
  title: string;
  message: string;
  tone?: "neutral" | "error";
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        tone === "error" ? "border-rose-200 bg-rose-50" : "border-base-border bg-base-bg2"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={cn("text-[13px] font-semibold", tone === "error" ? "text-rose-900" : "text-base-text")}>{title}</p>
          <p className={cn("mt-1 text-[13px] font-light", tone === "error" ? "text-rose-800" : "text-base-text2")}>{message}</p>
        </div>
        {actionLabel && onAction ? (
          <Button size="sm" variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
