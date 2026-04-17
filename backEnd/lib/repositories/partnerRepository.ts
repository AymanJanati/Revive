import { seededPartners } from "@/lib/seed/partners";
import type { PartnerProfile, PartnerType, RoutingOutcome } from "@/types/revive";

export class PartnerRepository {
  listAll(): PartnerProfile[] {
    return seededPartners.map((partner) => ({ ...partner, acceptedMaterials: [...partner.acceptedMaterials], operationalConstraints: [...partner.operationalConstraints] }));
  }

  findPreferredByOutcome(outcome: RoutingOutcome): PartnerProfile {
    const map: Record<RoutingOutcome, PartnerType> = {
      SELL: "INDUSTRIAL_BUYER",
      REDIRECT_TO_COOPERATIVE: "COOPERATIVE",
      STORE_TEMPORARILY: "WAREHOUSE",
      REJECT_SPECIALIZED_TREATMENT: "RECOVERY_UNIT"
    };
    const partnerType = map[outcome];
    const found = seededPartners.find((partner) => partner.partnerType === partnerType);
    if (!found) {
      // Seed guarantees this exists. Fallback keeps service deterministic.
      return seededPartners[0];
    }
    return {
      ...found,
      acceptedMaterials: [...found.acceptedMaterials],
      operationalConstraints: [...found.operationalConstraints]
    };
  }
}

export const partnerRepository = new PartnerRepository();

