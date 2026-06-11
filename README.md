# Gemini SRE Predictive Analytics Dashboard

A high-performance, real-time Site Reliability Engineering (SRE) telemetry gateway and diagnostic command center. The system is designed to monitor, track, simulate, and mitigate network throughput bottlenecks, traffic anomalies, and resource constraints using advanced predictive modeling.

---

## 🔍 What the System Is
The **Gemini SRE Predictive Analytics Dashboard** is a comprehensive diagnostic monitoring platform built for SRE and network engineering teams. It acts as an active ingress monitor that observes and records database pools, cpu loads, and queues.

It functions as a full-stack dashboard utilizing:
- **A Rich React Frontend**: Built with Vite, Tailwind CSS, Recharts for visual telemetry, and `motion` for fluid interface animations.
- **A Serverless API Layer**: Backed by secure server-side routes that query predictive models, preventing sensitive external API key leakage to the client browser.
- **AI-Powered Diagnostics**: Seamless integrated analysis utilizing Google's Gemini models via the official `@google/genai` library to provide contextual, actionable network health predictions.

---

## ⚙️ What it Does

### 📊 Real-Time Telemetry and Diagnostic Streaming
- **Active Traffic Monitoring**: Tracks and visualizes four critical SRE health vectors at rapid intervals:
  - **Network Ingress Latency**: Current API and pipeline response speeds (ms).
  - **Host Processor CPU Allocation**: Load capacity of the container systems hosting our gateway services (%).
  - **Buffering Telemetry Queue Depth**: The depth of buffered packet buffers awaiting execution queries (count).
  - **Database Connection Pool**: Real-time consumption rates of active database sockets.
- **SLA Threshold Guardrails**: Highlights metrics breaching normal limits or entering critical warning/error operational levels.

### 🧠 Gemini Predictive Insights & Root-Cause Analysis
- **Intelligent Fault Prediction**: Leveraged server-side Gemini intelligence evaluates current performance states and alerts engineers to potential upcoming system failure points.
- **SRE Command Assistant**: Translates raw numeric anomalies into clear, human-readable troubleshooting guidance, identifying root causes (e.g. database starvation, heavy server load) and listing immediate remediation steps.

### ⚡ Synthetic Chaos Engineering (Anomaly Simulator)
- **Bottleneck Congestion Simulation**: Engineers can actively toggle "METRICS CHOKE" or synthetic bottlenecks to simulate realistic incidents.
- **System Failure Drills**: Allows testing how alerts trigger and observing how the Gemini assistant diagnoses an active live incident in a safe sandbox environment.

### 📈 Interactive Network Grid Map
- **Segmented Gateway Status**: Represents the active grid sectors across 18 high-intensity gateway nodes.
- **Anomalous Node Highlighting**: Adapts dynamically as simulated bottlenecks or operational anomalies affect specifically vulnerable ingress branches.

### 📋 Executive PDF Report Exporting
- **One-Click Telemetry Export**: Generates high-DPI, multi-page PDF documents of the current state of the diagnostic monitor.
- **Visual Capture Precision**: Leverages `jspdf` and `html2canvas` to render the active network charts, telemetry numbers, and recent console terminal feeds exactly as shown on the SRE screens.
