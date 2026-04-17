import type {
  AgentName,
  AttachmentType,
  BatchStatus,
  ConditionLevel,
  ConfidenceLevel,
  ContaminationLevel,
  MaterialType,
  PartnerType,
  ReusePotential,
  RoutingOutcome
} from "../../types/revive";

export const batchStatusLabel: Record<BatchStatus, string> = {
  AWAITING_ANALYSIS: "Awaiting Analysis",
  UNDER_EVALUATION: "Under Evaluation",
  ROUTING_RECOMMENDED: "Routing Recommended"
};

export const routingOutcomeLabel: Record<RoutingOutcome, string> = {
  SELL: "Sell",
  REDIRECT_TO_COOPERATIVE: "Redirect to Cooperative",
  STORE_TEMPORARILY: "Store Temporarily",
  REJECT_SPECIALIZED_TREATMENT: "Reject / Specialized Treatment"
};

export const agentNameLabel: Record<AgentName, string> = {
  BATCH_UNDERSTANDING_AGENT: "Batch Understanding Agent",
  VALUE_AGENT: "Value Agent",
  IMPACT_AGENT: "Impact Agent",
  ARBITER_AGENT: "Arbiter Agent"
};

export const materialTypeLabel: Record<MaterialType, string> = {
  COTTON: "Cotton",
  POLYESTER: "Polyester",
  COTTON_POLY_BLEND: "Cotton-Poly Blend",
  DENIM: "Denim",
  MIXED_TEXTILE: "Mixed Textile",
  WOOL_BLEND: "Wool Blend",
  OTHER: "Other"
};

export const conditionLevelLabel: Record<ConditionLevel, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low"
};

export const contaminationLevelLabel: Record<ContaminationLevel, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High"
};

export const reusePotentialLabel: Record<ReusePotential, string> = {
  HIGH: "High",
  MEDIUM_HIGH: "Medium-High",
  MEDIUM: "Medium",
  LOW: "Low"
};

export const partnerTypeLabel: Record<PartnerType, string> = {
  INDUSTRIAL_BUYER: "Industrial Buyer",
  COOPERATIVE: "Cooperative",
  RECOVERY_UNIT: "Recovery Unit",
  WAREHOUSE: "Warehouse"
};

export const confidenceLabel: Record<ConfidenceLevel, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High"
};

export const attachmentTypeLabel: Record<AttachmentType, string> = {
  INTAKE_SHEET: "Intake Sheet",
  BATCH_IMAGE: "Batch Image",
  OPERATOR_NOTE: "Operator Note",
  MATERIAL_DECLARATION: "Material Declaration"
};
