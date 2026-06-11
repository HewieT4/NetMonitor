import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, RefreshCw } from 'lucide-react';

interface LiveFeedProps {
  simulateAnomaly: boolean;
  isLive: boolean;
}

interface LogEntry {
  timestamp: string;
  type: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
  message: string;
  id: string;
}

export default function LiveFeed({ simulateAnomaly, isLive }: LiveFeedProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  // Generate some helper templates
  const getRandomIp = () => {
    return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`;
  };

  const getLogTemplate = (anomaly: boolean): LogEntry => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${(now.getMilliseconds() / 10).toFixed(0).padStart(2, '0')}`;
    const id = Math.random().toString(36).substring(2, 9);

    if (anomaly) {
      const issues = [
        { type: 'ERROR' as const, msg: `TCP Sync Leak warning: Gateway dropping frame buffers at route ${getRandomIp()} (ERR_PKT_LOST)` },
        { type: 'WARN' as const, msg: `Latency fluctuation on Upstream ISP: Cisco Router B gp-4-2.8 ms exceeds 150ms limit` },
        { type: 'ERROR' as const, msg: `Internal server buffer choke: core container thread pool saturated (CPU > 85%)` },
        { type: 'WARN' as const, msg: `LUX Experience Index collapsing: User bounce threshold reached at ${getRandomIp()}` },
        { type: 'ERROR' as const, msg: `Inbound traffic overflow on port 443. Core web server experiencing high backlog queue` },
      ];
      const issue = issues[Math.floor(Math.random() * issues.length)];
      return { timestamp: timeStr, type: issue.type, message: issue.msg, id };
    } else {
      const normals = [
        { type: 'SUCCESS' as const, msg: `Inbound packet routing successful: ${getRandomIp()} -> HTTPS | 200 OK | size: ${Math.floor(Math.random() * 3200) + 120} bytes` },
        { type: 'INFO' as const, msg: `Health confirmation: All edge-nodes (Cloud Run hosts) reports zero buffer latency` },
        { type: 'SUCCESS' as const, msg: `Assets delivered: CDN hit-rate 98.4% for static LUX assets at ${getRandomIp()}` },
        { type: 'INFO' as const, msg: `Database connection queue stable: 4 active pools, zero queues backlogged` },
        { type: 'INFO' as const, msg: `Traffic balance optimal on ingress group balancer | load factor 0.38` },
      ];
      const normal = normals[Math.floor(Math.random() * normals.length)];
      return { timestamp: timeStr, type: normal.type, message: normal.msg, id };
    }
  };

  useEffect(() => {
    // Generate initial set of logs
    const initialLogs: LogEntry[] = Array.from({ length: 12 }, (_, i) => {
      const pastNow = new Date(Date.now() - (12 - i) * 2000);
      const timeStr = `${pastNow.getHours().toString().padStart(2, '0')}:${pastNow.getMinutes().toString().padStart(2, '0')}:${pastNow.getSeconds().toString().padStart(2, '0')}.22`;
      return {
        id: `initial-${i}`,
        timestamp: timeStr,
        type: 'SUCCESS',
        message: `NetMonitor agent successfully deployed and tracking active packet matrices. Secure connection verified.`,
      };
    });
    setLogs(initialLogs);
  }, []);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setLogs((prev) => {
        const nextLog = getLogTemplate(simulateAnomaly);
        // keep maximum of 40 logs in terminal view memory
        const trimmed = prev.length > 40 ? prev.slice(prev.length - 40) : prev;
        return [...trimmed, nextLog];
      });
    }, simulateAnomaly ? 1200 : 2500); // Trigger anomalies faster to convey urgency!

    return () => clearInterval(interval);
  }, [isLive, simulateAnomaly]);

  // Scroll to bottom of terminal locally on logs update without hijacking browser scroll
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [logs]);

  const clearConsole = () => {
    setLogs([{
      id: 'clear',
      timestamp: new Date().toLocaleTimeString(),
      type: 'INFO',
      message: 'Console buffers purged by operator.',
    }]);
  };

  return (
    <div
      id="live-terminal-feed-container"
      className="rounded-2xl border border-white/5 bg-slate-950 p-4 font-mono shadow-[inset_0_1px_4px_rgba(0,0,0,0.5),0_4px_30px_rgba(0,0,0,0.3)] flex flex-col h-[320px] sm:h-[380px]"
    >
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-300">LIVE GATEWAY PACKET TRACER (INGRESS)</span>
          {isLive && (
            <span className="flex h-2 w-2 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            id="clear-console-btn"
            onClick={clearConsole}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            CLEAR
          </button>
          <div className="flex gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
          </div>
        </div>
      </div>

      {/* Terminal logs body */}
      <div
        ref={terminalBodyRef}
        className="flex-1 overflow-y-auto px-1 space-y-1.5 text-[11px] overscroll-contain custom-scrollbar selection:bg-indigo-500/35 selection:text-white"
      >
        {logs.map((log) => {
          let badgeColor = 'text-indigo-400';
          let messageColor = 'text-slate-300';
          
          if (log.type === 'ERROR') {
            badgeColor = 'text-red-400 bg-red-500/10 px-1 py-0.2 rounded border border-red-500/10';
            messageColor = 'text-red-300 font-bold';
          } else if (log.type === 'WARN') {
            badgeColor = 'text-yellow-400 bg-yellow-500/10 px-1 py-0.2 rounded border border-yellow-500/10';
            messageColor = 'text-yellow-250';
          } else if (log.type === 'SUCCESS') {
            badgeColor = 'text-emerald-400';
          }

          return (
            <div key={log.id} className="flex items-start gap-2 hover:bg-white/[0.02] py-0.5 rounded group transition-all duration-100">
              <span className="text-slate-500 select-none group-hover:text-slate-400 transition-colors">[{log.timestamp}]</span>
              <span className={`font-semibold tracking-wider text-[10px] select-none ${badgeColor}`}>{log.type}</span>
              <span className={`leading-relaxed break-all ${messageColor}`}>{log.message}</span>
            </div>
          );
        })}
      </div>

      {/* Console Input Simulation Bar */}
      <div className="border-t border-white/5 mt-3 pt-3 flex items-center justify-between text-[10px] text-slate-500 select-none">
        <div className="flex items-center gap-1">
          <span className="text-indigo-400 font-bold">&gt;_</span>
          <span>telnet network-traffic-agent-0.0.0.0.3000 --listening</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Shield className="h-3 w-3 text-indigo-400" />
          <span>FIPS COMPLIANT BUFFER SECURED</span>
        </div>
      </div>
    </div>
  );
}
