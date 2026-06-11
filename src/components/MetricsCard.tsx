import React from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, Eye, BarChart2, Activity, Hourglass, Smartphone, ArrowUp, ArrowDown } from 'lucide-react';
import type { NetworkMetric } from '../types';

interface MetricsCardProps {
  metric: NetworkMetric;
  prevMetric?: NetworkMetric | null;
  key?: string | number;
}

export default function MetricsCard({ metric, prevMetric }: MetricsCardProps) {
  const getIcon = (id: string) => {
    switch (id) {
      case 'page-load':
        return <Clock className="h-5 w-5 text-amber-400" />;
      case 'page-views':
        return <Eye className="h-5 w-5 text-indigo-400" />;
      case 'bounce-rate':
        return <Activity className="h-5 w-5 text-coral-500 text-red-400" />;
      case 'total-sessions':
        return <BarChart2 className="h-5 w-5 text-indigo-400" />;
      case 'session-length':
        return <Hourglass className="h-5 w-5 text-amber-500 text-yellow-400" />;
      case 'pvs-per-session':
      default:
        return <Smartphone className="h-5 w-5 text-purple-400" />;
    }
  };

  // Calculate percentage change compared to the previous polling interval
  const getPollPercentageChange = (): number | null => {
    if (!prevMetric) return null;
    const currentVal = typeof metric.value === 'string' ? parseFloat(metric.value) : metric.value;
    const prevVal = typeof prevMetric.value === 'string' ? parseFloat(prevMetric.value) : prevMetric.value;
    if (isNaN(currentVal) || isNaN(prevVal) || prevVal === 0) return null;
    
    return ((currentVal - prevVal) / prevVal) * 100;
  };

  const pollChange = getPollPercentageChange();

  // Helper to generate a nice SVG Sparkline from historical data
  const generateSparkline = (data: { value: number }[]) => {
    if (!data || data.length === 0) return '';
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const height = 30;
    const width = 100;
    const points = data
      .map((d, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((d.value - min) / range) * height;
        return `${x},${y}`;
      })
      .join(' ');
    return points;
  };

  const sparklinePoints = generateSparkline(metric.historicalData);

  return (
    <div
      id={`metric-card-${metric.id}`}
      className="relative overflow-hidden rounded-2xl bg-white/[0.04] border border-white/5 p-5 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.07] hover:border-white/10 group shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
    >
      {/* Gloss effect overlay */}
      <div className="absolute -inset-y-12 -inset-x-12 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 transition-colors">
          {getIcon(metric.id)}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`flex items-center text-xs font-mono font-medium ${
              metric.isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
            title="Aggregated metric interval trend"
          >
            {metric.isPositive ? (
              <ArrowUpRight className="h-3.5 w-3.5 inline" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5 inline" />
            )}
            {metric.change}
          </span>

          {pollChange !== null && (
            <span
              className={`flex items-center gap-0.5 text-[10px] font-mono leading-none px-1 py-0.5 rounded bg-white/[0.02] border border-white/5 ${
                pollChange >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
              title="Metric change compared to previous polling interval"
            >
              {pollChange >= 0 ? (
                <ArrowUp className="h-2.5 w-2.5 inline" />
              ) : (
                <ArrowDown className="h-2.5 w-2.5 inline" />
              )}
              {pollChange > 0 ? '+' : ''}
              {pollChange.toFixed(2)}%
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-widest font-sans">
          {metric.name}
        </h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-white font-mono">
            {metric.value}
          </span>
          <span className="text-sm font-semibold text-slate-400 font-mono">
            {metric.unit}
          </span>
        </div>
      </div>

      {/* Sparkline & Short Description */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-[11px] leading-relaxed text-slate-400 line-clamp-2 max-w-[60%]">
          {metric.description}
        </p>
        <div className="h-8 w-24">
          <svg className="h-full w-full overflow-visible">
            <polyline
              fill="none"
              stroke={metric.isPositive ? '#34d399' : '#f87171'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={sparklinePoints}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
