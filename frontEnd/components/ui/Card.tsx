"use client";

import { cn } from "@/lib/cn";

export function Card({
  title,
  right,
  children,
  className
}: {
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-base-border bg-base-bg shadow-[0_1px_2px_rgba(15,23,42,0.05)]",
        className
      )}
    >
      {(title || right) && (
        <div className="flex items-center justify-between gap-4 border-b border-base-border px-6 py-4">
          <div className="min-w-0">
            {title ? <h2 className="truncate text-[16px] font-semibold text-base-text">{title}</h2> : null}
          </div>
          {right ? <div className="shrink-0">{right}</div> : null}
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
