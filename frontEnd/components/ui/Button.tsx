"use client";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

export function Button({
  variant = "secondary",
  size = "md",
  disabled,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";
  const sizeCls = size === "sm" ? "h-9 px-3 text-[13px] rounded-[14px]" : "h-11 px-4 text-[14px] rounded-[14px]";

  const variantCls =
    variant === "primary"
      ? "text-white [background:var(--revive-gradient)] hover:brightness-[1.03]"
      : variant === "ghost"
        ? "bg-transparent text-base-text hover:bg-base-bg2"
        : "border border-base-border bg-base-bg text-base-text hover:bg-base-bg2";

  return <button disabled={disabled} className={cn(base, sizeCls, variantCls, className)} {...props} />;
}
