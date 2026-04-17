"use client";

import { cn } from "@/lib/cn";

function LogoMark() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-base-border bg-base-bg">
      <div className="h-6 w-6 rounded-xl [background:var(--revive-gradient)]" />
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-base-border bg-base-bg lg:block">
      <div className="flex h-16 items-center gap-3 px-5">
        <LogoMark />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-base-text">Revive</p>
          <p className="truncate text-[12px] font-light text-base-text2">Routing Console</p>
        </div>
      </div>

      <nav className="px-3 py-4">
        <a
          className={cn("flex items-center gap-3 rounded-2xl px-3 py-3 text-[13px] font-semibold", "bg-base-bg2 text-base-text")}
          href="#"
        >
          <span className="h-2.5 w-2.5 rounded-full [background:var(--revive-gradient)]" />
          Incoming Waste Queue
        </a>
      </nav>
    </aside>
  );
}
