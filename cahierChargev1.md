# Revive — Hackathon Build Context

## Autonomous Textile Waste Routing Console

## 1. Project Summary

Revive is a lightweight internal AI decision console for textile manufacturers.

Its purpose is to help a factory decide what to do with each incoming textile waste batch by using multiple AI agents that collaborate to recommend the best routing option.

Instead of treating textile waste as something to discard manually, Revive evaluates each batch and decides whether it should be:

- sold to an industrial buyer
- redirected to a cooperative
- stored temporarily
- rejected / sent for specialized treatment

The key idea is that this is not a dashboard and not a marketplace.

It is an agentic decision engine with a polished operational interface.

For the hackathon, the MVP should feel like a real internal factory tool already used in operations, while staying simple and safe to build in a short time.

---

## 2. Core Pitch

Revive transforms textile waste handling from a static manual process into an autonomous routing decision system.

It uses multiple AI agents to:

- understand the waste batch
- evaluate business value
- evaluate environmental and social impact
- arbitrate between conflicting goals
- recommend the best final destination

This makes the system feel more advanced than a simple classifier or chatbot because the value comes from agent collaboration and decision arbitration.

---

## 3. Hackathon Goal

The goal is not to build a full startup platform.

The goal is to build a convincing MVP prototype that demonstrates:

- a strong and original industrial use case
- real business and sustainability value
- clean multi-agent architecture
- a polished product experience
- a live demo that feels attractive and professional

At the end of the hackathon, the jury should feel that:

- the idea is relevant
- the UI looks product-ready
- the AI behavior feels agentic
- the use case has market value
- the team understood scope and execution well

---

## 4. MVP Positioning

Revive is:

- an internal textile manufacturer tool
- an AI routing console
- an operational intake + analysis system
- a lightweight MVP prototype

Revive is not:

- a marketplace
- a multi-portal ecosystem
- a logistics platform
- an ERP
- a big analytics suite
- a cooperative/buyer portal

This is very important for scope.

For the MVP, there is only one interface:  
the manufacturer-side operational console.

---

## 5. Product Experience Direction

The app should look like a real internal operations product, not a demo screen.

That means:

Do not use wording like:

- scenario
- sample data
- test batch
- demo case

Use wording like:

- Incoming Waste Queue
- Waste Batch Intake
- Pending Analysis
- Intake Record
- Supporting Files
- Routing Recommendation

Behind the scenes, the data can still be seeded.

But on the surface, the product must feel professional and operational.

---

## 6. MVP Scope

### Included

- one polished web app
- one main page
- incoming waste batch queue
- waste batch intake record
- supporting file section
- 4-agent reasoning flow
- progressive live analysis
- final routing recommendation
- business + impact summary
- 3 to 5 seeded intake records underneath

### Excluded

- auth
- admin panel
- cooperative/company interfaces
- marketplace features
- real OCR/parsing complexity
- computer vision
- real ERP integration
- database requirement
- advanced analytics
- learning agent
- reporting suite
- messaging flows
- logistics tracking

---

## 7. Core User Flow

The user journey should be:

1. User opens Revive
2. User sees an Incoming Waste Queue
3. User opens one waste batch
4. User reviews the Waste Batch Intake Record
5. User clicks Launch Autonomous Analysis
6. The 4 agents execute progressively
7. The system produces a final routing decision
8. The final decision card shows:
   - route
   - explanation
   - scores
   - confidence
   - next action

This is the main flow and should be the heart of the demo.

---

## 8. Recommended UI Structure

### Section 1 — Header

Must include:

- product name
- one-line description
- live status badge

Example:

**Revive**  
Autonomous AI routing for textile waste valorization  
**Status:** System Online / 4 Agents Active

### Section 2 — Incoming Waste Queue

This replaces “scenario selection”.

Show a realistic list of pending batches.

Suggested columns:

- Batch ID
- Source Line
- Material Type
- Quantity
- Intake Date
- Status

Example statuses:

- Awaiting Analysis
- Under Evaluation
- Routing Recommended

This section should make the app immediately feel operational.

### Section 3 — Waste Batch Intake Record

When a batch is opened, show a detailed intake sheet.

Suggested fields:

- Batch ID
- Source production line
- Material type
- Quantity
- Condition level
- Contamination level
- Reuse potential
- Operator note
- Intake timestamp
- Current status

Also include:

### Supporting Intake Files

For example:

- intake sheet
- batch image
- operator note
- material declaration

These files can be simple preview cards or fake attached files for realism.

**Important:**  
They are there to make the system feel professional, not to introduce risky technical complexity.

### Section 4 — Launch Autonomous Analysis

This is the main action button.

CTA:

**Launch Autonomous Analysis**

When clicked:

- show a short transition
- start progressive agent execution
- do not instantly display the final answer

Suggested interim messages:

- Parsing intake record...
- Structuring batch profile...
- Evaluating commercial value...
- Evaluating sustainability impact...
- Resolving routing trade-offs...

This is one of the biggest demo “show” moments.

### Section 5 — Agent Execution Timeline

Display the 4 agents one after another.

For each agent show:

- name
- status
- short reasoning
- output summary

This section is critical because it proves the system is truly agentic.

### Section 6 — Final Routing Decision Card

This should be visually prominent.

Must include:

- recommended destination
- suggested partner name or partner type
- explanation
- business score
- impact score
- confidence
- next action

Example:

- **Recommended Destination:** Cooperative Atlas Reuse
- **Business Score:** 68/100
- **Impact Score:** 89/100
- **Confidence:** High
- **Next Action:** Prepare batch for cooperative dispatch

### Section 7 — Compact Value Snapshot

Small cards can show:

- recoverable value
- waste diverted from disposal
- social reuse potential
- sustainability contribution

Keep this compact.

Do not turn it into a dashboard-heavy section.

---

## 9. Agent Architecture

Use 4 agents only.

This is the best balance between:

- looking advanced
- being understandable
- staying buildable in 12 hours
- avoiding overengineering

### Agent 1 — Batch Understanding Agent

**Purpose:**  
understands and structures the waste batch.

**Responsibilities:**

- analyze material type
- analyze quantity
- determine condition
- determine contamination
- estimate reuse potential
- normalize the batch information

**Output example:**

- material: cotton-poly blend
- quantity: 180 kg
- condition: medium
- contamination: low
- reuse potential: medium-high

### Agent 2 — Value Agent

**Purpose:**  
evaluates business value.

**Responsibilities:**

- estimate resale attractiveness
- compare immediate sale vs storage
- generate a value score
- recommend best economic route

**Output example:**

- value score: 78/100
- recommendation: sell
- reasoning: resale potential is acceptable and buyer fit is strong

### Agent 3 — Impact Agent

**Purpose:**  
evaluates environmental and social value.

**Responsibilities:**

- estimate sustainability benefit
- evaluate reuse value
- detect cooperative/social routing opportunity
- generate impact score
- recommend highest-impact route

**Output example:**

- impact score: 85/100
- recommendation: redirect to cooperative
- reasoning: strong reuse value and higher total impact

### Agent 4 — Arbiter Agent

**Purpose:**  
makes the final decision.

**Responsibilities:**

- receive outputs from previous agents
- compare conflicts and trade-offs
- choose the final destination
- explain why it wins
- generate the next action

**Output example:**

- final decision: redirect to cooperative
- explanation: moderate resale value but higher total impact through cooperative reuse
- confidence: high
- next action: prepare batch for cooperative dispatch

---

## 10. Routing Outcomes

The MVP should support only these four outcomes:

- Sell
- Redirect to Cooperative
- Store Temporarily
- Reject / Specialized Treatment

Do not add more.

Too many outcomes make the product harder to understand and harder to stabilize.

---

## 11. Seeded Data Strategy

For the demo, use seeded operational records.

Do not expose them as scenarios.

The system should behave as if these are real intake records waiting in the operational queue.

### Recommended number

3 to 5 records only.

### Suggested batch types

1. Clean, high-value batch suitable for sale
2. Medium-quality batch better suited for cooperative reuse
3. Low-value contaminated batch for rejection
4. Batch worth temporary storage
5. Mixed batch with conflict between value and impact

**Important**

Each batch should have:

- realistic ID
- realistic source line
- realistic timestamp
- realistic notes
- realistic partner fit

Example IDs:

- TX-2041
- TX-2042
- TX-2043

---

## 12. Partner Representation

For the MVP, cooperatives and buyers do not have their own interfaces.

They are represented as seeded destination profiles inside the decision system.

Example partners:

- Cooperative Atlas Reuse
- ThreadCycle Industrial Buyer
- EcoFiber Recovery Unit

The final decision can recommend one of them, but they do not log into the app.

This keeps the project focused and avoids unnecessary platform complexity.

---

## 13. Demo Interaction Strategy

The best format is:

**Seeded records + live agent simulation**

That means:

- batch records are predefined
- agent execution appears live
- outputs are controlled and reliable
- the demo still feels dynamic and intelligent

This is better than:

- a static screen
- fully random outputs
- real open-ended uploads
- unstable parsing flows

---

## 14. File Upload / Intake Handling Strategy

If you want extra wow effect, use fake but controlled intake-file realism.

### Best approach

Show that each batch already has attached supporting files:

- intake sheet
- material declaration
- operator note
- batch photo

Optionally, you may allow a controlled upload of one known sample file, but this is not necessary.

### Recommended choice

Do not make jury upload random files.

Safer and more professional:

- open a batch
- show attached intake files
- click analyze
- system appears to parse and process the intake context

This feels more enterprise-ready.

---

## 15. Technical Approach

The MVP should use a simple and reliable hybrid approach:

### Decision reliability

Use structured scoring / deterministic rules for core routing logic.

### Agent realism

Use LLMs for:

- reasoning
- explanations
- agent-to-agent style outputs
- arbitration phrasing

### Best balance

- deterministic enough to stay stable
- AI-driven enough to feel smart and innovative

This is the safest hackathon engineering decision.

---

## 16. Suggested Tech Stack

### Frontend

- Next.js
- React
- Tailwind CSS

**Reason:**

- very fast to build
- ideal for polished single-page apps
- good for animations and clean UI
- easy deployment

### Backend

**Recommended:**

- Next.js API routes or server actions

**Reason:**

- fastest for hackathon execution
- keeps frontend and backend together
- reduces setup overhead

**Alternative:**

- FastAPI only if team already works very fast with it

### AI Layer

- OpenAI API or compatible LLM provider
- model must be configurable in `.env`
- simple orchestration wrapper for the 4 agents
- structured JSON outputs between agents

### Data

- local JSON or TypeScript seed files
- in-memory state only
- no database required

### Deployment

- Vercel

---

## 17. Suggested Internal Data Models

### Waste batch

**Fields:**

- id
- batchCode
- sourceLine
- materialType
- quantityKg
- conditionLevel
- contaminationLevel
- reusePotential
- marketDemand
- warehousePressure
- intakeDate
- status
- notes
- attachments

### Partner / destination profile

**Fields:**

- id
- partnerName
- partnerType
- acceptedMaterials
- valueProfile
- impactProfile
- operationalConstraints

---

## 18. Engineering Principles

The team should optimize for:

- demo stability
- visual polish
- clear architecture
- believable outputs
- low technical risk
- fast iteration

Avoid:

- too many screens
- too many agents
- unnecessary backend complexity
- advanced data pipelines
- features that do not directly help the demo

The rule is:

**build narrow, present big.**

---

## 19. Non-Functional Requirements

The MVP should be:

- visually modern
- professional-looking
- responsive
- understandable in under one minute
- stable under demo conditions
- explainable
- attractive for the jury

The MVP should avoid:

- clutter
- platform-style overload
- obvious hardcoded language
- confusing routing logic
- fragile interactions

---

## 20. Design Direction

The app should feel like:

**an industrial AI command console**

It should not feel like:

- an admin dashboard
- a startup marketplace
- a school project demo

### Suggested design cues

- premium dark or clean modern UI
- bold clear typography
- card-based layout
- subtle motion
- timeline-based agent execution
- strong final decision card
- small polished status badges

---

## 21. Demo Choreography

Recommended pitch/demo flow:

1. Open Revive
2. Show Incoming Waste Queue
3. Open one pending batch
4. Show realistic intake record and supporting files
5. Click Launch Autonomous Analysis
6. Let agents execute one by one
7. Show disagreement between value and impact
8. Show Arbiter Agent final decision
9. End on final routing card and value/impact snapshot

This makes the demo feel alive and intelligent.

---

## 22. MVP Success Criteria

The MVP is successful if it can:

- convincingly present an operational intake flow
- open realistic waste batch records
- run the 4 agents in order
- show reasoning clearly
- produce coherent routing decisions
- make the system feel product-ready
- communicate business and sustainability value
- impress the jury through originality and execution

---

## 23. Deliverables

At the end of the hackathon, the team should aim to have:

- deployed web app
- polished one-page interface
- 3 to 5 seeded intake records
- functioning 4-agent routing flow
- final decision cards working
- pitch-ready live demo
- short README
- optional architecture diagram for presentation

---

## 24. Suggested Build Plan

### Phase 1 — Core data and UI shell

- create seeded batches
- create seeded partners
- build main layout
- build queue
- build intake record view

### Phase 2 — Agent orchestration

- implement 4-agent sequence
- define structured outputs
- build arbiter flow
- stabilize routing logic

### Phase 3 — UI polish

- agent execution animation
- status badges
- final card
- compact value snapshot
- realistic labels and timestamps

### Phase 4 — Demo hardening

- test all seeded batches
- verify outputs are coherent
- remove awkward wording
- prepare the best demo path

---

## 25. Final Product Statement

Revive is a multi-agent AI routing console that helps textile manufacturers analyze incoming waste batches and direct them to the most appropriate destination by balancing business value, sustainability impact, and operational constraints.

---

## 26. AI IDE / Vibe Coding Context Block

Use this as direct context in AI IDEs:

We are building a hackathon MVP called Revive. It is a professional-looking one-page internal web app for textile manufacturers. The app is not a marketplace and not a multi-user SaaS. It is an operational AI routing console for incoming textile waste batches. The UI should look like a real internal enterprise tool, not a demo. The homepage shows an Incoming Waste Queue with 3 to 5 seeded batch records. Clicking a batch opens a Waste Batch Intake Record with fields like material type, quantity, condition, contamination, reuse potential, operator notes, and attached intake files. The main CTA is “Launch Autonomous Analysis”. When clicked, 4 AI agents execute progressively: Batch Understanding Agent, Value Agent, Impact Agent, and Arbiter Agent. Each agent shows its reasoning and output. The final output is a routing recommendation among only 4 outcomes: Sell, Redirect to Cooperative, Store Temporarily, Reject / Specialized Treatment. The final decision card must show explanation, business score, impact score, confidence, suggested destination partner, and next action. Data should be seeded locally. No auth, no database, no partner portals, no marketplace features, no heavy analytics, no OCR dependency, no computer vision. Use Next.js, React, Tailwind, and lightweight backend logic with LLM-based reasoning plus deterministic scoring for stable outputs. The experience should feel polished, modern, and jury-impressive.
