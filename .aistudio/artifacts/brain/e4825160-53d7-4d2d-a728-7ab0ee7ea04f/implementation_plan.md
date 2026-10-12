# Kafv (کفو) - Analytical Matchmaking & Decision Matrix Platform

A dedicated, privacy-first decision platform designed for an academic and computer science researcher to systematically identify, evaluate, and track prospective life partners using weighted multi-criteria decision analysis (MCDA), structured candidate profiles, and a staged courtship pipeline.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed based on your responses:
> - **Architecture & Workflow**: Comprehensive matchmaking management system combining multi-criteria evaluation with a staged outreach CRM pipeline.
> - **Data Ingestion**: Manual profile entry with structured assessment forms, pre-populated with realistic authentic benchmark profiles.
> - **Evaluation Weights**: Balanced weighting across foundational values, academic/career vision (CS PhD context), lifestyle, and emotional maturity.
>
> **Recommended Defaults**:
> - **Data Privacy**: 100% client-side persistence using `localStorage` with JSON export/import backup to guarantee complete personal privacy.
> - **Language & Layout**: Persian RTL interface with clean academic/analytical layout, Persian typography, and English terms for key technical metrics.

- **Confirmed Decision 1**: Integrated Candidate CRM + Multi-Attribute Scoring Matrix.
- **Confirmed Decision 2**: Realistic preset sample profiles to demonstrate the evaluation framework immediately.
- **Confirmed Decision 3**: Balanced multi-factor weighting formula with customizable sensitivity controls.

---

## 1. Overview & Core Concept

### What It Does
**Kafv (کفو)** transforms the often unstructured and overwhelming search for a compatible marriage partner into a methodical, objective, and emotionally grounded process. Drawing inspiration from computer science decision theory (Multi-Criteria Decision Making / Analytic Hierarchy Process), it allows the user to:
1. Define their non-negotiables ("deal-breakers") and dimensional weights across core life domains.
2. Maintain structured candidate dossiers with qualitative reflections and quantitative metrics.
3. Compute holistic compatibility match scores (0–100%) with drill-down factor explanations.
4. Track candidates across an end-to-end courtship pipeline (Discovery → Initial Screening → Mutual Research → First Outreach → Deep Dialogue → Decision).
5. Compare shortlisted candidates side-by-side using multi-dimensional radar comparison.
6. Access a culturally appropriate outreach assistant with thoughtful conversation frameworks tailored to academic and professional backgrounds.

### Target Audience & Persona
- A 30-year-old Computer Science PhD candidate graduating within 2 years, aiming for marriage around graduation, seeking an intellectually aligned, emotionally mature life partner with shared long-term values.

### Key Value
- **Clarity over Impulsivity**: Minimizes cognitive overload, avoids premature attachment to mismatched candidates, and prevents missing highly aligned partners due to superficial biases.
- **PhD-Specific Resonance**: Explicitly accounts for the realities of academic research, 2-year graduation timeline, geographic flexibility, and long-term career ambition.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Executive Overview & Dashboard**:
   - High-level metric strip: Total Candidates, Active Discussions, Top Match Score, Pipeline Stages.
   - Quick action to add a new profile or adjust evaluation weights.
   - Pipeline Kanban board & high-affinity candidate table.
2. **Criteria & Weighting Studio**:
   - Interactive weight adjusters (sliders and normalized bar chart) across 4 core dimensions:
     - *Foundational Values & Worldview* (عقاید، اخلاق، جهان‌بینی)
     - *Intellectual & Academic Synergy* (درک شرایط دکتری و پژوهش، هم‌صحبتی فکری، اهداف آینده)
     - *Lifestyle & Personal Dynamics* (سبک زندگی، تعادل کار-زندگی، عادات فردی)
     - *Emotional Maturity & Family Dynamics* (بلوغ عاطفی، حل تعارض، هماهنگی خانوادگی)
   - Deal-breaker checklist (Hard constraints that immediately flag mismatches).
3. **Candidate Dossier & Evaluation**:
   - Profile view with education, current role, location, referral source, and detailed factor rating (1–10 per factor).
   - Qualitative notes & red-flag / green-flag tags.
   - Match score breakdown showing how each category contributes to the total score.
4. **Side-by-Side Comparison Matrix**:
   - Select 2–3 candidates and visualize multi-axis radar charts comparing their score distribution against the user's ideal profile.
   - Direct attribute table comparison.
5. **Outreach & Communication Toolkit**:
   - Culturally respectful, dignified, and mature message generators for various contact methods:
     - Direct message (formal yet warm).
     - Intro request via mutual friend or academic colleague.
     - Follow-up message after a constructive first chat.
   - Pre-meeting discussion guide (recommended topics for 1st, 2nd, and 3rd meetings regarding PhD timeline, financial outlook, and location preferences).

### Visual Identity & Theme
- **Aesthetic Direction**: High-end analytical workspace; dignified, restrained, and trustworthy. Avoids playful casual dating app cliches (no neon swipes, no heart animations) in favor of thoughtful, mature decision-making.
- **Color Palette**:
  - Neutral Canvas: Crisp off-white `#F8FAFC` and soft slate `#F1F5F9`.
  - Surface & Borders: `#FFFFFF` with hairline `#E2E8F0` borders.
  - Primary Accent: Deep Indigo / Navy `#1E293B` and `#3B82F6` for focus points.
  - Status Accents: Muted emerald `#10B981` (High Compatibility / Active), warm amber `#F59E0B` (Under Review), subtle rose `#EF4444` (Deal-breaker flagged).
- **Typography & Hierarchy**:
  - Modern Persian typography system with fallback to high-legibility sans (`Vazirmatn`, `Plus Jakarta Sans`, system-ui).
  - Tabular numerals (`tabular-nums font-mono`) for all scoring and percentages.
- **Layout Math & Viewport**:
  - Full desktop layout (1440px target, 1200px container) with full RTL support.
  - Top bar adhering to the 3-Zone Contract: Brand Wordmark (کفو · Kafv) — Clean Navigation Links (داشبورد، نامزدها، ماتریس ارزیابی، مراحل ارتباط، پیام‌ها) — Primary Action ("افزودن گزینه جدید").

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Deterministic Weighted Scoring vs Black-box AI Score**:
  - *Chosen Approach*: Clear, transparent mathematical weighting formula:
    $$\text{MatchScore} = \sum_{i=1}^{n} w_i \times s_i$$
    where $w_i$ are normalized user weights and $s_i$ are normalized sub-factor scores.
  - *Why*: As a CS PhD student, full interpretability and algorithmic control are paramount. The user must clearly see *why* a candidate scored 87% vs 72%.
  - *Alternative Considered*: Opaque LLM-generated score. Rejected because it lacks consistency and mathematical auditability.

- **Decision 2: LocalStorage Persistence with JSON Export/Import**:
  - *Chosen Approach*: Complete client-side local storage with one-click encrypted JSON backup and restore.
  - *Why*: Extreme sensitivity and privacy of personal marriage notes and candidate assessments. No personal names or thoughts are transmitted to remote servers.
  - *Alternative Considered*: Remote cloud database. Deferred to keep zero external dependencies and ensure immediate data privacy.

- **Decision 3: Multi-Stage Courtship Pipeline (CRM-style)**:
  - *Chosen Approach*: A structured 6-stage funnel modeled after high-stakes personal relationships.
  - *Why*: Courtship before marriage requires pacing, respectful inquiry, and clear milestones, preventing awkward simultaneous outreach or dropped conversations.

---

## 4. Technical Architecture & Data Strategy

### System Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Navigation Bar                              │
│   [ کفو · Kafv ]  ──  [داشبورد · گزینه‌ها · ماتریس · مراحل · راهنمای پیام] ── [ + ثبت گزینه ]  │
└────────────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐
│  Dashboard & Pipeline  │  │   Criteria & Weights   │  │   Comparison Radar     │
│  - KPI Metric Strip    │  │   - 4 Domain Sliders   │  │   - Multi-Candidate    │
│  - Kanban Pipeline     │  │   - Deal-breaker Rules │  │     Spider/Radar Chart │
│  - Match Ranking List  │  │   - Real-time Normaliz.│  │   - Diff Matrix Table  │
└────────────────────────┘  └────────────────────────┘  └────────────────────────┘
    │                               ▲                               ▲
    ▼                               │                               │
┌───────────────────────────────────┴───────────────────────────────┴────┐
│                    Candidate Profile Dossier & Modal                    │
│   - Personal, Academic & Career Background (Education, Field, City)    │
│   - Multi-factor Ratings (Values, Intellectual, Lifestyle, Emotional)  │
│   - Qualitative Logs, Referral Source & Outreach Status               │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               Local State Manager & Data Storage (localStorage)        │
│   - Initial Seed Profiles (Authentic CS/Academic/Professional presets) │
│   - Dynamic Factor Re-computation Engine                               │
│   - Backup / Export to JSON & Import                                   │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Entities & Schema
- `Candidate`:
  - `id`: unique string
  - `fullName`: string
  - `age`: number
  - `education`: degree & major (e.g., کارشناسی ارشد بیوتکنولوژی، دکتری مهندسی)
  - `occupation`: current position / company or university
  - `city`: current residence
  - `referralSource`: mutual colleague, academic circle, family, etc.
  - `pipelineStage`: `'discovery' | 'screening' | 'pre_contact' | 'in_dialogue' | 'deep_courtship' | 'decision' | 'archived'`
  - `ratings`:
    - `values`: { integrity: 1-10, worldviewMatch: 1-10, familyCulture: 1-10 }
    - `academicIntellectual`: { academicUnderstanding: 1-10, intellectualSynergy: 1-10, careerAmbition: 1-10 }
    - `lifestyle`: { workLifeBalance: 1-10, personalInterests: 1-10, locationFlexibility: 1-10 }
    - `emotional`: { emotionalMaturity: 1-10, communicationStyle: 1-10, conflictResolution: 1-10 }
  - `dealBreakers`: { passedAll: boolean, notes?: string }
  - `calculatedScore`: number (0-100)
  - `notes`: string
  - `interactions`: Array of timestamped interaction notes
- `CriteriaWeights`:
  - `valuesWeight`: number (default 30)
  - `academicWeight`: number (default 25)
  - `lifestyleWeight`: number (default 20)
  - `emotionalWeight`: number (default 25)
- `DealBreakerRule`:
  - `id`: string, `label`: string, `active`: boolean

### Outreach Message Frameworks
- Templated scripts with placeholder variables for dignified first-step contact:
  - Approach via academic advisor or peer.
  - Direct message referencing common research interests or shared professional circles.
  - Respectful follow-up and clarity regarding mutual expectations.

---
*Ready for user review.*
