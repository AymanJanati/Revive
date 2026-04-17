import type { PartnerProfile } from "@/types/revive";

export const seededPartners: PartnerProfile[] = [
  {
    id: "p-1",
    partnerName: "NorthBridge Industrial Buyer",
    partnerType: "INDUSTRIAL_BUYER",
    acceptedMaterials: ["DENIM", "COTTON", "COTTON_POLY_BLEND"],
    valueProfile: 90,
    impactProfile: 70,
    operationalConstraints: ["Requires low contamination", "Minimum lot 120kg"]
  },
  {
    id: "p-2",
    partnerName: "Cooperative Atlas Reuse",
    partnerType: "COOPERATIVE",
    acceptedMaterials: ["COTTON_POLY_BLEND", "MIXED_TEXTILE", "WOOL_BLEND"],
    valueProfile: 65,
    impactProfile: 92,
    operationalConstraints: ["Sorting lead time up to 48h"]
  },
  {
    id: "p-3",
    partnerName: "Warehouse Holding Zone",
    partnerType: "WAREHOUSE",
    acceptedMaterials: ["COTTON", "POLYESTER", "WOOL_BLEND", "MIXED_TEXTILE"],
    valueProfile: 40,
    impactProfile: 62,
    operationalConstraints: ["Storage window up to 10 days"]
  },
  {
    id: "p-4",
    partnerName: "Sahara Recovery Unit",
    partnerType: "RECOVERY_UNIT",
    acceptedMaterials: ["MIXED_TEXTILE", "OTHER"],
    valueProfile: 20,
    impactProfile: 48,
    operationalConstraints: ["Handles high contamination", "Requires pre-transfer manifest"]
  }
];

