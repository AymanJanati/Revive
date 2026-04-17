"use client";

import type { ValueSnapshot } from "../../../types/revive";
import { Card } from "@/components/ui/Card";
import { InlineAlert } from "@/components/ui/InlineAlert";
import { formatCurrencyEstimate, formatKg } from "@/lib/format";

function SnapshotItem({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-base-border bg-base-bg2 p-4">
      <p className="text-[12px] font-light text-base-text2">{label}</p>
      <p className="mt-1 text-[28px] font-extrabold leading-[30px] text-base-text">{value}</p>
      {hint ? <p className="mt-2 text-[12px] font-light text-base-text2">{hint}</p> : null}
    </div>
  );
}

export function CompactValueSnapshot({ snapshot }: { snapshot: ValueSnapshot | null }) {
  return (
    <Card title="Compact Value Snapshot">
      {!snapshot ? (
        <InlineAlert title="No snapshot available" message="Run autonomous analysis to generate the value and impact snapshot." />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          <SnapshotItem
            label="Recoverable Value Estimate"
            value={formatCurrencyEstimate(snapshot.recoverableValueEstimate)}
            hint="Estimated recoverable value (unitless)"
          />
          <SnapshotItem label="Waste Diverted" value={formatKg(snapshot.wasteDivertedKg)} />
          <SnapshotItem label="Social Reuse Potential" value={snapshot.socialReusePotential} />
          <SnapshotItem label="Sustainability Contribution" value={snapshot.sustainabilityContribution} />
        </div>
      )}
    </Card>
  );
}
