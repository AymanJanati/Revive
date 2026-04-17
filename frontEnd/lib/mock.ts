import type { AnalysisResult, WasteBatch, WasteBatchQueueItem } from "../../types/revive";

// Seeded fallback data (contract-safe) for frontend development when `/api/*` is not available yet.
// This is not meant to replace backend seeded data; it only prevents the UI from being blank in early stages.

export const seededQueue: WasteBatchQueueItem[] = [
  {
    id: "1",
    batchCode: "TX-2041",
    sourceLine: "Line A - Cutting",
    materialType: "COTTON_POLY_BLEND",
    quantityKg: 180,
    intakeDate: "2026-04-17T09:00:00.000Z",
    status: "AWAITING_ANALYSIS"
  },
  {
    id: "2",
    batchCode: "DN-7712",
    sourceLine: "Line C - Denim Finishing",
    materialType: "DENIM",
    quantityKg: 240,
    intakeDate: "2026-04-17T09:25:00.000Z",
    status: "AWAITING_ANALYSIS"
  },
  {
    id: "3",
    batchCode: "MX-3308",
    sourceLine: "Line B - Sorting",
    materialType: "MIXED_TEXTILE",
    quantityKg: 310,
    intakeDate: "2026-04-17T09:40:00.000Z",
    status: "AWAITING_ANALYSIS"
  },
  {
    id: "4",
    batchCode: "WL-1180",
    sourceLine: "Line D - Knit & Trim",
    materialType: "WOOL_BLEND",
    quantityKg: 95,
    intakeDate: "2026-04-17T10:05:00.000Z",
    status: "AWAITING_ANALYSIS"
  }
];

const seededDetails: Record<string, WasteBatch> = {
  "1": {
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
  "2": {
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
  "3": {
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
  "4": {
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
  }
};

const seededAnalysis: Record<string, AnalysisResult> = {
  "1": {
    batchId: "1",
    startedAt: "2026-04-17T10:00:00.000Z",
    completedAt: "2026-04-17T10:00:06.000Z",
    batchStatus: "ROUTING_RECOMMENDED",
    timeline: [
      {
        agent: "BATCH_UNDERSTANDING_AGENT",
        status: "COMPLETED",
        message: "Structuring intake record and normalizing waste profile.",
        reasoning: "Material appears reusable with low contamination and moderate condition.",
        output: {
          material: "COTTON_POLY_BLEND",
          quantityKg: 180,
          conditionLevel: "MEDIUM",
          contaminationLevel: "LOW",
          reusePotential: "MEDIUM_HIGH"
        }
      },
      {
        agent: "VALUE_AGENT",
        status: "COMPLETED",
        message: "Evaluating commercial attractiveness.",
        reasoning: "Resale potential is acceptable and buyer fit is viable.",
        output: {
          valueScore: 78,
          recommendedRoute: "SELL"
        }
      },
      {
        agent: "IMPACT_AGENT",
        status: "COMPLETED",
        message: "Evaluating sustainability and social reuse potential.",
        reasoning: "Higher downstream reuse value exists through a cooperative route.",
        output: {
          impactScore: 85,
          recommendedRoute: "REDIRECT_TO_COOPERATIVE"
        }
      },
      {
        agent: "ARBITER_AGENT",
        status: "COMPLETED",
        message: "Resolving trade-offs and issuing final routing decision.",
        reasoning: "Business value is moderate, but overall impact is significantly better through cooperative reuse.",
        output: {
          finalRoute: "REDIRECT_TO_COOPERATIVE",
          confidence: "HIGH",
          nextAction: "Prepare batch for cooperative dispatch"
        }
      }
    ],
    finalDecision: {
      recommendedDestination: "Cooperative Atlas Reuse",
      partnerType: "COOPERATIVE",
      routingOutcome: "REDIRECT_TO_COOPERATIVE",
      explanation: "Moderate resale value but stronger total value through social reuse and sustainability benefit.",
      businessScore: 68,
      impactScore: 89,
      confidence: "HIGH",
      nextAction: "Prepare batch for cooperative dispatch"
    },
    valueSnapshot: {
      recoverableValueEstimate: 1200,
      wasteDivertedKg: 180,
      socialReusePotential: "HIGH",
      sustainabilityContribution: "STRONG"
    }
  },
  "2": {
    batchId: "2",
    startedAt: "2026-04-17T10:04:00.000Z",
    completedAt: "2026-04-17T10:04:07.000Z",
    batchStatus: "ROUTING_RECOMMENDED",
    timeline: [
      {
        agent: "BATCH_UNDERSTANDING_AGENT",
        status: "COMPLETED",
        message: "Structuring intake record and normalizing waste profile.",
        reasoning: "High condition, low contamination, and strong reuse potential.",
        output: {
          material: "DENIM",
          quantityKg: 240,
          conditionLevel: "HIGH",
          contaminationLevel: "LOW",
          reusePotential: "HIGH"
        }
      },
      {
        agent: "VALUE_AGENT",
        status: "COMPLETED",
        message: "Evaluating commercial attractiveness.",
        reasoning: "Buyer fit is strong and market demand is high.",
        output: {
          valueScore: 92,
          recommendedRoute: "SELL"
        }
      },
      {
        agent: "IMPACT_AGENT",
        status: "COMPLETED",
        message: "Evaluating sustainability and social reuse potential.",
        reasoning: "Direct resale preserves value with acceptable downstream impact.",
        output: {
          impactScore: 72,
          recommendedRoute: "SELL"
        }
      },
      {
        agent: "ARBITER_AGENT",
        status: "COMPLETED",
        message: "Resolving trade-offs and issuing final routing decision.",
        reasoning: "Both value and impact align toward a direct resale route.",
        output: {
          finalRoute: "SELL",
          confidence: "HIGH",
          nextAction: "Initiate buyer outreach and prepare loading"
        }
      }
    ],
    finalDecision: {
      recommendedDestination: "NorthBridge Industrial Buyer",
      partnerType: "INDUSTRIAL_BUYER",
      routingOutcome: "SELL",
      explanation: "High-value clean denim with strong buyer fit and stable demand.",
      businessScore: 90,
      impactScore: 74,
      confidence: "HIGH",
      nextAction: "Initiate buyer outreach and prepare loading"
    },
    valueSnapshot: {
      recoverableValueEstimate: 2600,
      wasteDivertedKg: 240,
      socialReusePotential: "MEDIUM",
      sustainabilityContribution: "HIGH"
    }
  },
  "3": {
    batchId: "3",
    startedAt: "2026-04-17T10:10:00.000Z",
    completedAt: "2026-04-17T10:10:08.000Z",
    batchStatus: "ROUTING_RECOMMENDED",
    timeline: [
      {
        agent: "BATCH_UNDERSTANDING_AGENT",
        status: "COMPLETED",
        message: "Structuring intake record and normalizing waste profile.",
        reasoning: "High contamination and low condition reduce viable reuse pathways.",
        output: {
          material: "MIXED_TEXTILE",
          quantityKg: 310,
          conditionLevel: "LOW",
          contaminationLevel: "HIGH",
          reusePotential: "LOW"
        }
      },
      {
        agent: "VALUE_AGENT",
        status: "COMPLETED",
        message: "Evaluating commercial attractiveness.",
        reasoning: "Low market demand and limited resale channels.",
        output: {
          valueScore: 22,
          recommendedRoute: "REJECT_SPECIALIZED_TREATMENT"
        }
      },
      {
        agent: "IMPACT_AGENT",
        status: "COMPLETED",
        message: "Evaluating sustainability and social reuse potential.",
        reasoning: "Specialized recovery is required to avoid downstream harm.",
        output: {
          impactScore: 41,
          recommendedRoute: "REJECT_SPECIALIZED_TREATMENT"
        }
      },
      {
        agent: "ARBITER_AGENT",
        status: "COMPLETED",
        message: "Resolving trade-offs and issuing final routing decision.",
        reasoning: "Given contamination and low condition, specialized treatment is the safest route.",
        output: {
          finalRoute: "REJECT_SPECIALIZED_TREATMENT",
          confidence: "HIGH",
          nextAction: "Schedule transfer to recovery unit"
        }
      }
    ],
    finalDecision: {
      recommendedDestination: "Sahara Recovery Unit",
      partnerType: "RECOVERY_UNIT",
      routingOutcome: "REJECT_SPECIALIZED_TREATMENT",
      explanation: "Contamination and low condition require controlled recovery and treatment.",
      businessScore: 18,
      impactScore: 46,
      confidence: "HIGH",
      nextAction: "Schedule transfer to recovery unit"
    },
    valueSnapshot: {
      recoverableValueEstimate: 320,
      wasteDivertedKg: 310,
      socialReusePotential: "LOW",
      sustainabilityContribution: "MEDIUM"
    }
  },
  "4": {
    batchId: "4",
    startedAt: "2026-04-17T10:18:00.000Z",
    completedAt: "2026-04-17T10:18:07.000Z",
    batchStatus: "ROUTING_RECOMMENDED",
    timeline: [
      {
        agent: "BATCH_UNDERSTANDING_AGENT",
        status: "COMPLETED",
        message: "Structuring intake record and normalizing waste profile.",
        reasoning: "Moderate contamination and constrained warehousing require a conservative route.",
        output: {
          material: "WOOL_BLEND",
          quantityKg: 95,
          conditionLevel: "MEDIUM",
          contaminationLevel: "MEDIUM",
          reusePotential: "MEDIUM"
        }
      },
      {
        agent: "VALUE_AGENT",
        status: "COMPLETED",
        message: "Evaluating commercial attractiveness.",
        reasoning: "Immediate resale is uncertain at current quality threshold.",
        output: {
          valueScore: 46,
          recommendedRoute: "STORE_TEMPORARILY"
        }
      },
      {
        agent: "IMPACT_AGENT",
        status: "COMPLETED",
        message: "Evaluating sustainability and social reuse potential.",
        reasoning: "Stabilizing the batch and reassessing can prevent unnecessary rejection.",
        output: {
          impactScore: 62,
          recommendedRoute: "STORE_TEMPORARILY"
        }
      },
      {
        agent: "ARBITER_AGENT",
        status: "COMPLETED",
        message: "Resolving trade-offs and issuing final routing decision.",
        reasoning: "Temporary storage enables sorting and a higher-confidence downstream route.",
        output: {
          finalRoute: "STORE_TEMPORARILY",
          confidence: "MEDIUM",
          nextAction: "Move to quarantine storage and schedule re-evaluation"
        }
      }
    ],
    finalDecision: {
      recommendedDestination: "Warehouse Holding Zone",
      partnerType: "WAREHOUSE",
      routingOutcome: "STORE_TEMPORARILY",
      explanation: "Moderate contamination with constrained operations suggests temporary storage and re-evaluation.",
      businessScore: 44,
      impactScore: 63,
      confidence: "MEDIUM",
      nextAction: "Move to quarantine storage and schedule re-evaluation"
    },
    valueSnapshot: {
      recoverableValueEstimate: 780,
      wasteDivertedKg: 95,
      socialReusePotential: "MEDIUM",
      sustainabilityContribution: "HIGH"
    }
  }
};

export function getSeededBatchDetails(id: string) {
  return seededDetails[id] ?? null;
}

export function getSeededAnalysis(batchId: string) {
  return seededAnalysis[batchId] ?? null;
}
