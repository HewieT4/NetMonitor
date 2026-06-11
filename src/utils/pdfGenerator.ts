import jsPDF from 'jspdf';
import { MetricSummary, HourlyTrendData } from '../types';

export function generateSREReport(
  metrics: MetricSummary,
  hourlyData: HourlyTrendData[],
  simulateAnomaly: boolean,
  overallStatus: 'optimal' | 'warning' | 'critical'
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Colors
  const darkNavy = { r: 12, g: 13, b: 25 };
  const slateDark = { r: 15, g: 23, b: 42 };
  const accentGreen = { r: 16, g: 185, b: 129 };
  const accentRed = { r: 239, g: 68, b: 68 };
  const accentYellow = { r: 245, g: 158, b: 11 };
  const textDark = { r: 30, g: 41, b: 59 };
  const textLight = { r: 100, g: 116, b: 139 };

  // Page 1
  // Header background bar
  doc.setFillColor(darkNavy.r, darkNavy.g, darkNavy.b);
  doc.rect(0, 0, 210, 42, 'F');

  // Header Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("GEMINI SRE TELEMETRY GATEWAY", 15, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(165, 180, 252);
  doc.text("DIAGNOSTIC REPORT BOARD | EXPORT REPORT SECURED | LIVE MONITORING", 15, 26);

  // Metadata right side
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  const now = new Date();
  doc.text(`GENERATED: ${now.toLocaleString()}`, 135, 16);
  doc.text("HOST INFRA: CLOUD RUN SANDBOX", 135, 22);
  doc.text(`SRE AGENT: Matthews Thekiso`, 135, 28);

  // Green horizontal accent line
  doc.setFillColor(accentGreen.r, accentGreen.g, accentGreen.b);
  doc.rect(15, 34, 180, 1.5, 'F');

  // Overall Live Network Status Indicator Card
  doc.setFillColor(248, 250, 252); // Off-white
  doc.rect(15, 50, 180, 22, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.rect(15, 50, 180, 22, 'S');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(textLight.r, textLight.g, textLight.b);
  doc.text("OVERALL SRE SITE HEALTH GATEWAY STATUS", 20, 56);

  doc.setFontSize(12);
  if (overallStatus === 'critical') {
    doc.setTextColor(accentRed.r, accentRed.g, accentRed.b);
    doc.text("● CRITICAL SEGMENTATION BREACH / CONGESTION WARNING", 20, 64);
  } else if (overallStatus === 'warning') {
    doc.setTextColor(accentYellow.r, accentYellow.g, accentYellow.b);
    doc.text("● WARNING - TRANSIENT RESOURCE CONTENTION RUNTIME", 20, 64);
  } else {
    doc.setTextColor(accentGreen.r, accentGreen.g, accentGreen.b);
    doc.text("● NOMINAL OPERATIONS - OPTIMAL BANDWIDTH HIGH STABILITY", 20, 64);
  }

  // Active Anomaly Drill Simulation State Indicator
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(textDark.r, textDark.g, textDark.b);
  doc.text(`SIMULATION MODE: ${simulateAnomaly ? "METRIC BOTTLENECK ACTIVE (ON)" : "STANDARD REAL-TIME STREAMS (OFF)"}`, 20, 69);

  // SECTION 1: CORE TELEMETRY METRICS SUMMARY
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
  doc.text("1. PRIMARY SRE TELEMETRY DATA FIELDS", 15, 82);

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, 84, 195, 84);

  // We draw a compact, neat grid list of the 6 KPIs
  const kpiItems = [
    { label: "Page Load Time (ms)", val: metrics.pageLoadTime.value, desc: metrics.pageLoadTime.description, chg: metrics.pageLoadTime.change, isPos: metrics.pageLoadTime.isPositive },
    { label: "Client Page Views", val: metrics.pageViews.value, desc: metrics.pageViews.description, chg: metrics.pageViews.change, isPos: metrics.pageViews.isPositive },
    { label: "Unregistered Bounce Rate", val: metrics.bounceRate.value, desc: metrics.bounceRate.description, chg: metrics.bounceRate.change, isPos: metrics.bounceRate.isPositive },
    { label: "Active Total Sessions", val: metrics.totalSessions.value, desc: metrics.totalSessions.description, chg: metrics.totalSessions.change, isPos: metrics.totalSessions.isPositive },
    { label: "Average Session Duration", val: metrics.averageSessionLength.value, desc: metrics.averageSessionLength.description, chg: metrics.averageSessionLength.change, isPos: metrics.averageSessionLength.isPositive },
    { label: "Views Multiplier Rate", val: metrics.pageViewsPerSession.value, desc: metrics.pageViewsPerSession.description, chg: metrics.pageViewsPerSession.change, isPos: metrics.pageViewsPerSession.isPositive }
  ];

  let currentY = 90;
  for (let i = 0; i < kpiItems.length; i += 2) {
    const item1 = kpiItems[i];
    const item2 = kpiItems[i + 1];

    // Left Column Card
    doc.setFillColor(252, 253, 254);
    doc.rect(15, currentY, 86, 22, 'F');
    doc.rect(15, currentY, 86, 22, 'S');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(textDark.r, textDark.g, textDark.b);
    doc.text(item1.label, 19, currentY + 6);

    doc.setFontSize(11);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text(String(item1.val), 19, currentY + 13);

    doc.setFontSize(7.5);
    doc.setTextColor(item1.isPos ? accentGreen.r : accentRed.r, item1.isPos ? accentGreen.g : accentRed.g, item1.isPos ? accentGreen.b : accentRed.b);
    doc.text(item1.chg, 19, currentY + 18);

    doc.setTextColor(textLight.r, textLight.g, textLight.b);
    // Draw truncated description
    const desc1 = item1.desc.length > 28 ? item1.desc.substring(0, 28) + "..." : item1.desc;
    doc.text(desc1, 45, currentY + 18);


    // Right Column Card
    if (item2) {
      doc.setFillColor(252, 253, 254);
      doc.rect(109, currentY, 86, 22, 'F');
      doc.rect(109, currentY, 86, 22, 'S');

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(textDark.r, textDark.g, textDark.b);
      doc.text(item2.label, 113, currentY + 6);

      doc.setFontSize(11);
      doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
      doc.text(String(item2.val), 113, currentY + 13);

      doc.setFontSize(7.5);
      doc.setTextColor(item2.isPos ? accentGreen.r : accentRed.r, item2.isPos ? accentGreen.g : accentRed.g, item2.isPos ? accentGreen.b : accentRed.b);
      doc.text(item2.chg, 113, currentY + 18);

      doc.setTextColor(textLight.r, textLight.g, textLight.b);
      const desc2 = item2.desc.length > 28 ? item2.desc.substring(0, 28) + "..." : item2.desc;
      doc.text(desc2, 139, currentY + 18);
    }

    currentY += 26;
  }

  // SECTION 2: RECENT INTEGRATED HOURLY PERFORMANCE TRAFFIC
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
  doc.text("2. HOURLY ROUTING AGENT METRIC INTERVALS", 15, 172);

  doc.setDrawColor(226, 232, 240);
  doc.line(15, 174, 195, 174);

  // Table header
  doc.setFillColor(slateDark.r, slateDark.g, slateDark.b);
  doc.rect(15, 178, 180, 7, 'F');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("TIME NODE", 18, 183);
  doc.text("TRAFFIC LOAD (Gbps)", 48, 183);
  doc.text("AVG LATENCY (ms)", 88, 183);
  doc.text("HOST CPU %", 128, 183);
  doc.text("PACKET DROP RATE", 162, 183);

  // Render recent 5 hours trends
  let trendY = 189;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textDark.r, textDark.g, textDark.b);

  const parsedHourlyData = hourlyData.slice(-5);
  parsedHourlyData.forEach((row, rIdx) => {
    // Alternating background colors
    if (rIdx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, trendY - 4, 180, 6, 'F');
    }

    doc.text(row.time, 18, trendY);
    doc.text(`${row.trafficLoad.toFixed(2)} Gbps`, 48, trendY);
    doc.text(`${row.avgResponseTime.toFixed(1)} ms`, 88, trendY);
    doc.text(`${row.serverCpu.toFixed(1)}%`, 128, trendY);
    
    // Highlight packet loss if more than 0
    if (row.packetLoss > 0) {
      doc.setTextColor(accentRed.r, accentRed.g, accentRed.b);
      doc.text(`${row.packetLoss.toFixed(2)}% (WARN)`, 162, trendY);
      doc.setTextColor(textDark.r, textDark.g, textDark.b);
    } else {
      doc.setTextColor(accentGreen.r, accentGreen.g, accentGreen.b);
      doc.text("0.00% (NOMINAL)", 162, trendY);
      doc.setTextColor(textDark.r, textDark.g, textDark.b);
    }

    trendY += 6;
  });

  // SECTION 3: MITIGATION DIAGNOSIS & REMEDIATION CHECKLIST
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
  doc.text("3. AUTOMATED PREDICTIVE MITIGATION ACTION MANUAL", 15, currentY + 11);

  doc.setDrawColor(226, 232, 240);
  doc.line(15, currentY + 13, 195, currentY + 13);

  const actionY = currentY + 18;
  doc.setFillColor(240, 244, 248);
  doc.rect(15, actionY, 180, 48, 'F');
  doc.rect(15, actionY, 180, 48, 'S');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
  doc.text("GEMINI ANALYTICS AUTONOMOUS MITIGATION STEPS", 20, actionY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textDark.r, textDark.g, textDark.b);

  if (simulateAnomaly) {
    // Critical steps
    const step1 = "1. [CRITICAL] Initialize failover database socket connection pools. Check DB starvation values.";
    const step2 = "2. [CAPACITY] Activate dynamic load shedding policies and set rate limiting thresholds at 1200 req/sec.";
    const step3 = "3. [CONTAINER] Scale Cloud Run microservices. Ensure minimum container instances dynamically increase scale +2.";
    const step4 = "4. [DNS] Reroute incoming edge traffic segments via backup geo-ingress points (South/Africa ingress streams).";
    
    doc.text(step1, 20, actionY + 15);
    doc.text(step2, 20, actionY + 23);
    doc.text(step3, 20, actionY + 31);
    doc.text(step4, 20, actionY + 39);
  } else {
    // Optimal steps
    const step1 = "1. [NOMINAL] Continuously audit pipeline response rates. Current benchmarks fall well under SLA targets.";
    const step2 = "2. [OPTIMIZATION] Maintain passive CPU caches and standard garbage collection routine intervals.";
    const step3 = "3. [ROUTING] Gateway nodes are cleanly distributing load with 0% packet dropped alerts flagged on grids.";
    const step4 = "4. [HEALTH CHECKS] Re-validate automated alert cron scripts every 300 seconds to confirm telemetry line sync.";
    
    doc.text(step1, 20, actionY + 15);
    doc.text(step2, 20, actionY + 23);
    doc.text(step3, 20, actionY + 31);
    doc.text(step4, 20, actionY + 39);
  }

  // Footer separator and page footer text
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(15, 280, 195, 280);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(textLight.r, textLight.g, textLight.b);
  doc.text("CONFIDENTIAL SRE OPERATIVE LOGS - AUTOMATED EXPORT ENCRYPTED SYSTEM REPORT", 15, 285);
  doc.text(`Matthews Thekiso | Page 1 of 1`, 158, 285);

  // Trigger Save PDF Dialog!
  doc.save(`NetMonitor_SRE_Diagnostic_Report_${now.getTime()}.pdf`);
}
