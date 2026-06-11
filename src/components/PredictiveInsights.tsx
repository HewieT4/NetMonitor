import React, { useState, useEffect } from 'react';
import { BrainCircuit, RefreshCw, CheckCircle2, AlertTriangle, XOctagon, Sparkles, Server } from 'lucide-react';
import type { PredictionResponse, MetricSummary, HourlyTrendData } from '../types';

interface PredictiveInsightsProps {
  metrics: MetricSummary;
  hourlyData: HourlyTrendData[];
  simulateAnomaly: boolean;
}

export default function PredictiveInsights({ metrics, hourlyData, simulateAnomaly }: PredictiveInsightsProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [insights, setInsights] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Derive parameters from current state
  const pageLoad = typeof metrics.pageLoadTime.value === 'number' ? metrics.pageLoadTime.value : 0.7;
  const bounce = typeof metrics.bounceRate.value === 'number' ? metrics.bounceRate.value : 40.6;
  const currentHourData = hourlyData[hourlyData.length - 1] || { serverCpu: 45, packetLoss: 0 };
  const cpu = currentHourData.serverCpu;
  const loss = currentHourData.packetLoss;

  const fetchPredictions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageLoadTime: pageLoad,
          bounceRate: bounce,
          serverCpu: cpu,
          packetLoss: loss,
          simulateAnomaly,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: PredictionResponse = await response.json();
      setInsights(data);
    } catch (err: any) {
      console.error('Failed to load predictions:', err);
      setError('Failed to connect to predictive service. Verify API server status.');
    } finally {
      setLoading(false);
    }
  };

  // Run automatically on first boot, or when anomaly toggles to provide fresh predictions immediately!
  useEffect(() => {
    fetchPredictions();
  }, [simulateAnomaly]);

  // A helper function to parse basic markdown elements to pretty HTML
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base font-bold text-white mt-4 first:mt-0 mb-2 font-sans border-b border-white/5 pb-2">
            {line.substring(4)}
          </h3>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-sm font-semibold text-indigo-300 mt-3 mb-1.5 font-sans">
            {line.substring(5)}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-lg font-bold text-white mt-5 first:mt-0 mb-3 border-b border-indigo-500/20 pb-2">
            {line.substring(3)}
          </h2>
        );
      }

      // Bold replacements
      let content = line;
      // Simple regex replacement for bold **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          parts.push(content.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="text-indigo-200 font-semibold">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
      }

      const renderedLine = parts.length > 0 ? parts : content;

      // Unordered lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-5 list-disc text-xs text-slate-300 leading-relaxed py-0.5">
            {line.substring(2)}
          </li>
        );
      }
      // Ordered lists
      const orderedMatch = /^\d+\.\s(.*)/.exec(line);
      if (orderedMatch) {
        return (
          <li key={idx} className="ml-5 list-decimal text-xs text-slate-300 leading-relaxed py-0.5">
            {orderedMatch[1]}
          </li>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-xs text-slate-300 leading-relaxed py-0.5">
          {renderedLine}
        </p>
      );
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return {
          icon: <XOctagon className="h-5 w-5 text-red-400" />,
          titleColor: 'text-red-400',
          borderColor: 'border-red-500/20',
          bgColor: 'bg-red-500/10',
          glow: 'shadow-[0_0_20px_rgba(239,68,68,0.1)]',
          label: 'CRITICAL DIAGNOSIS',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-amber-400" />,
          titleColor: 'text-amber-400',
          borderColor: 'border-amber-500/20',
          bgColor: 'bg-amber-500/10',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.1)]',
          label: 'ANOMALOUS ACTIVITY',
        };
      case 'optimal':
      default:
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
          titleColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/20',
          bgColor: 'bg-emerald-500/10',
          glow: 'shadow-[0_0_20px_rgba(16,185,129,0.1)]',
          label: 'PERFECT STABILITY',
        };
    }
  };

  const currentTheme = insights ? getStatusColor(insights.status) : getStatusColor('optimal');

  return (
    <div
      id="predictive-insights-panel"
      className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)] flex flex-col h-full"
    >
      {/* Panel title */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
            <BrainCircuit className="h-4.5 w-4.5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide font-sans flex items-center gap-1.5">
              Gemini SRE Predictive Analytics
              <Sparkles className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />
            </h2>
            <p className="text-[11px] text-slate-400">
              Machine learning models correlating load latency to suggest critical infrastructure mitigations
            </p>
          </div>
        </div>

        <button
          id="btn-re-evaluate-insights"
          disabled={loading}
          onClick={fetchPredictions}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/10 disabled:opacity-50 transition-all duration-200"
          title="Re-evaluate metrics with Gemini SRE engine"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        /* Loading Skeleton with reassuring SRE quotes */
        <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
          <div className="relative flex items-center justify-center h-16 w-16 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <BrainCircuit className="h-6 w-6 text-indigo-400 animate-pulse" />
          </div>
          <p className="text-xs font-mono text-indigo-300 animate-pulse text-center max-w-sm">
            {simulateAnomaly
              ? 'Analyzing critical telemetry variance paths on Gemini-3.5-flash...'
              : 'Verifying network throughput queues and correlation matrices...'}
          </p>
          <div className="w-full max-w-xs bg-white/5 h-1 mt-4 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full animate-[shimmer_1.5s_infinite]" style={{ width: '40%' }} />
          </div>
        </div>
      ) : error ? (
        /* Error view */
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <XOctagon className="h-10 w-10 text-red-400 mb-2" />
          <p className="text-xs text-red-350">{error}</p>
          <button
            onClick={fetchPredictions}
            className="mt-4 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-indigo-300 hover:text-white transition-colors"
          >
            Retry Analytics Engine
          </button>
        </div>
      ) : insights ? (
        /* Rendered Insights */
        <div className="flex-1 flex flex-col justify-between gap-6">
          
          {/* Status highlight banner */}
          <div className={`p-4 rounded-xl border ${currentTheme.borderColor} ${currentTheme.bgColor} ${currentTheme.glow} transition-all duration-500`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                {currentTheme.icon}
                <div>
                  <div className="text-[10px] font-bold tracking-wider font-mono uppercase text-slate-400">
                    {currentTheme.label}
                  </div>
                  <div className={`text-sm font-bold font-sans ${currentTheme.titleColor}`}>
                    {insights.status === 'optimal'
                      ? 'System is functioning perfectly'
                      : insights.status === 'warning'
                      ? 'Transient performance choke detected'
                      : 'Severe SRE anomaly warning flagged'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold font-mono text-slate-400 block uppercase">confidence</span>
                <span className="text-sm font-extrabold text-white font-mono">{insights.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Deep Insight Text Box */}
          <div id="insight-text-wrapper" className="flex-1 max-h-none md:max-h-72 overflow-visible md:overflow-y-auto pr-2 overscroll-contain custom-scrollbar bg-black/25 rounded-xl border border-white/5 p-4 text-slate-300 text-xs space-y-2">
            {renderMarkdown(insights.insights)}
          </div>

          {/* Actionable recommendations lists */}
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
            <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider font-sans flex items-center gap-1.5">
              <Server className="h-3.5 w-3.5 text-indigo-400" />
              SRE Recommended Precautions
            </h4>
            <ul className="space-y-1.5">
              {insights.recommendedActions.map((action, i) => (
                <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 sm:h-4 sm:w-4 items-center justify-center rounded bg-indigo-500/10 text-[10px] font-mono text-indigo-300 font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{action}</span>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-xs py-10 font-mono">
          Ready for metrics diagnostics.
        </div>
      )}
    </div>
  );
}
