"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function TopBar({ onRefresh }: { onRefresh: () => void }) {
  return (
    <header className="sticky top-0 z-10 border-b border-base-border bg-base-bg">
      <div className="mx-auto flex h-16 w-full max-w-[1480px] items-center justify-between gap-4 px-6">
        <div className="min-w-0">
          <p className="truncate text-[32px] font-extrabold leading-[34px] text-base-text">Revive</p>
          <p className="truncate text-[13px] font-light text-base-text2">Autonomous AI routing for textile waste valorization</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge tone="neutral">
            <span className="mr-2 inline-block h-2 w-2 rounded-full [background:var(--revive-gradient)]" />
            Status: System Online / 4 Agents Active
          </Badge>
          <Button size="sm" variant="secondary" onClick={onRefresh}>
            Refresh
          </Button>
        </div>
      </div>
    </header>
  );
}
