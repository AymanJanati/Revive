"use client";

import { cn } from "@/lib/cn";

type Tone = "neutral" | "low" | "medium" | "high" | "gradient";

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  const toneCls =
    tone === "gradient"
      ? "text-base-text bg-base-bg [background:linear-gradient(135deg,rgba(62,94,60,0.10),rgba(47,136,118,0.10),rgba(5,254,203,0.10))] border-base-border"
      : tone === "low"
        ? "bg-emerald-50 text-emerald-800 border-emerald-100"
        : tone === "medium"
          ? "bg-amber-50 text-amber-800 border-amber-100"
          : tone === "high"
            ? "bg-rose-50 text-rose-800 border-rose-100"
            : "bg-base-bg2 text-base-text border-base-border";

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] font-light", toneCls, className)}>
      {children}
    </span>
  );
}
