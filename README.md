# Gemini SRE Predictive Analytics Dashboard

A high-performance real-time SRE telemetry gateway and diagnostic command center. The system is designed to monitor, track, simulate, and mitigate network throughput bottleneck patterns, traffic anomalies, and memory constraints. Using integrated predictive models and intelligent report generation, this platform provides SRE teams with live operational control.

---

## 🚀 Key Modules and Features

### 1. Unified SRE Telemetry Metrics Panel
- **Real-Time Data Streaming**: Actively monitors key system parameters including:
  - **Network Ingress Latency** (milliseconds)
  - **Host Processor CPU Allocation** (percentage load)
  - **Buffering Telemetry Queue Depth** (buffered packet depth)
  - **Relational Database Connection Pool** (allocated pools)
- **Anomaly Simulation Trigger**: A testbed simulation suite allowing engineers to inject synthetic Bottleneck Congestion anomalies to verify fallback mechanisms and auto-scaling rules.

### 2. High-Fidelity Professional PDF Report Generation
- **jspdf & html2canvas Integration**: Replaces static markdown files with high-DPI executive PDF documents.
- **Visual Capture Precision**: Renders all live canvases, charts, heatmaps, and terminal logs exactly as styled in the application theme, adapting sizes cleanly across multi-page layouts.

### 3. Responsive Mobilized Command Centre
- **Responsive Adaptive Design**: Tailored to function flawlessly on dual-monitor command desks or critical incident mobile screens.
- **Hamburger Action Drawer**: Groups system streaming toggles, anomaly simulators, and contact links into a clean side panel on mobile devices.
- **Scroll Hijacking Mitigation**: Replaced global browser scroll-to-bottom mechanics with local element relative scroll bars in the terminal feed to ensure seamless mobile page navigation.

### 4. Interactive Network Health Grid Heatmap
- **Sector Mapping**: Visualizes packet status across 18 segmented gateway nodes.
- **Dynamic Grid Sizing**: Fluid columns that auto-wrap (from 3-column layouts on mobile to 6-column on desktop grids) to provide glanceable SRE metrics.

---

## 🛠️ Developer and Deployment Guidelines

### ⚡ 1. Initial Local Setup & Dependencies
All system requirements are declared inside `package.json`. To prepare your node environment, execute:
```bash
# Populate node_modules and setup dependencies
npm install
```

### 🖥️ 2. Development Mode
To start the live local runtime with immediate code updates enabled:
```bash
# Run the local server environment
npm run dev
```
The server bounds automatically to `0.0.0.0:3000` to handle external proxy ingress routing.

### 📦 3. Compiling the Production Build
To prepare the system for deployment on Cloud Run, Vercel, or custom servers, bundle the client assets:
```bash
# Build the client files and bundle the SRE server
npm run build
```
This produces optimized production files in the `/dist` directory.

### 🏁 4. Start Production Process
Run the compiled standalone server matching the primary architecture parameters:
```bash
# Spin up the compiled container
npm run start
```

---

## ⚙️ Environment Configurations
Configure sensitive credentials inside a secured `.env` context or your Cloud dashboard settings:
```env
# SRE Core Services Port Requirement
PORT=3000

# Gemini API Key for Server-Side Predictive Intelligence (Not exposed to client)
GEMINI_API_KEY=your_gemini_api_key_here
```

---
*Created and maintained by the NetMonitor Gateway SRE Engineering Team.*
