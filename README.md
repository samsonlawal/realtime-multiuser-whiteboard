# Reeley — Real-time Multiuser Whiteboard

> A low-latency, high-frequency vector canvas engineered for system design sketching, collaborative diagramming, and multi-tenant live presence.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React: 19](https://img.shields.io/badge/React-19.2-61dafb.svg)
![TailwindCSS: v4](https://img.shields.io/badge/Tailwind-v4.0-38bdf8.svg)
![Vite: 8](https://img.shields.io/badge/Vite-8.3-646cff.svg)
![Canvas: HTML5 60fps](https://img.shields.io/badge/Canvas-HTML5_60fps-10b981.svg)

---

## 📌 Executive Summary & Problem Space

Building a collaborative, real-time whiteboard in standard declarative frontend frameworks (like React) almost always leads to a common performance cliff: **the 16.6ms frame budget trap**.

### The Naive Architecture Trap
When user input (stylus drags, mouse movements at 120Hz polling rates) is funneled directly into React state (`useState` / `useReducer`):
1. Every pointer event triggers a full component re-render.
2. Virtual DOM trees are regenerated and diffed up to 120 times every second.
3. Garbage collection pauses stutter the browser main thread, dropping frames below 60fps.
4. Unbounded arrays of raw polygonal coordinate points generate jagged, robotic lines.

**Reeley solves this by decoupling high-frequency transient state from declarative component rendering.** React serves strictly as an application shell; the canvas drawing pipeline and presence layers run directly on the browser's GPU compositor and native 2D canvas context.

---

## 🏗️ System Architecture Topology

The application is structured as a distributed real-time pipeline separating edge ingress, state synchronization, caching, and persistence:

```text
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT TIER                           │
│                                                             │
│   ┌──────────────────────────┐   ┌───────────────────────┐  │
│   │   React 19 Shell (UI)    │   │  Native Canvas Engine │  │
│   │   • Toolbars & Modals    │   │  • 60fps rAF Paint    │  │
│   │   • Room Management      │   │  • Bézier Smoothing   │  │
│   └─────────────┬────────────┘   └───────────┬───────────┘  │
│                 │ (State Commit)             │ (Pointer/Raw)│
└─────────────────┼────────────────────────────┼──────────────┘
                  │                            │
                  ▼                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    EDGE & INGRESS LAYER                     │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                 API Gateway (Reverse Proxy)          │   │
│   │                 • AuthN / AuthZ Verification        │   │
│   │                 • Rate Limiting & Token Bucket       │   │
│   │                 • SSL Termination & Connection Drain │   │
│   └──────────────────────────┬──────────────────────────┘   │
└──────────────────────────────┼──────────────────────────────┘
                               │ (WebSocket Upgrade / WSS)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  REALTIME COMPUTE CLUSTER                   │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │           Sync Server (WebSocket Hub :8080)          │   │
│   │           • Ephemeral Room Session Management       │   │
│   │           • Ordered Delta Broadcast                 │   │
│   │           • Conflict-Free Event Serialization       │   │
│   └─────────────┬───────────────────────────┬───────────┘   │
└─────────────────┼───────────────────────────┼───────────────┘
                  │                           │
                  ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│     IN-MEMORY CACHE       │   │    PERSISTENT STORAGE     │
│                           │   │                           │
│   Redis (Port :6379)      │   │   PostgreSQL (Port :5432) │
│   • Pub/Sub Room Mesh     │   │   • Canvas State Store    │
│   • Compressed Snapshots  │   │   • User-Scoped History   │
│   • Ephemeral Presence    │   │   • Immutable Audit Log   │
└───────────────────────────┘   └───────────────────────────┘
```

---

## 🔬 Core Engineering Primitives

### 1. Zero-Render Presence (Compositor Offloading)
* **The Problem:** Tracking remote and local cursors via React state invalidates the parent tree on every pixel movement.
* **The Solution:** Cursors are implemented as **uncontrolled DOM elements** using direct `useRef` handles. Coordinate updates bypass React's Virtual DOM reconciliation entirely and write directly to:
  ```js
  element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  ```
* **Performance Guarantee:** 0 React re-renders during active pointer tracking. `transform` operates exclusively on the GPU Compositor thread, skipping browser Layout (reflow) and Paint (rasterization).

### 2. Quadratic Bézier Path Smoothing
* **The Problem:** Sampling mouse or stylus coordinates produces discrete, sharp polygonal lines when drawn fast across high-DPI screens.
* **The Solution:** Rather than joining points $(x_n, y_n)$ with straight segments, midpoints between sequential coordinates are calculated on the fly as control points:
  $$M_i = \left(\frac{x_i + x_{i+1}}{2}, \frac{y_i + y_{i+1}}{2}\right)$$
  The renderer draws quadratic Bézier curves from $M_{i-1}$ to $M_i$ using $P_i$ as the control tangent, generating organic, ink-like paths at near-zero CPU overhead.

### 3. User-Scoped History Engine (Non-Destructive Undo/Redo)
* **The Invariant:** In a multi-tenant room, a global undo stack breaks user expectations (User A presses `Ctrl+Z` and accidentally erases User B's latest diagram).
* **The Mechanism:** Every stroke maintains deterministic metadata:
  ```json
  { "strokeId": "str_9f8a", "userId": "usr_dev42", "points": [...] }
  ```
  Undoing pops only the calling user's latest committed action from the active render list while preserving all collaborative strokes contributed by peers.

### 4. Compressed Snapshot Catch-Up Sync
* When a collaborator joins a session that has been running for hours, transmitting thousands of granular delta events saturates client memory and blocks the network thread.
* **Protocol:** The server compiles active strokes into a serialized binary snapshot. The client receives the single compressed baseline snapshot, hydrates the canvas buffer, and then subscribes to the incremental live event stream.

---

## 📡 Wire Protocol & Data Contracts

All WebSocket communication between client and server adheres to strict JSON event schemas:

| Event Type | Direction | Payload Structure | Description |
| :--- | :--- | :--- | :--- |
| `CURSOR_MOVE` | Client &rarr; Server | `{ x: number, y: number }` | Throttled live pointer coordinates |
| `STROKE_START` | Client &rarr; Server | `{ strokeId: string, point: Point, tool: string, color: string }` | Initiates an active pen or shape stroke |
| `STROKE_APPEND` | Client &rarr; Server | `{ strokeId: string, points: Point[] }` | Batched chunk of coordinate points |
| `STROKE_COMMIT` | Client &rarr; Server | `{ strokeId: string }` | Finalizes stroke and writes to persistent stack |
| `STROKE_UNDO` | Client &rarr; Server | `{ strokeId: string }` | Signals user-scoped stroke retraction |
| `ROOM_SNAPSHOT` | Server &rarr; Client | `{ roomId: string, strokes: Stroke[], users: User[] }` | Full baseline state delivery on initial connection |

---

## 📁 Repository Directory Blueprint

```text
realtime-multiuser-whiteboard/
├── .github/
│   └── workflows/
│       └── ci.yml               # Non-duplicating CI quality gate (Lint + Build)
├── public/                      # Static brand assets, favicon, SVGs
├── src/
│   ├── components/
│   │   ├── Home/                # Landing presentation, Hero, Architecture cards
│   │   ├── Canvas/              # Dual-layer whiteboard engine & drawing stage
│   │   ├── Toolbar/             # Brush size, color picker, active tool selection
│   │   ├── UserPresence/        # GPU-composited live cursors & collaborator badges
│   │   └── reusables/           # Design system tokens (Button, Card, Badges)
│   ├── hooks/                   # Lifecycle & event binders (useCanvas, useSocket)
│   ├── services/                # WebSocket client singletons & reconnect handlers
│   ├── utils/                   # Pure deterministic math (Bézier, coordinate transforms)
│   ├── App.jsx                  # Root view switcher
│   ├── index.css                # Tailwind v4 @theme design tokens & custom utilities
│   └── main.jsx                 # Application entrypoint
├── index.html                   # HTML shell with OpenGraph and meta SEO tags
├── vite.config.js               # Vite build configuration with React plugin
└── package.json                 # Project dependencies & scripts
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- `npm` or `pnpm`

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/realtime-multiuser-whiteboard.git
   cd realtime-multiuser-whiteboard
   ```

2. **Install exact dependencies:**
   ```bash
   npm ci
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Navigate to [http://localhost:5173](http://localhost:5173).

---

## 🧪 Quality Gates & CI

This repository enforces automated quality gates on every Pull Request via [GitHub Actions](.github/workflows/ci.yml):

- **ESLint:** Code quality & hook rule verification (`npm run lint`).
- **Production Build:** Rollup bundle compilation verification (`npm run build`).
- **Concurrency Control:** Automatic cancellation of stale in-flight pipeline runs when new commits are pushed.

```bash
# Run validation locally prior to committing:
npm run lint
npm run build
```

---

## 📄 License
Distributed under the **MIT License**. Free for educational and commercial use.
