# AI System Design Reviewer

A production-grade, full-stack Next.js 16 web application where software engineers upload system architecture diagrams (clean digital exports from draw.io/Lucidchart OR hand-drawn whiteboard sketches) and receive instant, structured AI evaluation on **Scalability**, **Reliability**, **Bottlenecks**, and **Design Trade-offs** — alongside a canonical, reconstructed **Mermaid.js** flowchart diagram.

Powered by **Next.js App Router**, **Google Gemini 2.5 Flash Vision**, and **Mermaid.js**.

---

## 🌟 Key Features

- **Dual Diagram Support**: Handles clean digital exports (draw.io, Lucidchart, Miro) AND rough hand-drawn whiteboard sketches with equal high fidelity.
- **Multimodal Gemini 2.5 Vision Pipeline**: Analyzes raw diagram topology (nodes, directed edges, protocols, text blocks) directly using Gemini's latest low-latency vision model.
- **Structured 4-Category System Evaluation**:
  - 🚀 **Scalability**: Identifies single-region dependencies, database write bottlenecks, missing load balancers, and un-sharded data stores.
  - 🛡️ **Reliability**: Surfaces single points of failure (SPOF), missing dead-letter queues (DLQ), unhandled failovers, and lack of database replicas.
  - ⏳ **Bottlenecks**: Highlights synchronous HTTP/gRPC dependency chains, shared lock contention, and monolithic gateway nodes.
  - ⚖️ **Design Trade-offs**: Evaluates intentional design decisions with explicit **Upsides / Benefits** and **Downsides / Costs**.
- **Interactive Mermaid.js Diagram Renderer**:
  - Reconstructs a clean, canonical `flowchart TD` definition from the diagram.
  - Client-side dynamic rendering with syntax sanitization and error fallback boundaries.
  - Interactive **Zoom In / Zoom Out / Reset**, **Copy Raw Code**, **Code Toggle**, and **Full-Screen Modal View**.
- **Professional Slate/Cyan Design System**: Dark theme (`#09090b` base, `#06b6d4` cyan accent) with 4px/8px spatial rhythm, color-coded severity badges (`CRITICAL`, `WARNING`, `INFO`), and smooth 200–300ms transitions.
- **Drag-and-Drop Dropzone UI**: File drag-and-drop zone with client-side image validation (PNG, JPG, WebP, GIF up to 10MB), image thumbnail preview, and file change controls.
- **Multi-Stage Pipeline Progress Loader**: Step-by-step progress indicator ("Validating → Vision OCR → Risk Evaluation → Mermaid Synthesis").
- **Stateless V1 Architecture**: Zero-database requirement for immediate deployment, fully typed for V2 persistence extensions.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Client (Next.js App Router / React 19)                  │
│ - Dropzone (Drag-and-drop + validation + base64 convert)│
│ - PipelineProgress (Step-by-step progress loader)       │
│ - FeedbackCards (Category accordions + severity badges) │
│ - MermaidViewer (Dynamic import + zoom/pan + modal)     │
└────────────────────────────┬────────────────────────────┘
                             │ POST /api/analyze
                             ▼
┌─────────────────────────────────────────────────────────┐
│ Next.js API Route Handler (/api/analyze)                │
│ - Base64 payload validation (MIME type & size check)     │
│ - Gemini 2.5 Flash Vision Invocation                    │
│ - Mermaid.js Syntax Sanitization & Error Boundary       │
└────────────────────────────┬────────────────────────────┘
                             │ Multimodal Vision Prompt
                             ▼
┌─────────────────────────────────────────────────────────┐
│ Google Gemini 2.5 Flash API                             │
│ - Extracts visual components, nodes, and directed edges │
│ - Evaluates Scalability, Reliability, Bottlenecks       │
│ - Synthesizes valid Mermaid.js flowchart TD definition  │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + Custom CSS Design Tokens (`app/globals.css`)
- **AI / Vision Provider**: Google Gemini 2.5 Flash Vision (`@google/generative-ai`)
- **Diagram Renderer**: Mermaid.js (`mermaid`) with dynamic SSR-safe import
- **File Upload**: `react-dropzone`
- **Testing**: Zero-dependency Node.js test script (`npm test`)

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18.x or higher
- A Google Gemini API key (get one free at [Google AI Studio](https://aistudio.google.com/app/apikey))

### 2. Installation & Setup

```bash
# Clone or navigate to project
cd "AI System Design Reviewer"

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
```

Edit `.env.local`:
```ini
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Test Suite & Build

```bash
# Run unit tests
npm test

# Run production build
npm run build
```

---

## 📂 Project Structure

```
AI System Design Reviewer/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts            # POST /api/analyze API route handler
│   ├── globals.css                 # CSS Design tokens & Tailwind imports
│   ├── layout.tsx                  # Root layout with font setup & metadata
│   └── page.tsx                    # Main App Dashboard
├── components/
│   ├── Dropzone.tsx                # Drag-and-drop image upload with preview
│   ├── FeedbackCards.tsx           # Category findings cards & severity badges
│   ├── Header.tsx                  # App navbar, brand identity, and status badge
│   ├── MermaidViewer.tsx           # Interactive Mermaid.js renderer with zoom/modal
│   └── PipelineProgress.tsx        # Multi-stage animated pipeline loader
├── lib/
│   ├── gemini.ts                   # Gemini API client & base64 parsing helpers
│   ├── mermaid-sanitizer.ts        # Mermaid fence stripping & syntax sanitizer
│   ├── reviewer.ts                 # Architecture review prompt & JSON parser
│   └── sample-diagram.ts           # Built-in sample diagram for quick testing
├── types/
│   └── review.ts                   # TypeScript interfaces for API & findings
├── tests/
│   ├── mermaid-sanitizer.test.ts   # Sanitizer unit tests
│   └── reviewer-parser.test.ts     # JSON parser unit tests
├── scripts/
│   └── run-tests.mjs               # Node test runner script
├── .env.example                    # Environment variable template
├── tailwind.config.ts              # Custom design system tokens
├── next.config.ts
└── package.json
```

---

## 📡 API Reference

### `POST /api/analyze`

Accepts a base64 encoded architecture diagram image and returns structured evaluation data + Mermaid.js flowchart string.

#### Request Header
`Content-Type: application/json`

#### Request Body
```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAE..."
}
```

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "data": {
    "architectureTitle": "3-Tier Web Application Architecture",
    "summary": "Identified a standard 3-tier web topology consisting of a Web Client, API Gateway, Order Service, and primary PostgreSQL database.",
    "confidenceScore": 92,
    "ambiguities": [],
    "categories": {
      "scalability": [
        {
          "id": "scale-1",
          "title": "Single Relational Database Write Bottleneck",
          "severity": "critical",
          "explanation": "All transactional writes flow directly into a single primary PostgreSQL instance without write partitioning.",
          "recommendation": "Introduce Redis cache for read-heavy queries and configure PostgreSQL read replicas."
        }
      ],
      "reliability": [
        {
          "id": "rel-1",
          "title": "Missing Dead Letter Queue (DLQ)",
          "severity": "warning",
          "explanation": "Asynchronous event queues lack a failure retry fallback.",
          "recommendation": "Configure a Dead Letter Queue (DLQ) with exponential backoff."
        }
      ],
      "bottlenecks": [
        {
          "id": "bot-1",
          "title": "Synchronous Payment Gateway Integration",
          "severity": "warning",
          "explanation": "Payment API call blocks the HTTP handler thread, increasing request latency.",
          "recommendation": "Use async webhook callbacks for payment confirmation."
        }
      ],
      "designTradeoffs": [
        {
          "id": "trade-1",
          "title": "Centralized Monolithic API Gateway",
          "severity": "info",
          "explanation": "Simplifies routing and authentication but creates a central blast radius.",
          "benefit": "Unified security policies and simplified routing.",
          "cost": "Gateway outage impacts all downstream services."
        }
      ]
    },
    "mermaidDiagram": "flowchart TD\n  Client[Web Client] --> Gateway[API Gateway]\n  Gateway --> Service[Order Service]\n  Service --> DB[(PostgreSQL Main)]\n  Service --> Cache[(Redis Cache)]"
  }
}
```
