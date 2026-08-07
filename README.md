# ArchCheck — AI System Design Reviewer

<p align="center">
  <img src="app/icon.png" width="128" height="128" alt="ArchCheck Logo" />
</p>

A production-grade, full-stack Next.js 16 web application where software engineers upload system architecture diagrams (clean digital exports from draw.io/Lucidchart OR hand-drawn whiteboard sketches) and receive instant, structured AI evaluation on **Scalability**, **Reliability**, **Bottlenecks**, and **Design Trade-offs** — alongside a canonical, reconstructed **Mermaid.js** flowchart diagram, cloud cost calculations, threat modeling, architecture diff comparison, and ready-to-deploy Infrastructure-as-Code (IaC).

Powered by **Next.js App Router**, **Google Gemini 2.5 Flash Vision**, **Mermaid.js**, and **Tailwind CSS**.

---

## 🌟 Key Features & 5 Advanced Modules

### Core Analysis
- **Dual Diagram Support**: Handles clean digital exports (draw.io, Lucidchart, Miro) AND rough hand-drawn whiteboard sketches with equal high fidelity.
- **Multimodal Gemini 2.5 Vision Pipeline**: Analyzes raw diagram topology (nodes, directed edges, protocols, text blocks) directly using Gemini's latest low-latency vision model.
- **Structured 4-Category System Evaluation**:
  - 🚀 **Scalability**: Identifies single-region dependencies, database write bottlenecks, missing load balancers, and un-sharded data stores.
  - 🛡️ **Reliability**: Surfaces single points of failure (SPOF), missing dead-letter queues (DLQ), unhandled failovers, and lack of database replicas.
  - ⏳ **Bottlenecks**: Highlights synchronous HTTP/gRPC dependency chains, shared lock contention, and monolithic gateway nodes.
  - ⚖️ **Design Trade-offs**: Evaluates intentional design decisions with explicit **Upsides / Benefits** and **Downsides / Costs**.
- **Interactive Mermaid.js Diagram Renderer**: Reconstructs a clean, canonical `flowchart TD` definition with client-side dynamic rendering, **Zoom In / Zoom Out / Reset**, **Copy Raw Code**, **Code Toggle**, and **Full-Screen Modal View**.

---

### 🚀 5 Advanced Features

1. 📥 **Multi-Format Export & Sharing Suite**:
   - Export full architecture evaluation reports in **Markdown (`.md`)**, **JSON (`.json`)**, and **Mermaid Code (`.mmd`)**.
   - Generate compressed, shareable **URL hash links** for instant stateless review sharing.

2. 💰 **Interactive Cloud Cost & Capacity Estimator**:
   - Calculates monthly infrastructure cost estimates across **AWS**, **GCP**, and **Azure**.
   - Interactive **Traffic Scale Slider (10k to 5M DAU)** dynamically scaling bandwidth, database, compute, and cache sizing.

3. 🛡️ **Security & Compliance Audit Engine**:
   - Performs threat modeling analyzing **Data-in-Transit (mTLS)**, **Data-at-Rest (KMS encryption)**, and **Network Ingress risks**.
   - Compliance framework scoring for **SOC 2 Type II**, **HIPAA**, **GDPR**, and **CIS Benchmarks**.

4. 🔀 **Side-by-Side Architecture Diff & Comparison Tool**:
   - Compare baseline architecture (Version A) against optimized refactored architecture (Version B).
   - Side-by-side visual diagram rendering with component delta tracking (+ Added, - Removed, ~ Modified).

5. 🏗️ **Infrastructure-as-Code (IaC) Generator**:
   - Synthesizes ready-to-deploy **Terraform (`main.tf`)**, **Docker Compose (`docker-compose.yml`)**, and **AWS CloudFormation (`cloudformation.json`)** matching the recommended fixes.
   - One-click copy snippets, tabbed code viewer, and multi-file zip download.

6. 💥 **Disaster Recovery (DR) & Chaos Engineering Simulator**:
   - Simulate real-world infrastructure failure scenarios: *Primary Database Outage*, *Redis Cache Thundering Herd*, *10x DDoS Traffic Spike*, and *SQS Queue Backpressure*.
   - **Failure Propagation Graph**: Cascading node degradation visualization with per-service error rate and latency increase estimates.
   - **RTO & RPO Resiliency Metrics**: Recovery Time Objective, Recovery Point Objective, and SLA breach risk cards.
   - **SRE Incident Playbook Generator**: Step-by-step automated remediation runbook per failure scenario.

7. 🤖 **Live AI Architecture Assistant & Refactoring Copilot**:
   - Context-aware Q&A grounded on the uploaded architecture diagram via `/api/copilot` (Gemini 2.5 Flash).
   - **Quick Prompt Chips**: One-click triggers for *Suggest Caching Strategy*, *Add Multi-Region Redundancy*, *Optimize Database Queries*, and *Evaluate Cold-Start Latency*.
   - **One-Click Apply Mermaid Fix**: Apply copilot-suggested diagram changes directly to the live rendered Mermaid diagram.
   - **Floating Drawer Panel**: Slide-over copilot accessible from the dashboard header at any time.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + Custom CSS Design Tokens (`app/globals.css`)
- **AI / Vision Provider**: Google Gemini 2.5 Flash Vision (`@google/generative-ai`)
- **Diagram Renderer**: Mermaid.js (`mermaid`) with dynamic SSR-safe import
- **File Upload**: `react-dropzone`
- **Testing**: Node.js test script (`npm test`)

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18.x or higher
- A Google Gemini API key (get one free at [Google AI Studio](https://aistudio.google.com/app/apikey))

### 2. Installation & Setup

```bash
# Clone repository
git clone https://github.com/Giancyril/ArchCheck.git
cd ArchCheck

# Install dependencies
npm install

# Create environment variable file
```

Create `.env` file in project root:
```ini
GEMINI_API_KEY=your_actual_gemini_api_key_here
NEXT_PUBLIC_MAX_UPLOAD_BYTES=10485760
```
> Note: `.env` is automatically gitignored by the `.env*` rule in `.gitignore`.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Test Suite & Build

```bash
# Run unit test suite
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
│   ├── globals.css                 # CSS Design tokens & background mesh
│   ├── icon.png                    # ArchCheck application favicon & logo
│   ├── layout.tsx                  # Root layout with font setup & metadata
│   └── page.tsx                    # Main App Dashboard
├── components/
│   ├── CategoryDiffTable.tsx       # Structural delta table for arch comparison
│   ├── CompareModal.tsx            # Side-by-side comparison modal overlay
│   ├── ComplianceChecklist.tsx     # SOC2, HIPAA, GDPR framework scoring
│   ├── CostEstimator.tsx           # Cloud cost & capacity calculator panel
│   ├── Dropzone.tsx                # Drag-and-drop image upload with preview
│   ├── ExportModal.tsx             # Multi-format report export modal
│   ├── FeedbackCards.tsx           # Category findings cards & severity badges
│   ├── Header.tsx                  # App navbar, ArchCheck logo, and actions
│   ├── IaCPanel.tsx                # Infrastructure-as-Code panel
│   ├── IaCViewer.tsx               # Tabbed code viewer for Terraform/Docker
│   ├── MermaidViewer.tsx           # Interactive Mermaid.js renderer
│   ├── PipelineProgress.tsx        # Multi-stage animated pipeline loader
│   ├── ProviderComparisonTable.tsx # AWS vs GCP vs Azure cost breakdown
│   ├── SecurityAuditPanel.tsx      # Security threat modeling panel
│   ├── SecurityThreatList.tsx      # Vulnerability cards & attack vector highlights
│   ├── SideBySideViewer.tsx        # Dual Mermaid diagram comparison
│   └── TrafficSlider.tsx           # Interactive DAU traffic volume slider
├── lib/
│   ├── arch-diff.ts                # Architecture delta comparison engine
│   ├── cost-estimator.ts           # Cloud pricing calculation engine
│   ├── export-serializer.ts        # Markdown & JSON report serializer
│   ├── gemini.ts                   # Gemini Vision API integration
│   ├── iac-generator.ts            # Terraform & Docker Compose code synthesizer
│   ├── mermaid-sanitizer.ts        # Mermaid fence stripping & sanitizer
│   ├── reviewer.ts                 # Architecture review prompt & JSON parser
│   ├── sample-diagram.ts           # Built-in sample diagram for instant testing
│   ├── security-auditor.ts         # Threat modeling & compliance auditor engine
│   └── share-url.ts                # Compressed URL hash encoder/decoder
├── types/
│   ├── cost.ts                     # Cloud cost & pricing TypeScript interfaces
│   ├── diff.ts                     # Architecture comparison delta interfaces
│   ├── export.ts                   # Report export & sharing interfaces
│   ├── iac.ts                      # IaC generation interfaces
│   ├── review.ts                   # Core review & finding interfaces
│   └── security.ts                 # Security & compliance audit interfaces
├── tests/
│   ├── mermaid-sanitizer.test.ts   # Sanitizer unit tests
│   └── reviewer-parser.test.ts     # JSON parser unit tests
├── .env                            # Environment variables (gitignored)
├── .gitignore                      # Git ignore rules (.env* protected)
├── tailwind.config.ts              # Custom design system tokens
├── next.config.ts
└── package.json
```

---

## 📡 API Reference

### `POST /api/analyze`

Accepts a base64 encoded architecture diagram image and returns structured evaluation data + Mermaid.js flowchart string.

#### Request Body
```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAE..."
}
```

---

## 🤝 License

MIT License. Designed and developed for production system design reviews.
