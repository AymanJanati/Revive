import type { WasteBatch } from "@/types/revive";

export const seededBatches: WasteBatch[] = [
  {
    id: "1",
    batchCode: "TX-2041",
    sourceLine: "Line A - Cutting",
    materialType: "COTTON_POLY_BLEND",
    quantityKg: 180,
    conditionLevel: "MEDIUM",
    contaminationLevel: "LOW",
    reusePotential: "HIGH",
    marketDemand: 74,
    warehousePressure: 42,
    intakeDate: "2026-04-17T09:00:00.000Z",
    status: "AWAITING_ANALYSIS",
    notes: "Mixed cotton-poly offcuts from garment finishing.",
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
    batchCode: "DN-7712",
    sourceLine: "Line C - Denim Finishing",
    materialType: "DENIM",
    quantityKg: 240,
    conditionLevel: "HIGH",
    contaminationLevel: "LOW",
    reusePotential: "HIGH",
    marketDemand: 86,
    warehousePressure: 58,
    intakeDate: "2026-04-17T09:25:00.000Z",
    status: "AWAITING_ANALYSIS",
    notes: "Clean denim offcuts with consistent fiber profile and strong buyer fit.",
    attachments: [
      {
        id: "att-21",
        name: "Intake Sheet.pdf",
        type: "INTAKE_SHEET",
        fileUrl: "/mock/intake-sheet-dn-7712.pdf",
        mimeType: "application/pdf"
      },
      {
        id: "att-22",
        name: "Batch Image.jpg",
        type: "BATCH_IMAGE",
        previewUrl: "/mock/batch-image-dn-7712.jpg",
        mimeType: "image/jpeg"
      }
    ]
  },
  {
    id: "3",
    batchCode: "MX-3308",
    sourceLine: "Line B - Sorting",
    materialType: "MIXED_TEXTILE",
    quantityKg: 310,
    conditionLevel: "LOW",
    contaminationLevel: "HIGH",
    reusePotential: "LOW",
    marketDemand: 28,
    warehousePressure: 73,
    intakeDate: "2026-04-17T09:40:00.000Z",
    status: "AWAITING_ANALYSIS",
    notes: "Mixed textile with visible contamination and inconsistent composition; requires specialized handling.",
    attachments: [
      {
        id: "att-31",
        name: "Operator Note.txt",
        type: "OPERATOR_NOTE",
        fileUrl: "/mock/operator-note-mx-3308.txt",
        mimeType: "text/plain"
      },
      {
        id: "att-32",
        name: "Material Declaration.pdf",
        type: "MATERIAL_DECLARATION",
        fileUrl: "/mock/material-declaration-mx-3308.pdf",
        mimeType: "application/pdf"
      }
    ]
  },
  {
    id: "4",
    batchCode: "WL-1180",
    sourceLine: "Line D - Knit & Trim",
    materialType: "WOOL_BLEND",
    quantityKg: 95,
    conditionLevel: "MEDIUM",
    contaminationLevel: "MEDIUM",
    reusePotential: "MEDIUM",
    marketDemand: 54,
    warehousePressure: 88,
    intakeDate: "2026-04-17T10:05:00.000Z",
    status: "AWAITING_ANALYSIS",
    notes: "Wool blend trimmings; moderate contamination. Warehousing is constrained.",
    attachments: [
      {
        id: "att-41",
        name: "Intake Sheet.pdf",
        type: "INTAKE_SHEET",
        fileUrl: "/mock/intake-sheet-wl-1180.pdf",
        mimeType: "application/pdf"
      }
    ]
  },
  {
    id: "5",
    batchCode: "CT-9010",
    sourceLine: "Line A - Cutting",
    materialType: "COTTON",
    quantityKg: 50,
    conditionLevel: "HIGH",
    contaminationLevel: "LOW",
    reusePotential: "HIGH",
    marketDemand: 95,
    warehousePressure: 20,
    intakeDate: "2026-04-17T11:30:00.000Z",
    status: "AWAITING_ANALYSIS",
    notes: "High purity cotton offcuts. Extremely high resale value, but severe artisan material shortage reported locally.",
    attachments: [
      {
        id: "att-51",
        name: "Intake Sheet.pdf",
        type: "INTAKE_SHEET",
        fileUrl: "/mock/intake-sheet-ct-9010.pdf",
        mimeType: "application/pdf"
      },
      {
        id: "att-52",
        name: "Operator Note.txt",
        type: "OPERATOR_NOTE",
        fileUrl: "/mock/operator-note-ct-9010.txt",
        mimeType: "text/plain"
      }
    ]
  }
];

