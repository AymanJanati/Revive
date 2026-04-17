# 🎨 Revive — Design System (v2)

> Purpose:  
> This document defines the UI/UX system, visual identity, and design rules for BalencIA.  
> It ensures consistency, clarity, and fast execution during development and vibe coding.

---

# 🧠 Design Philosophy

BalencIA is a dual-layer SaaS product:

- Employee Experience → Human, calm, supportive
- Manager Experience → Analytical, structured, actionable

The design must express:

- Trust → Employees feel safe
- Clarity → Managers understand instantly
- Intelligence → AI feels embedded, not artificial

Inspiration:

- Notion → structure
- Linear → precision

---

# 🎯 Core UX Principles

1. Clarity First

- Every screen understandable in < 3 seconds
- Strong hierarchy

2. Data Has Purpose

- Every metric must drive a decision
- No decorative UI

3. AI is Invisible but Powerful

- Appears through insights
- No chatbot patterns

4. Consistency Over Creativity

- Reusable components only
- No visual improvisation

---

# 🎨 Color System

## Base UI

- Background: #FFFFFF
- Secondary Background: #F7F9F8
- Border: #E5E7EB

## Text Colors

- Primary: #0F172A
- Secondary: #6B7280

## Brand Gradient (BalencIA Identity)

Linear Gradient (135°):  
#3e5e3c → #2f8876 → #05fecb

## Gradient Usage Rules (STRICT)

Use ONLY for:

- Primary CTA buttons
- Wellbeing score indicators
- AI insight highlights
- Active states

Never:

- As full background
- Mixed with random colors

Gradient = intelligence + action

---

# 🔤 Typography System

## Font Family

- Bricolage Grotesque

## Type Scale (STRICT)

- Page Title → 32px / ExtraBold
- Section Title → 20px / Bold
- Card Title → 16px / SemiBold
- KPI Number → 28px / ExtraBold
- Body Text → 14px / Regular
- Secondary Text → 13px / Light
- Caption / Labels → 12px / Light

## Typography Rules

- Maintain strong hierarchy
- Avoid thin unreadable text
- Never mix random sizes

---

# 📐 Layout & Spacing

## Layout Structure

- Left Sidebar (fixed)
- Top Bar (minimal)
- Main Content (card-based)

## Spacing System

8 / 12 / 16 / 24 / 32

## Layout Rules

- Consistent padding: p-5 / p-6
- Clear vertical rhythm
- No overcrowding
- No excessive empty space

---

# 🧭 Navigation System

## Sidebar

- Width: 240px
- Icon + label
- White background
- Border-right: #E5E7EB

## Active Item

- Subtle gradient indicator
- Light background highlight

## Top Bar

- Height: 64px
- Left: Page title
- Right: actions / user menu

## Navigation Rules

- Always clear where user is
- No deep nesting
- Keep it simple

---

# 📱 Responsive Rules

Primary target: Desktop  
Tablet: stack cards vertically  
Mobile: simplified single-column layout

Behavior:

- Sidebar collapses
- Cards become full width
- Charts remain readable

---

# 🧩 Component System

## Design Tokens

Radius:

- Cards: 20px
- Buttons: 14px
- Inputs: 12px

Borders:

- 1px solid #E5E7EB

Shadows:

- Very subtle only
- No heavy shadows

---

## Cards (Core Unit)

- White background
- Light border
- Rounded
- Padding: p-5 / p-6

Every feature must live inside a card

## Card Variants

- Standard Card
- KPI Card
- Insight Card (AI)
- Alert Card

---

## Buttons

Primary:

- Gradient background
- White text

Secondary:

- White background
- Border-based

Ghost:

- No background
- Minimal

---

## Inputs

- Border-based
- Clean
- Focus: subtle gradient glow

---

## Badges

- Low → soft green
- Medium → soft amber
- High → muted red

No aggressive colors

---

## Sliders

- Smooth interaction
- Subtle gradient track
- Minimal UI

---

# 🤖 AI Visual System

AI is embedded, not visible

Appears in:

- Insight cards
- Recommendation panels

Rules:

- Subtle gradient accent
- Structured content
- Short text

Forbidden:

- Chatbots
- Floating assistants
- Over-animated AI

---

# 📊 Data Visualization

Style:

- Clean SaaS charts
- Minimal grid
- High readability

Allowed:

- Line charts
- Bar charts

Chart rules:

- Must be readable instantly
- No complex dashboards
- Must support decisions

Chart colors:

- Neutral base
- Gradient only for key metrics
- Soft grid lines

---

# 🧍 Employee Experience

Goal:

- Build trust
- Encourage honesty

Tone:

- Friendly
- Calm
- Supportive

UI:

- Clean
- Light emotional touch
- No overload

---

# 🧠 Manager Experience

Goal:

- Enable fast decisions

Focus:

- Alerts
- Recommendations

UI:

- Structured
- Data-focused
- Clear priorities

---

# 📱 Screen Structure

Employee — Check-in:

- Mood selector (5 options)
- Sliders: stress / fatigue / workload
- Optional note
- CTA: Submit

Employee Dashboard:

- Wellbeing score
- AI insights
- Trend chart
- Recommendations

Manager Dashboard:

Top:

- Team health score
- At-risk employees
- Average stress

Middle:

- Trend chart

Bottom:

- AI recommendations

---

# 🎯 Wellbeing Score

Employee:

- Simple visual feedback

Manager:

- Strong KPI
- Gradient-based
- Includes trends

---

# ⚙️ Interaction & Motion

Motion level: Minimal

Rules:

- Subtle hover effects
- Smooth transitions
- No heavy animations

---

# 🔄 UI States (CRITICAL)

Loading:

- Skeleton loaders
- No excessive spinners

Empty:

- Short message
- Clear CTA

Error:

- Inline message
- No aggressive alerts

Success:

- Calm confirmation

---

# ✍️ Content & Tone

Employee:
Human, supportive

Example:
"You’ve had higher stress this week. Consider taking a short break."

Manager:
Structured, actionable

Example:
"3 employees show increasing fatigue. Consider reducing meeting load."

---

# 🚫 Do / Don’t Rules

Do:

- Use reusable components
- Keep UI consistent
- Use gradient with purpose
- Prioritize clarity

Don’t:

- Overuse gradient
- Overload UI
- Create random styles
- Build chatbot UI
- Overuse animation

---

# 🧠 Final Principle

If a screen is not understandable in 3 seconds, it must be simplified.
