import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Heart, RefreshCw, Layers } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  category: 'Ingress' | 'Compute' | 'Storage' | 'Edge Routers';
  errorRate: number; // percentage of failed transactions/packets
  latency: number; // in milliseconds
  status: 'optimal' | 'warning' | 'critical';
  cpuLoad: number; // CPU %
}

interface NetworkHealthHeatMapProps {
  simulateAnomaly: boolean;
}

export default function NetworkHealthHeatMap({ simulateAnomaly }: NetworkHealthHeatMapProps) {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Initial nodes configuration
  const baseNodes: Omit<NetworkNode, 'errorRate' | 'latency' | 'status' | 'cpuLoad'>[] = [
    { id: 'node-cdn-us', name: 'US-East Edge CDN', category: 'Ingress' },
    { id: 'node-cdn-eu', name: 'EU-West Edge CDN', category: 'Ingress' },
    { id: 'node-cdn-ap', name: 'AP-South CDN Edge', category: 'Ingress' },
    { id: 'node-alb-01', name: 'Global Ingress ALB', category: 'Ingress' },
    { id: 'node-api-01', name: 'API Host Gateway-01', category: 'Ingress' },
    { id: 'node-api-02', name: 'API Host Gateway-02', category: 'Ingress' },
    
    { id: 'node-auth-01', name: 'Auth Microservice v2', category: 'Compute' },
    { id: 'node-sess-01', name: 'Session Token Agent', category: 'Compute' },
    { id: 'node-pred-01', name: 'Predictive SRE Daemon', category: 'Compute' },
    { id: 'node-cache-01', name: 'Memory Cache Cluster', category: 'Compute' },
    
    { id: 'node-db-pool', name: 'Primary Database Pool', category: 'Storage' },
    { id: 'node-db-rep', name: 'DB Read Replica Host', category: 'Storage' },
    { id: 'node-obj-store', name: 'Object Assets Bucket', category: 'Storage' },
    { id: 'node-log-01', name: 'Scribe Logs ingestion', category: 'Storage' },

    { id: 'node-rtr-west', name: 'US-West Core Router', category: 'Edge Routers' },
    { id: 'node-rtr-east', name: 'US-East Core Router', category: 'Edge Routers' },
    { id: 'node-rtr-eu', name: 'Frankfurt Giga Router', category: 'Edge Routers' },
    { id: 'node-rtr-tok', name: 'Tokyo Edge Gateway', category: 'Edge Routers' },
  ];

  const generateLiveMetrics = () => {
    const updated = baseNodes.map((base) => {
      let isAnomalyNode = false;
      
      // Select certain critical path nodes to choke during anomaly simulations
      if (simulateAnomaly) {
        if (
          base.id === 'node-alb-01' || 
          base.id === 'node-api-01' || 
          base.id === 'node-db-pool' || 
          base.id === 'node-rtr-east'
        ) {
          isAnomalyNode = true;
        }
      }

      const errorRate = isAnomalyNode
        ? +(12.5 + Math.random() * 8.4).toFixed(1)
        : +(0.1 + Math.random() * 1.5).toFixed(1);

      const latency = isAnomalyNode
        ? Math.round(280 + Math.random() * 140)
        : Math.round(15 + Math.random() * 45);

      const cpuLoad = isAnomalyNode
        ? Math.round(82 + Math.random() * 14)
        : Math.round(20 + Math.random() * 38);

      let status: 'optimal' | 'warning' | 'critical' = 'optimal';
      if (errorRate > 8.0 || cpuLoad > 80 || latency > 200) {
        status = 'critical';
      } else if (errorRate > 3.0 || cpuLoad > 55 || latency > 90) {
        status = 'warning';
      }

      return {
        ...base,
        errorRate,
        latency,
        cpuLoad,
        status,
      } as NetworkNode;
    });

    setNodes(updated);
    setLastUpdated(new Date().toLocaleTimeString());

    // Update selected node references to keep tooltip synced
    if (selectedNode) {
      const liveSelected = updated.find(n => n.id === selectedNode.id);
      if (liveSelected) setSelectedNode(liveSelected);
    } else {
      setSelectedNode(updated[4]); // default select global Ingress ALB
    }
  };

  useEffect(() => {
    generateLiveMetrics();
  }, [simulateAnomaly]);

  // Periodic polling for heat map updates to simulate network packet fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      generateLiveMetrics();
    }, 5000);
    return () => clearInterval(interval);
  }, [simulateAnomaly, selectedNode]);

  const getNodeColor = (status: 'optimal' | 'warning' | 'critical') => {
    switch (status) {
      case 'critical':
        return 'bg-red-500/25 border-red-500/60 hover:bg-red-500/40 shadow-[inset_0_1px_8px_rgba(239,68,68,0.2),0_0_15px_rgba(239,68,68,0.15)] animate-pulse';
      case 'warning':
        return 'bg-amber-500/25 border-amber-500/50 hover:bg-amber-500/40 shadow-[inset_0_1px_8px_rgba(245,158,11,0.15)]';
      case 'optimal':
      default:
        return 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/25 shadow-[inset_0_1px_6px_rgba(16,185,129,0.05)]';
    }
  };

  const getStatusText = (status: 'optimal' | 'warning' | 'critical') => {
    switch (status) {
      case 'critical': return 'CRITICAL ANOMALY';
      case 'warning': return 'HIGH ACTIVITY CHOKE';
      case 'optimal':
      default: return 'ACTIVE / OPERATIONAL';
    }
  };

  return (
    <div
      id="network-health-heatmap-container"
      className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)] flex flex-col h-full"
    >
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
            <Layers className="h-4.5 w-4.5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide font-sans">
              Node Ingress Health Heat Map
            </h2>
            <p className="text-[11px] text-slate-400">
              Real-time transaction success rates across independent routing and database sectors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-500">
            LAST SYNC: {lastUpdated}
          </span>
          <button
            id="btn-rekey-heatmap"
            onClick={generateLiveMetrics}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            title="Flush and poll heat map grids"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main content grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: interactive 18-grid segments map */}
        <div className="md:col-span-8 space-y-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-950/40 p-4 rounded-xl border border-white/5 relative">
            
            {nodes.map((node) => (
              <button
                key={node.id}
                id={`heatmap-cell-${node.id}`}
                onClick={() => setSelectedNode(node)}
                className={`h-11 sm:h-14 rounded-lg border flex flex-col justify-between p-1.5 sm:p-2 cursor-pointer transition-all duration-300 text-left relative overflow-hidden group select-none ${getNodeColor(node.status)} ${
                  selectedNode?.id === node.id ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950 scale-[1.03] z-10' : ''
                }`}
              >
                {/* Micro-indicators */}
                <div className="flex items-start justify-between w-full">
                  <span className="text-[8px] font-bold font-mono text-slate-400 line-clamp-1 truncate max-w-[80%] uppercase group-hover:text-white transition-colors">
                    {node.name.replace('US-', '').replace('Edge ', '').replace('Microservice ', '')}
                  </span>
                  <span className={`w-1 h-1 rounded-full ${
                    node.status === 'optimal' ? 'bg-emerald-400' : node.status === 'warning' ? 'bg-amber-400' : 'bg-red-400 animate-ping'
                  }`} />
                </div>
                
                {/* Metric printout */}
                <span className="text-xs sm:text-sm font-extrabold font-mono tracking-tight text-white block mt-1">
                  {node.errorRate}%
                </span>
              </button>
            ))}

          </div>

          {/* Color legends label */}
          <div className="flex flex-wrap gap-2.5 items-center justify-between text-[10px] font-mono text-slate-500 px-1 pt-1 border-t border-white/5">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 inline-block" />
              Optimal Ingress (&lt;1.5% ERR)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500/25 border border-amber-500/50 inline-block" />
              Latency warning (1.5% - 8.0% ERR)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-red-500/25 border border-red-500/60 inline-block animate-pulse" />
              Critical congestion (&gt;8.0% ERR)
            </span>
          </div>
        </div>

        {/* Right Side: Interactive segment stats inspect panel */}
        <div id="segment-stats-inspector" className="md:col-span-4 h-full">
          {selectedNode ? (
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 h-full flex flex-col justify-between gap-4">
              
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-indigo-400 uppercase tracking-widest">
                  <Activity className="h-3.5 w-3.5" />
                  Segment Diagnostic
                </div>
                
                <h3 className="text-base font-bold text-white tracking-tight mt-1 mb-1 font-sans">
                  {selectedNode.name}
                </h3>
                
                <span className="inline-block px-2 py-0.5 text-[9px] font-extrabold font-mono rounded bg-white/5 text-slate-400 border border-white/10">
                  {selectedNode.category.toUpperCase()}
                </span>
                
                <div className="h-[1px] bg-white/5 my-3 w-full" />

                {/* Grid performance key details */}
                <div className="space-y-3">
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Functional Status:</span>
                    <span className={`text-xs font-extrabold font-mono ${
                      selectedNode.status === 'optimal' ? 'text-emerald-400' : selectedNode.status === 'warning' ? 'text-amber-400' : 'text-red-400 font-bold'
                    }`}>
                      {getStatusText(selectedNode.status)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Segment Failures:</span>
                    <span className="text-xs font-bold text-white font-mono">{selectedNode.errorRate}% rate</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Average Transit Time:</span>
                    <span className="text-xs font-bold text-white font-mono">{selectedNode.latency}ms</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Node Processor Load:</span>
                    <span className="text-xs font-bold text-white font-mono">{selectedNode.cpuLoad}%</span>
                  </div>

                </div>
              </div>

              {/* Status Advisory based on selected node criteria */}
              <div className="bg-slate-950/60 p-3 rounded-lg border border-white/5">
                <p className="text-[10px] leading-relaxed font-mono text-slate-400 flex gap-1.5">
                  <ShieldAlert className={`h-4 w-4 shrink-0 ${selectedNode.status !== 'optimal' ? 'text-amber-400' : 'text-emerald-400'}`} />
                  <span>
                    {selectedNode.status === 'critical'
                      ? 'Advisory: Node experiencing high resource pool starvation. Initiate emergency secondary load balancing.'
                      : selectedNode.status === 'warning'
                      ? 'Advisory: Network queues are fluctuating. Optimize edge caching limits and audit background connection leaks.'
                      : 'Advisory: Routing metrics perfectly healthy and validated. Packet sequences conform to typical standards.'}
                  </span>
                </p>
              </div>

            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 flex items-center justify-center p-6 text-center text-xs text-slate-500 h-full font-mono">
              Hover or Select any segment node of the heat map to investigate.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
