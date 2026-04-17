import { WasteBatch, PartnerProfile } from "../types";

export const seedBatches: WasteBatch[] = [
  {
    id: "1",
    batchCode: "TX-2041",
    sourceLine: "Line A - Cutting",
    materialType: "COTTON_POLY_BLEND",
    quantityKg: 180,
    conditionLevel: "MEDIUM",
    contaminationLevel: "LOW",
    reusePotential: "MEDIUM_HIGH",
    marketDemand: 74,
    warehousePressure: 42,
    intakeDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    status: "AWAITING_ANALYSIS",
    notes: "Mixed cotton-poly offcuts from garment finishing. Mostly clean, minimal floor dust.",
    attachments: [
      {
        id: "att-1",
        name: "Intake Sheet.pdf",
        type: "INTAKE_SHEET",
        fileUrl: "/mock/intake-sheet-tx-2041.pdf",
        mimeType: "application/pdf"
      },
      {
        id: "att-2",
        name: "Operator Note.txt",
        type: "OPERATOR_NOTE",
        fileUrl: "/mock/operator-note-tx-2041.txt",
        mimeType: "text/plain"
      }
    ]
  },
  {
    id: "2",
    batchCode: "TX-2042",
    sourceLine: "Line C - Assembly",
    materialType: "DENIM",
    quantityKg: 450,
    conditionLevel: "HIGH",
    contaminationLevel: "LOW",
    reusePotential: "HIGH",
    marketDemand: 92,
    warehousePressure: 60,
    intakeDate: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    status: "AWAITING_ANALYSIS",
    notes: "Premium unwashed denim scraps. Highly desirable for resale to automotive insulation buyers or boutique recyclers.",
    attachments: [
      {
        id: "att-3",
        name: "Batch Image.jpg",
        type: "BATCH_IMAGE",
        fileUrl: "/mock/batch-image-tx-2042.jpg",
        mimeType: "image/jpeg"
      }
    ]
  },
  {
    id: "3",
    batchCode: "TX-2043",
    sourceLine: "Line B - Dyeing",
    materialType: "MIXED_TEXTILE",
    quantityKg: 85,
    conditionLevel: "LOW",
    contaminationLevel: "HIGH",
    reusePotential: "LOW",
    marketDemand: 15,
    warehousePressure: 85,
    intakeDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    status: "AWAITING_ANALYSIS",
    notes: "Heavily chemically contaminated mixed wet scraps. Needs specialized disposal or high-heat energy recovery.",
    attachments: [
      {
        id: "att-4",
        name: "Hazard Declaration.pdf",
        type: "MATERIAL_DECLARATION",
        fileUrl: "/mock/declaration-tx-2043.pdf",
        mimeType: "application/pdf"
      }
    ]
  },
  {
    id: "4",
    batchCode: "TX-2044",
    sourceLine: "Line D - Sorting",
    materialType: "COTTON",
    quantityKg: 210,
    conditionLevel: "MEDIUM",
    contaminationLevel: "MEDIUM",
    reusePotential: "HIGH",
    marketDemand: 45,
    warehousePressure: 30,
    intakeDate: new Date().toISOString(), // Now
    status: "AWAITING_ANALYSIS",
    notes: "100% Cotton knit waste. Contains some irregular colors. Moderate market demand, but excellent candidate for local social cooperative stuffing materials.",
    attachments: [
      {
        id: "att-5",
        name: "Intake Sheet.pdf",
        type: "INTAKE_SHEET",
        fileUrl: "/mock/intake-sheet-tx-2044.pdf",
        mimeType: "application/pdf"
      }
    ]
  }
];

export const seedPartners: PartnerProfile[] = [
  {
    id: "p1",
    partnerName: "ThreadCycle Industrial Buyer",
    partnerType: "INDUSTRIAL_BUYER",
    acceptedMaterials: ["DENIM", "COTTON", "POLYESTER", "COTTON_POLY_BLEND"],
    valueProfile: 90,
    impactProfile: 40,
    operationalConstraints: ["Min 200kg pickup", "Must be low contamination"]
  },
  {
    id: "p2",
    partnerName: "Cooperative Atlas Reuse",
    partnerType: "COOPERATIVE",
    acceptedMaterials: ["COTTON", "WOOL_BLEND", "MIXED_TEXTILE"],
    valueProfile: 30,
    impactProfile: 95,
    operationalConstraints: ["Accepts irregular colors", "Social enterprise certification"]
  },
  {
    id: "p3",
    partnerName: "EcoFiber Recovery Unit",
    partnerType: "RECOVERY_UNIT",
    acceptedMaterials: ["MIXED_TEXTILE", "OTHER"],
    valueProfile: 10,
    impactProfile: 60,
    operationalConstraints: ["Specialize in high contamination destruction"]
  }
];
