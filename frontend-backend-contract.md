# Revive — Frontend / Backend Contract

## Purpose

This document defines the contract between the frontend and backend for the Revive MVP.

Its goal is to prevent conflicts between both sides by fixing:

- what the backend must expose
- what the frontend can rely on
- what data shapes must be respected
- what statuses, enums, and response structures are allowed
- what is in scope for the hackathon MVP

This contract is the implementation reference for both teams.

---

## Product Scope Reminder

Revive is a **one-page internal operational web app** for textile manufacturers.

It is:

- an internal manufacturer-side console
- an AI routing decision tool
- a seeded-data MVP
- a multi-agent flow with progressive execution

It is not:

- a marketplace
- a partner portal
- a cooperative interface
- a buyer interface
- an ERP
- an analytics platform
- a multi-user authenticated platform

---

## Architecture Decision

For the hackathon MVP, the backend should be lightweight and stable.

Recommended implementation:

- **Frontend:** Next.js + React + Tailwind
- **Backend:** Next.js API routes or server actions
- **Data source:** local seeded JSON / TypeScript files
- **State:** in-memory for runtime interactions
- **AI orchestration:** one orchestration layer that runs the 4 agents in sequence
- **No database required**

This means the backend is mostly a controlled orchestration and data-serving layer.

---

## Shared Product Flow

The agreed product flow is:

1. Frontend loads the incoming waste queue
2. User selects one batch
3. Frontend requests full batch details
4. Frontend displays intake record and attachments
5. User clicks **Launch Autonomous Analysis**
6. Frontend starts analysis request
7. Backend runs the 4-agent sequence
8. Frontend displays progressive step execution
9. Backend returns final routing decision
10. Frontend displays final decision card and compact value snapshot

---

## Canonical Domain Entities

The following entities are the source of truth.

### 1. WasteBatch

```ts
type BatchStatus =
  | "AWAITING_ANALYSIS"
  | "UNDER_EVALUATION"
  | "ROUTING_RECOMMENDED";

type ConditionLevel = "HIGH" | "MEDIUM" | "LOW";
type ContaminationLevel = "LOW" | "MEDIUM" | "HIGH";
type ReusePotential = "HIGH" | "MEDIUM_HIGH" | "MEDIUM" | "LOW";
type MaterialType =
  | "COTTON"
  | "POLYESTER"
  | "COTTON_POLY_BLEND"
  | "DENIM"
  | "MIXED_TEXTILE"
  | "WOOL_BLEND"
  | "OTHER";

type AttachmentType =
  | "INTAKE_SHEET"
  | "BATCH_IMAGE"
  | "OPERATOR_NOTE"
  | "MATERIAL_DECLARATION";

interface BatchAttachment {
  id: string;
  name: string;
  type: AttachmentType;
  fileUrl?: string;
  previewUrl?: string;
  mimeType?: string;
}

interface WasteBatch {
  id: string;
  batchCode: string;
  sourceLine: string;
  materialType: MaterialType;
  quantityKg: number;
  conditionLevel: ConditionLevel;
  contaminationLevel: ContaminationLevel;
  reusePotential: ReusePotential;
  marketDemand: number; // 0-100
  warehousePressure: number; // 0-100
  intakeDate: string; // ISO date string
  status: BatchStatus;
  notes: string;
  attachments: BatchAttachment[];
}
```

### 2. PartnerProfile

```ts
type PartnerType =
  | "INDUSTRIAL_BUYER"
  | "COOPERATIVE"
  | "RECOVERY_UNIT"
  | "WAREHOUSE";

interface PartnerProfile {
  id: string;
  partnerName: string;
  partnerType: PartnerType;
  acceptedMaterials: MaterialType[];
  valueProfile: number; // 0-100
  impactProfile: number; // 0-100
  operationalConstraints: string[];
}
```

### 3. Routing Outcome

```ts
type RoutingOutcome =
  | "SELL"
  | "REDIRECT_TO_COOPERATIVE"
  | "STORE_TEMPORARILY"
  | "REJECT_SPECIALIZED_TREATMENT";
```

### 4. Agent Names

```ts
type AgentName =
  | "BATCH_UNDERSTANDING_AGENT"
  | "VALUE_AGENT"
  | "IMPACT_AGENT"
  | "ARBITER_AGENT";
```

### 5. Agent Execution Status

```ts
type AgentExecutionStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";
```

---

## UI-to-Backend State Mapping

The frontend must display human-friendly labels, but internally it should rely on backend enums.

### Batch Status Mapping

| Backend Enum | Frontend Label |
|---|---|
| `AWAITING_ANALYSIS` | Awaiting Analysis |
| `UNDER_EVALUATION` | Under Evaluation |
| `ROUTING_RECOMMENDED` | Routing Recommended |

### Routing Outcome Mapping

| Backend Enum | Frontend Label |
|---|---|
| `SELL` | Sell |
| `REDIRECT_TO_COOPERATIVE` | Redirect to Cooperative |
| `STORE_TEMPORARILY` | Store Temporarily |
| `REJECT_SPECIALIZED_TREATMENT` | Reject / Specialized Treatment |

### Agent Name Mapping

| Backend Enum | Frontend Label |
|---|---|
| `BATCH_UNDERSTANDING_AGENT` | Batch Understanding Agent |
| `VALUE_AGENT` | Value Agent |
| `IMPACT_AGENT` | Impact Agent |
| `ARBITER_AGENT` | Arbiter Agent |

---

## Backend Responsibilities

The backend must be responsible for:

- serving seeded queue data
- serving full batch details
- serving partner profiles if needed internally
- launching the agent orchestration flow
- returning deterministic + explainable structured outputs
- returning final routing recommendation
- returning consistent enums and schemas
- keeping response formats stable for the frontend

The backend must not be responsible for:

- UI animation
- frontend label formatting
- layout decisions
- presentation styling
- fake upload interactions unless explicitly implemented

---

## Frontend Responsibilities

The frontend must be responsible for:

- displaying the queue
- displaying batch details
- displaying attachments
- triggering analysis
- rendering progressive analysis steps
- mapping backend enums to UI labels
- rendering final decision card
- rendering compact value snapshot
- handling loading, empty, and error states cleanly

The frontend must not:

- invent business logic
- compute routing decisions locally
- hardcode outcomes disconnected from backend payloads
- assume fields that are not part of this contract

---

## Seed Data Agreement

The backend will provide **3 to 5 seeded records only**.

Each record must include:

- realistic batch code
- realistic source line
- realistic intake timestamp
- realistic notes
- realistic attachment metadata
- enough signal for a coherent routing decision

Suggested seeded set:

1. High-value clean batch for sale
2. Medium-quality batch for cooperative routing
3. Contaminated batch for rejection
4. Storage-worthy batch
5. Conflict case between business value and impact

---

## API Contract

Base path recommendation:

```txt
/api
```

---

## 1. Get Incoming Waste Queue

### Endpoint

```http
GET /api/batches
```

### Purpose

Returns the queue items shown in the **Incoming Waste Queue** section.

### Response

```json
{
  "data": [
    {
      "id": "1",
      "batchCode": "TX-2041",
      "sourceLine": "Line A - Cutting",
      "materialType": "COTTON_POLY_BLEND",
      "quantityKg": 180,
      "intakeDate": "2026-04-17T09:00:00.000Z",
      "status": "AWAITING_ANALYSIS"
    }
  ]
}
```

### Notes

- This endpoint returns **summary records only**
- It should not return full agent results
- It should be fast and stable
- Frontend uses this for the queue table/list

### Frontend Expectation

Frontend must expect:

- array of queue items
- stable field names
- no missing `id`
- no formatted display strings from backend

---

## 2. Get Batch Details

### Endpoint

```http
GET /api/batches/:id
```

Example:

```http
GET /api/batches/1
```

### Purpose

Returns the full intake record for one batch.

### Response

```json
{
  "data": {
    "id": "1",
    "batchCode": "TX-2041",
    "sourceLine": "Line A - Cutting",
    "materialType": "COTTON_POLY_BLEND",
    "quantityKg": 180,
    "conditionLevel": "MEDIUM",
    "contaminationLevel": "LOW",
    "reusePotential": "MEDIUM_HIGH",
    "marketDemand": 74,
    "warehousePressure": 42,
    "intakeDate": "2026-04-17T09:00:00.000Z",
    "status": "AWAITING_ANALYSIS",
    "notes": "Mixed cotton-poly offcuts from garment finishing.",
    "attachments": [
      {
        "id": "att-1",
        "name": "Intake Sheet.pdf",
        "type": "INTAKE_SHEET",
        "fileUrl": "/mock/intake-sheet-tx-2041.pdf",
        "mimeType": "application/pdf"
      },
      {
        "id": "att-2",
        "name": "Operator Note.txt",
        "type": "OPERATOR_NOTE",
        "fileUrl": "/mock/operator-note-tx-2041.txt",
        "mimeType": "text/plain"
      }
    ]
  }
}
```

### Frontend Expectation

Frontend can rely on:

- full intake record
- attachment metadata
- no need to infer missing values
- enum values, not presentation labels

---

## 3. Launch Analysis

### Endpoint

```http
POST /api/analysis
```

### Purpose

Starts the 4-agent analysis flow for one batch.

### Request Body

```json
{
  "batchId": "1"
}
```

### Behavior Agreement

The backend must:

- validate the batch ID
- load the batch
- execute the 4 agents in order
- return structured outputs
- return a final routing decision
- keep logic deterministic enough for demo stability

The frontend must:

- only send `batchId`
- not send computed routing logic
- show loading/progressive state while awaiting response

---

## Analysis Response Contract

```json
{
  "data": {
    "batchId": "1",
    "startedAt": "2026-04-17T10:00:00.000Z",
    "completedAt": "2026-04-17T10:00:06.000Z",
    "batchStatus": "ROUTING_RECOMMENDED",
    "timeline": [
      {
        "agent": "BATCH_UNDERSTANDING_AGENT",
        "status": "COMPLETED",
        "message": "Structuring intake record and normalizing waste profile.",
        "reasoning": "Material appears reusable with low contamination and moderate condition.",
        "output": {
          "material": "COTTON_POLY_BLEND",
          "quantityKg": 180,
          "conditionLevel": "MEDIUM",
          "contaminationLevel": "LOW",
          "reusePotential": "MEDIUM_HIGH"
        }
      },
      {
        "agent": "VALUE_AGENT",
        "status": "COMPLETED",
        "message": "Evaluating commercial attractiveness.",
        "reasoning": "Resale potential is acceptable and buyer fit is viable.",
        "output": {
          "valueScore": 78,
          "recommendedRoute": "SELL"
        }
      },
      {
        "agent": "IMPACT_AGENT",
        "status": "COMPLETED",
        "message": "Evaluating sustainability and social reuse potential.",
        "reasoning": "Higher downstream reuse value exists through a cooperative route.",
        "output": {
          "impactScore": 85,
          "recommendedRoute": "REDIRECT_TO_COOPERATIVE"
        }
      },
      {
        "agent": "ARBITER_AGENT",
        "status": "COMPLETED",
        "message": "Resolving trade-offs and issuing final routing decision.",
        "reasoning": "Business value is moderate, but overall impact is significantly better through cooperative reuse.",
        "output": {
          "finalRoute": "REDIRECT_TO_COOPERATIVE",
          "confidence": "HIGH",
          "nextAction": "Prepare batch for cooperative dispatch"
        }
      }
    ],
    "finalDecision": {
      "recommendedDestination": "Cooperative Atlas Reuse",
      "partnerType": "COOPERATIVE",
      "routingOutcome": "REDIRECT_TO_COOPERATIVE",
      "explanation": "Moderate resale value but stronger total value through social reuse and sustainability benefit.",
      "businessScore": 68,
      "impactScore": 89,
      "confidence": "HIGH",
      "nextAction": "Prepare batch for cooperative dispatch"
    },
    "valueSnapshot": {
      "recoverableValueEstimate": 1200,
      "wasteDivertedKg": 180,
      "socialReusePotential": "HIGH",
      "sustainabilityContribution": "STRONG"
    }
  }
}
```

---

## Required Analysis Output Structure

The backend must always return the following top-level keys after a successful analysis:

- `batchId`
- `startedAt`
- `completedAt`
- `batchStatus`
- `timeline`
- `finalDecision`
- `valueSnapshot`

The frontend must assume these keys exist on success.

---

## Timeline Item Contract

Each timeline item must follow this shape:

```ts
interface AnalysisTimelineItem {
  agent: AgentName;
  status: AgentExecutionStatus;
  message: string;
  reasoning: string;
  output: Record<string, unknown>;
}
```

### Rules

- `agent` must be one of the 4 allowed agent enums
- `status` must be one of the allowed execution statuses
- `message` is short and UI-friendly
- `reasoning` is longer explanatory text
- `output` is structured object data, not raw prose only

---

## Final Decision Contract

```ts
type ConfidenceLevel = "LOW" | "MEDIUM" | "HIGH";

interface FinalDecision {
  recommendedDestination: string;
  partnerType: PartnerType;
  routingOutcome: RoutingOutcome;
  explanation: string;
  businessScore: number; // 0-100
  impactScore: number; // 0-100
  confidence: ConfidenceLevel;
  nextAction: string;
}
```

### Rules

- `businessScore` and `impactScore` must always be integers from 0 to 100
- `confidence` must only be `LOW`, `MEDIUM`, or `HIGH`
- `routingOutcome` must only be one of the 4 allowed outcomes
- `recommendedDestination` must always be present
- `explanation` must be concise and jury-friendly

---

## Value Snapshot Contract

```ts
type QualitativeLevel = "LOW" | "MEDIUM" | "HIGH" | "STRONG";

interface ValueSnapshot {
  recoverableValueEstimate: number;
  wasteDivertedKg: number;
  socialReusePotential: "LOW" | "MEDIUM" | "HIGH";
  sustainabilityContribution: QualitativeLevel;
}
```

### Rules

- frontend displays these as compact cards
- backend sends raw structured values
- frontend handles units and labels

---

## Error Contract

The backend must return structured errors.

### Error Shape

```json
{
  "error": {
    "code": "BATCH_NOT_FOUND",
    "message": "The requested batch could not be found."
  }
}
```

### Allowed Error Codes

```ts
type ApiErrorCode =
  | "BATCH_NOT_FOUND"
  | "INVALID_BATCH_ID"
  | "ANALYSIS_FAILED"
  | "INVALID_REQUEST"
  | "INTERNAL_SERVER_ERROR";
```

### Frontend Handling Rules

- frontend must not crash on backend errors
- frontend should show a clean error message block/toast
- frontend should allow retry for analysis failures
- frontend should not fabricate results when an error occurs

---

## Loading and Empty States Contract

### Queue Loading

Frontend shows loading skeleton while `GET /api/batches` is pending.

### Queue Empty

If backend returns:

```json
{
  "data": []
}
```

frontend shows:

- empty queue state
- no fake records added locally

### Analysis Loading

While analysis request is running:

- frontend shows progressive execution UI
- frontend may animate agent cards locally
- frontend must not show final decision before response is ready unless using agreed mock streaming

---

## Streaming vs Non-Streaming Agreement

For the hackathon MVP, there are two acceptable modes.

### Mode A — Simple Non-Streaming

Backend returns final analysis payload after full execution.

Frontend simulates progress using staged loading UI before showing returned timeline.

### Mode B — Controlled Streaming

Backend streams timeline progress step by step.

Frontend updates cards in real time.

### Recommended Choice

**Mode A — Simple Non-Streaming**

Reason:

- lower risk
- easier to stabilize
- faster to build
- sufficient for demo quality

Unless the team explicitly commits to streaming, frontend must assume **non-streaming**.

---

## Deterministic Logic Agreement

The backend should use a hybrid approach:

- deterministic scoring for core routing logic
- LLM for reasoning, wording, and explanation polish

### Why

This keeps:

- outputs believable
- demo stable
- route selection coherent
- frontend/backend integration predictable

### Backend Rule

The final route must not be random.

The same seeded batch should produce a coherent and stable result across demo runs unless intentionally changed.

---

## Business Rules the Frontend Can Rely On

The frontend may rely on the following:

1. There are exactly **4 agents**
2. There are exactly **4 routing outcomes**
3. Queue records come from seeded internal data
4. The final decision always contains:
   - route
   - destination
   - explanation
   - business score
   - impact score
   - confidence
   - next action
5. Attachments are display-oriented for realism and may be mock URLs
6. The app has only one user-facing interface

---

## Business Rules the Frontend Must Not Assume

The frontend must not assume:

- a database exists
- authentication exists
- uploads are truly processed
- external partner systems exist
- agent count will grow during the hackathon MVP
- arbitrary unknown statuses or outcome names are valid

---

## File and Module Ownership

### Frontend Suggested Ownership

- queue component
- batch detail component
- attachment preview cards
- launch analysis button
- agent timeline UI
- final decision card
- compact value snapshot cards
- error and loading states

### Backend Suggested Ownership

- seed data source
- batch repository layer
- partner repository layer
- analysis service
- scoring logic
- agent orchestration service
- response serializers
- API route handlers

---

## Suggested Folder-Level Contract

### Frontend

```txt
app/
components/
  queue/
  batch-details/
  analysis/
  decision/
lib/
types/
```

### Backend

```txt
app/api/
lib/
  seed/
  repositories/
  services/
  agents/
  scoring/
  serializers/
types/
```

---

## Shared Types Recommendation

To avoid drift, shared TypeScript types should be centralized.

Recommended:

```txt
/types/revive.ts
```

This file should contain:

- enums
- interfaces
- response contracts
- request types

Both frontend and backend should import from the same shared types file whenever possible.

---

## Minimal Required Endpoints Summary

The backend must ship at least these endpoints:

### Required

- `GET /api/batches`
- `GET /api/batches/:id`
- `POST /api/analysis`

### Optional

- `GET /api/partners`
- `GET /api/health`

Optional means they may exist, but frontend must not depend on them unless confirmed.

---

## Optional Endpoint: Get Partners

### Endpoint

```http
GET /api/partners
```

### Purpose

Returns seeded destination profiles for internal use, debugging, or admin-free visibility during development.

### Frontend Dependency

Not required for MVP UI.

---

## Optional Endpoint: Health Check

### Endpoint

```http
GET /api/health
```

### Response

```json
{
  "status": "ok"
}
```

### Frontend Dependency

Not required for MVP UI.

---

## Acceptance Criteria for Backend

Backend work is accepted if:

- queue endpoint returns seeded summary records
- details endpoint returns full batch intake data
- analysis endpoint returns stable structured analysis result
- all enums follow this contract exactly
- final decision always contains complete decision data
- errors follow the agreed error format
- no undocumented fields are required by frontend

---

## Acceptance Criteria for Frontend

Frontend work is accepted if:

- queue renders backend summary data correctly
- batch detail view renders full intake record correctly
- analysis trigger calls backend correctly
- timeline UI renders from backend response shape
- final decision card renders from backend response shape
- loading/error states are handled cleanly
- frontend uses enum mapping instead of backend presentation text
- no business-critical logic is hardcoded only in frontend

---

## Final Integration Rules

1. Backend changes to field names must not happen without updating shared types
2. Frontend must not rename backend enums informally in logic
3. Any new field added by backend must be optional unless explicitly agreed
4. Any field required by frontend must be defined here first
5. Demo wording in UI can change, but contract enums must stay stable
6. Final route logic belongs to backend
7. Visual polish belongs to frontend
8. Shared types are the single source of truth

---

## Final Contract Summary

The contract is:

- backend provides seeded data, structured agent outputs, and final routing decisions
- frontend renders queue, intake record, progressive analysis, and final decision
- both sides share the same enums, interfaces, and response formats
- routing logic lives in backend
- UI logic lives in frontend
- no side invents fields or statuses outside this contract

This is the implementation agreement for the Revive MVP.
