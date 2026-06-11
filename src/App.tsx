import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricsCard from './components/MetricsCard';
import MetricCharts from './components/MetricCharts';
import PredictiveInsights from './components/PredictiveInsights';
import LiveFeed from './components/LiveFeed';
import NetworkHealthHeatMap from './components/NetworkHealthHeatMap';
import type { MetricSummary, CorrelationData, HourlyTrendData, NetworkMetric } from './types';
import { Activity, Shield, Cpu, RefreshCw, Layers, Download } from 'lucide-react';
import { generateSREReport } from './utils/pdfGenerator';

export default function App() {
  const [isLive, setIsLive] = useState<boolean>(true);
  const [simulateAnomaly, setSimulateAnomaly] = useState<boolean>(false);
  
  // Dashboard states
  const [metrics, setMetrics] = useState<MetricSummary | null>(null);
  const [prevMetrics, setPrevMetrics] = useState<MetricSummary | null>(null);
  const [correlationData, setCorrelationData] = useState<CorrelationData[]>([]);
  const [renderCorrelationData, setRenderCorrelationData] = useState<CorrelationData[]>([]);
  const [hourlyTrendData, setHourlyTrendData] = useState<HourlyTrendData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // Core metrics fetcher
  const fetchDashboardData = async (bypassLoading = false) => {
    if (!bypassLoading) setLoading(true);
    try {
      const response = await fetch(`/api/metrics?simulateAnomaly=${simulateAnomaly}`);
      if (!response.ok) {
        throw new Error('Failed to fetch telemetry metrics payloads.');
      }
      const data = await response.json();
      
      // Update metrics state while maintaining a history of the immediate previous interval
      setMetrics((currentMetrics) => {
        if (currentMetrics) {
          setPrevMetrics(currentMetrics);
        }
        return data.metrics;
      });

      setCorrelationData(data.correlationData);
      setRenderCorrelationData(data.renderCorrelationData);
      setHourlyTrendData(data.hourlyTrendData);
      setError(null);
    } catch (err: any) {
      console.error('Telemetry fetch error:', err);
      setError('Telemetry collection agent offline. Re-initializing gateway...');
    } finally {
      if (!bypassLoading) setLoading(false);
    }
  };

  // Run initial loading of the dashboard
  useEffect(() => {
    fetchDashboardData();
  }, [simulateAnomaly]);

  // Polling for live-streaming effects
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      fetchDashboardData(true); // silent update for seamless real-time feel
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive, simulateAnomaly]);

  // Action to download high-fidelity PDF SRE metrics report
  const handleDownloadReport = async () => {
    if (!metrics || isGeneratingPdf) return;
    
    setIsGeneratingPdf(true);
    try {
      // High-DPI programmatic vector SRE report to avoid iframe canvas sandbox failures
      generateSREReport(metrics, hourlyTrendData, simulateAnomaly, currentStatusState);
    } catch (err) {
      console.error("PDF engine failure:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Determine current active network overall health
  const getOverallStatus = (): 'optimal' | 'warning' | 'critical' => {
    if (simulateAnomaly) return 'critical';
    if (!metrics) return 'optimal';
    const cpuVal = hourlyTrendData[hourlyTrendData.length - 1]?.serverCpu || 0;
    const pageLoadVal = metrics.pageLoadTime.value as number;
    if (pageLoadVal > 1.1 || cpuVal > 75) return 'critical';
    if (pageLoadVal > 0.85 || cpuVal > 50) return 'warning';
    return 'optimal';
  };

  const currentStatusState = getOverallStatus();

  return (
    <div className="min-h-screen text-slate-100 font-sans tracking-wide bg-gradient-to-br from-[#0c0d19] via-[#11122a] to-[#07080f] selection:bg-indigo-500/30 selection:text-white">
      
      {/* Absolute ambient lights background */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-1/4 h-[600px] w-[600px] rounded-full bg-purple-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-[10%] h-[400px] w-[400px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

      {/* Main sticky navigation */}
      <Header
        isLive={isLive}
        setIsLive={setIsLive}
        simulateAnomaly={simulateAnomaly}
        setSimulateAnomaly={setSimulateAnomaly}
        currentNetworkStatus={currentStatusState}
      />

      <main id="main-telemetry-dashboard" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Error Notification Alert */}
        {error && (
          <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 shadow-lg backdrop-blur-md">
            <p className="text-sm font-semibold text-red-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              {error}
            </p>
          </div>
        )}

        {/* Top summary section */}
        <div id="quick-telemetry-overview" className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
              System Telemetry Central
            </h1>
            <p className="text-xs text-slate-400 max-w-lg mt-0.5">
              Live dashboard auditing core response benchmarks, user engagement paths, and server ingress matrices continuously.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/5 bg-white/[0.02] text-xs font-mono text-slate-300">
              <Shield className="h-3.5 w-3.5 text-indigo-400" />
              SRE AGENT SECURED
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/5 bg-white/[0.02] text-xs font-mono text-slate-300">
              <Cpu className="h-3.5 w-3.5 text-amber-500 text-yellow-400" />
              HOST: CLOUD_RUN
            </span>
            <button
              id="manual-refresh-dashboard"
              onClick={() => fetchDashboardData(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono font-bold text-indigo-300 hover:bg-indigo-500/20 transition-all duration-200"
              title="Manual Telemetry Flush"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              FLUSH TELEMETRY
            </button>
          </div>
        </div>

        {loading && !metrics ? (
          /* Large SRE Initialization block */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="relative flex h-14 w-14 items-center justify-center mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <Activity className="h-6 w-6 text-indigo-400 animate-pulse" />
            </div>
            <p className="text-sm text-indigo-300 font-mono animate-pulse">
              Syncing local telemetry nodes and mapping gateway streams...
            </p>
          </div>
        ) : (
          <>
            {/* KPI Controls / Action Bar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h2 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Network Benchmarks
              </h2>
              {metrics && (
                <button
                  id="download-telemetry-report"
                  disabled={isGeneratingPdf}
                  onClick={handleDownloadReport}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all duration-200 ${
                    isGeneratingPdf 
                      ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20'
                  }`}
                  title="Download professionally formatted PDF report"
                >
                  {isGeneratingPdf ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-500 border-t-emerald-400 animate-spin" />
                      GENERATING PDF...
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5" />
                      DOWNLOAD PDF REPORT
                    </>
                  )}
                </button>
              )}
            </div>

            {/* KPI Cards Grid */}
            <div id="kpi-metrics-grid" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {metrics && (Object.values(metrics) as NetworkMetric[]).map((metric) => {
                const prevMetric = prevMetrics
                  ? (Object.values(prevMetrics) as NetworkMetric[]).find((m) => m.id === metric.id) || null
                  : null;
                return (
                  <MetricsCard
                    key={metric.id}
                    metric={metric}
                    prevMetric={prevMetric}
                  />
                );
              })}
            </div>

            {/* Ingress Logs & Predictive Insights Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left Column: Logs Tracer Terminal */}
              <div className="lg:col-span-5 flex flex-col">
                <LiveFeed simulateAnomaly={simulateAnomaly} isLive={isLive} />
              </div>
              
              {/* Right Column: Predictive Recommendation Console */}
              <div className="lg:col-span-7">
                {metrics && (
                  <PredictiveInsights
                    metrics={metrics}
                    hourlyData={hourlyTrendData}
                    simulateAnomaly={simulateAnomaly}
                  />
                )}
              </div>
            </div>

            {/* Network Ingress Segment Heat Map */}
            <NetworkHealthHeatMap simulateAnomaly={simulateAnomaly} />

            {/* Interactive Charts Area */}
            <MetricCharts
              correlationData={correlationData}
              renderCorrelationData={renderCorrelationData}
              hourlyTrendData={hourlyTrendData}
              currentLoadTimeValue={metrics ? (metrics.pageLoadTime.value as number) : 0.7}
            />
          </>
        )}
      </main>

      {/* SRE Footer Section */}
      <footer className="border-t border-white/5 bg-slate-950/40 py-6 mt-16 font-mono text-[10px] text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-indigo-400" />
            <span>METRIC AGENT PROTOCOL SUITE 802.11X</span>
          </div>
          <div>
            <span>COMMITTED ENVIRONMENT: VERCEL DEPLOYMENT CONFIG STABLE</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} Matthew Thekiso | NetMonitor v2.4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
