export function formatKg(value: number) {
  return `${Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value)} kg`;
}

export function formatScore(value: number) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return `${clamped}/100`;
}

export function formatCurrencyEstimate(value: number) {
  // Contract does not specify currency; keep it as a neutral numeric estimate.
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
}

export function formatIsoDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.valueOf())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(d);
}

export function safeEntries(obj: Record<string, unknown>) {
  return Object.entries(obj).filter(([k]) => k && k.trim().length > 0);
}

