# CivicPulse: AI-Powered Civic Complaint & Action Platform
### Built for Hack2skill: From Complaints to Action

> **CivicPulse** is an enterprise-grade, end-to-end civic complaint and dispatch intelligence system designed to eliminate municipal backlog. It unifies high-speed citizen reporting, Gemini 3.8 Flash understanding, spatial hotspot and cluster detection, and tactical decision-maker workflows into a single cohesive platform.

---

## 🌟 The 4 Lifecycle Stages

```
   [ Stage 1: Capture ] ─────────► [ Stage 2: Understand ] ─────────► [ Stage 3: Reveal ] ─────────► [ Stage 4: Act ]
   • < 1-Minute Submission          • Gemini 3.8 Flash Analysis         • Interactive Map Pins          • Decision-Maker Dispatch
   • 5 Structured Categories        • Explainable Prioritization        • Multi-Failure Hotspots        • 1-Min AI Action Brief
   • Base64 Image Preview           • Semantic Duplicate Linker         • Main St Cascade Cluster       • Live Citizen Tracking
   • Geospatial Coordinates         • Safety Risk Scoring (0-100)       • Inter-Department Correlator   • Verified Resolution Log
```

### Stage 1: Capture (< 1 Minute)
- **Lightning-Fast Submission**: Mobile-optimized form designed to take under 60 seconds from incident discovery to ticket generation.
- **5 Core Categories**:
  1. `Waterlogging` (drainage clogging, roadway flooding, stormwater backup)
  2. `Damaged Roads` (potholes, asphalt collapse, sinkholes, missing manhole covers)
  3. `Garbage Overflow` (commercial dumpster spillage, toxic dumping, illegal waste)
  4. `Broken Streetlights` (unlit intersections, live sparking wires, leaning poles)
  5. `Disrupted Services` (water main rupture, transit disruption, signal failures)
- **Visual Evidence**: Drag-and-drop or camera snapshot with immediate client-side base64 preview and size validation.
- **Interactive Coordinates**: Precise street and coordinate geocoding with one-click demo presets (e.g., *Live Sparking Wire*, *Main Street Flood*, *Missing Manhole Cover*).

### Stage 2: Understand (AI Pipeline)
- **Powered by `@google/genai` (Gemini 3.8 Flash)**: Automatically categorizes reports, generates a concise summary, and evaluates threat severity.
- **Explainable Prioritization**: Outranks reports using plain-language risk factors (e.g., *"Proximity to elementary school (< 50m)"*, *"Live 240V conductor dangling in active rain"*, *"Major transit thoroughfare blocked"*).
- **Intelligent Priority Scoring**: Continuous severity scoring from 0 to 100 with clear tier classifications:
  - `Critical` (Score 80 - 100): Imminent life-safety hazards, open vertical shafts, live high-voltage arcing.
  - `High` (Score 60 - 79): Major transit artery blockage, severe property damage risk.
  - `Medium` (Score 40 - 59): Significant civic nuisance, unlit residential streets.
  - `Low` (Score 15 - 39): Minor maintenance and cosmetic issues.
- **Duplicate Linker**: Uses hybrid semantic token overlap (Jaccard and Dice-Sørensen bigram similarity) and Haversine geospatial proximity to automatically flag and link duplicate complaints to parent tickets, eliminating spam and redundant dispatches.

### Stage 3: Reveal (Map & Hotspots)
- **Interactive Map**: Built with custom Leaflet layers, dark-mode cartography, and custom pulsing SVG pins color-coded by priority.
- **Automatic Cluster / Hotspot Detection**: Groups spatial infrastructure failures along the same street block (e.g., within 280 meters).
- **Cascading Infrastructure Diagnosis**: Uncovers root-cause relationships across categories (e.g., stormwater conduit occlusion causing surface waterlogging, which in turn washes out road sub-base and floods electrical utility junction boxes).
- **Inter-Department Correlator**: Generates joint taskforce recommendations (e.g., dispatching vacuum jetter trucks in coordination with paving crews).

### Stage 4: Act (Workflow & Tracking)
- **Decision-Maker Dispatch Console**: Real-time Kanban board and searchable data table across 4 operational states:
  $$\text{Submitted} \longrightarrow \text{In Review} \longrightarrow \text{Dispatched} \longrightarrow \text{Resolved}$$
- **1-Minute AI Action Briefs**: Instantly converts citizen descriptions into executive operations briefs:
  - Underlying Root Cause Assessment
  - Recommended Specialized Departmental Crew
  - Required Heavy Machinery and Equipment Checklist
  - Mandatory Work-Zone Safety Directives
  - Resolution Timeframe (ETA) and Ballpark Budget Estimate
- **Citizen Tracking View**: Public-facing live transparency portal where submitters enter their Ticket ID to view step-by-step progress, assigned crews, audit notes, and community upvoting.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router with Turbopack), React 19, TypeScript
- **Styling**: Tailwind CSS, Glassmorphic Design System, Custom Neon Glow Tokens
- **Icons**: Lucide Icons
- **AI Engine**: `@google/genai` (Gemini 3.8 Flash) with resilient offline heuristic reasoning fallback
- **Geospatial & Mapping**: Leaflet, OpenStreetMap / Carto Dark Tiles
- **Validation & Security**: Zod Schema Validation, Strict HTML/XSS Sanitization
- **Testing**: Vitest 5.0 with full coverage of AI parsers, spatial clustering, and duplicate detection

---

## 📊 Synthetic Benchmark Dataset (`mockReports.ts`)

The application comes pre-loaded with **42 realistic civic reports** distributed across all 5 categories:
- **Dense Geographic Cluster on Main Street**: Interconnected multi-failure zone comprising flash waterlogging, blocked catch basins, submerged asphalt craters, flooded electrical pull-boxes, and stalled transit buses.
- **Deliberate Duplicate Pairs**:
  - `CP-2026-1004` & `CP-2026-1005`: Commercial food waste overflow behind food court (89% match).
  - `CP-2026-1011` & `CP-2026-1012`: Live sparking power line outside elementary school (94% match).
  - `CP-2026-1022` & `CP-2026-1023`: Axle-breaking asphalt crater on Grand Avenue (91% match).
- **Life-Safety Emergencies**: Uncovered 12-foot manhole pit in bike lane, live 240V sparking line, collapsed pedestrian bridge guardrail, toxic chemical drum leak.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js >= 18.17 (tested on Node v24.19)
- npm or pnpm

### 2. Installation
```bash
git clone https://github.com/firasforge/civicpulse.git
cd civicpulse
npm install
```

### 3. Gemini API Configuration (Optional)
The system is built to work **100% out of the box** with or without an API key using its built-in heuristic municipal intelligence engine. To enable live Gemini 3.8 Flash generation:
```bash
# Set environment variable or create .env.local
export GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running the Automated Test Suite
```bash
npm test
```
Runs 19 automated unit tests across validation, spatial clustering, duplicate detection, and AI pipeline logic.

---

## 🔒 Security & Accessibility (a11y)

- **Input Validation**: All payloads validated server-side using Zod schemas (`CreateReportSchema`, `UpdateReportStatusSchema`).
- **XSS Sanitization**: Text inputs stripped of `<script>` tags, inline event handlers (`onclick`, `onerror`), and `javascript:` protocols.
- **WCAG 2.1 AA Compliance**:
  - High-contrast color tokens and accessible text sizing.
  - Semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`).
  - Screen-reader friendly ARIA labels (`aria-label`, `aria-live="polite"`).
  - Clean plain-text formatting (no raw LaTeX/math strings like $O(\log N)$).

---

## 💡 Limitations & Honesty Note

1. **State Persistence**: Civic complaints, status transitions, and upvotes are maintained in a server-side in-memory store initialized with the 42 benchmark reports. Restarting the server resets state to the default benchmark (a convenient **"Reset Mock Data"** button is also built into the header for judges).
2. **AI Provider Fallback**: When `GEMINI_API_KEY` is present, CivicPulse calls the `@google/genai` SDK using `gemini-3.8-flash`. When omitted or offline, it automatically falls back to its deterministic heuristic risk matrix, ensuring seamless testing without external dependencies.
3. **Map Geocoding**: Coordinates are centered around an urban downtown sector grid (Main Street, Oak Street, 5th Avenue) to showcase dense clustering and spatial proximity algorithms.
