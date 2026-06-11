import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Activity, BarChart3, LineChart } from 'lucide-react';
import type { CorrelationData, HourlyTrendData } from '../types';

interface MetricChartsProps {
  correlationData: CorrelationData[];
  renderCorrelationData: CorrelationData[];
  hourlyTrendData: HourlyTrendData[];
  currentLoadTimeValue: number;
}

export default function MetricCharts({
  correlationData,
  renderCorrelationData,
  hourlyTrendData,
  currentLoadTimeValue,
}: MetricChartsProps) {
  const [activeTab, setActiveTab] = useState<'load-vs-bounce' | 'render-vs-bounce'>('load-vs-bounce');

  // Custom tooltips with glass morphism styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div id="chart-tooltip" className="rounded-xl border border-white/10 bg-slate-950/90 p-3 shadow-xl backdrop-blur-md">
          <p className="text-xs font-semibold text-slate-300 font-sans mb-1">{label}</p>
          {payload.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
              <span className="text-xs text-slate-400 font-sans">{item.name}:</span>
              <span className="text-xs font-bold text-white font-mono">
                {item.value}
                {item.unit || ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

      {/* LUX Bounce Rate Correlation Segment */}
      <div
        id="correlation-chart-container"
        className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
              <BarChart3 className="h-4.5 w-4.5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide font-sans">
                LUX Correlations
              </h2>
              <p className="text-[11px] text-slate-400">
                Evaluating the metric threshold against user bounce percentages
              </p>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="flex rounded-xl bg-white/5 p-1 self-start sm:self-auto">
            <button
              id="btn-tab-load-vs-bounce"
              onClick={() => setActiveTab('load-vs-bounce')}
              className={`rounded-lg px-3 py-1 text-xs font-medium font-mono transition-all duration-200 ${
                activeTab === 'load-vs-bounce'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Load vs Bounce
            </button>
            <button
              id="btn-tab-render-vs-bounce"
              onClick={() => setActiveTab('render-vs-bounce')}
              className={`rounded-lg px-3 py-1 text-xs font-medium font-mono transition-all duration-200 ${
                activeTab === 'render-vs-bounce'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Render vs Bounce
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={activeTab === 'load-vs-bounce' ? correlationData : renderCorrelationData}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="bounceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.68 0.2 30)" stopOpacity={0.8} /> {/* Coral */}
                  <stop offset="100%" stopColor="oklch(0.68 0.2 30)" stopOpacity={0.15} />
                </linearGradient>
                <linearGradient id="sampleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.75 0.18 50)" stopOpacity={0.4} /> {/* Gold */}
                  <stop offset="100%" stopColor="oklch(0.75 0.18 50)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
              <XAxis
                dataKey="loadTimeRange"
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                fontFamily="JetBrains Mono"
              />
              <YAxis
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                fontFamily="JetBrains Mono"
                unit="%"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
              <Legend
                verticalAlign="top"
                height={32}
                iconSize={10}
                fontSize={11}
                wrapperStyle={{ color: '#94a3b8', fontSize: '11px', fontFamily: 'sans-serif' }}
              />
              
              {/* Reference line showing current real-time median location */}
              <ReferenceLine
                x={activeTab === 'load-vs-bounce' ? '0.6s - 0.8s' : '0.3s - 0.4s'}
                stroke="oklch(0.75 0.18 50)"
                strokeDasharray="4 4"
                label={{
                  value: `Median (${currentLoadTimeValue}s)`,
                  position: 'insideTopRight',
                  fill: 'oklch(0.75 0.18 50)',
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono',
                  offset: 10,
                }}
              />

              <Bar
                name="Volume Samples"
                dataKey="sampleCount"
                fill="url(#sampleGradient)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                name="Bounce Rate"
                dataKey="bounceRate"
                fill="url(#bounceGradient)"
                radius={[4, 4, 0, 0]}
                unit="%"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 24-Hour Performance Trends Map */}
      <div
        id="trend-chart-container"
        className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
      >
        <div className="flex items-center gap-2.5 border-b border-white/5 pb-4 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
            <LineChart className="h-4.5 w-4.5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide font-sans">
              24-Hour Network Telemetry
            </h2>
            <p className="text-[11px] text-slate-400">
              Correlating server capacity utilization against data throughput and response latency
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.75 0.18 50)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="oklch(0.75 0.18 50)" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.68 0.2 30)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.68 0.2 30)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={9} tickLine={false} fontFamily="JetBrains Mono" />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} fontFamily="JetBrains Mono" />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={32} iconSize={10} fontSize={11} wrapperStyle={{ fontFamily: 'sans-serif' }} />
              
              <Area
                type="monotone"
                name="Traffic Ingress (Gbps)"
                dataKey="trafficLoad"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#trafficGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                name="Host CPU Utilization (%)"
                dataKey="serverCpu"
                stroke="oklch(0.75 0.18 50)"
                fillOpacity={1}
                fill="url(#cpuGradient)"
                strokeWidth={1.5}
                strokeDasharray="4 2"
              />
              <Area
                type="monotone"
                name="Latency Response (ms)"
                dataKey="avgResponseTime"
                stroke="oklch(0.68 0.2 30)"
                fillOpacity={1}
                fill="url(#latencyGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
