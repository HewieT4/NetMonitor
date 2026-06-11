import React, { useState } from 'react';
import { Activity, Github, Mail, Globe, AlertTriangle, Play, Pause, Menu, X } from 'lucide-react';

interface HeaderProps {
  isLive: boolean;
  setIsLive: (val: boolean) => void;
  simulateAnomaly: boolean;
  setSimulateAnomaly: (val: boolean) => void;
  currentNetworkStatus: 'optimal' | 'warning' | 'critical';
}

export default function Header({
  isLive,
  setIsLive,
  simulateAnomaly,
  setSimulateAnomaly,
  currentNetworkStatus,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getStatusBadge = () => {
    switch (currentNetworkStatus) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-400/10 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            CRITICAL HEALTH
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-400/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            WARNING STATE
          </span>
        );
      case 'optimal':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            OPTIMAL HEALTH
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold tracking-wide text-white uppercase sm:text-base font-sans">
                NetMonitor
              </span>
              <span className="hidden ml-1.5 text-xs text-indigo-400 font-mono sm:inline">v2.4</span>
            </div>
          </div>

          {/* Desktop view controls: hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {/* Live Streaming Toggle */}
            <button
              id="live-stream-btn"
              onClick={() => setIsLive(!isLive)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all duration-300 ${
                isLive
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
              title={isLive ? "Pause real-time streaming simulation" : "Start real-time streaming simulation"}
            >
              {isLive ? <Pause className="h-3.5 w-3.5 animate-pulse text-indigo-400" /> : <Play className="h-3.5 w-3.5" />}
              {isLive ? 'STREAMING ACTIVE' : 'STREAM PAUSED'}
            </button>

            {/* Ingress Anomaly Simulator Toggle */}
            <button
              id="anomaly-simulator-btn"
              onClick={() => setSimulateAnomaly(!simulateAnomaly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all duration-300 ${
                simulateAnomaly
                  ? 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
              title={simulateAnomaly ? "Recover system to standard status" : "Inject synthetic packet bottleneck anomaly"}
            >
              <AlertTriangle className={`h-3.5 w-3.5 ${simulateAnomaly ? 'text-red-400 animate-bounce' : ''}`} />
              <span>{simulateAnomaly ? 'RECOVER TRAFFIC' : 'SIMULATE CHOKE'}</span>
            </button>

            {/* Health Badge */}
            <div>
              {getStatusBadge()}
            </div>
          </div>

          {/* Desktop view links: hidden on mobile */}
          <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-3">
            <a
              id="author-portfolio-link"
              href="https://matthews-thekiso-portfolio.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
              title="Matthew Thekiso Portfolio"
            >
              <Globe className="h-4.5 w-4.5" />
            </a>
            <a
              id="author-github-link"
              href="https://github.com/HewieT"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
              title="HewieT's GitHub profile"
            >
              <Github className="h-4.5 w-4.5" />
            </a>
            <a
              id="author-mail-link"
              href="mailto:sefellethekiso@gmail.com"
              className="flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
              title="Contact Matthews"
            >
              <Mail className="h-4.5 w-4.5" />
            </a>
          </div>

          {/* Mobile Hamburguer button */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            <div className="scale-90 flex">
              {getStatusBadge()}
            </div>
            <button
              id="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-slate-950/95 py-4 px-4 space-y-4 shadow-xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2.5">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1 px-1">
              Actions and simulation controls
            </div>
            
            {/* Live Streaming Toggle */}
            <button
              id="mobile-live-stream-btn"
              onClick={() => {
                setIsLive(!isLive);
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-mono border transition-all duration-200 ${
                isLive
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}
            >
              <span className="flex items-center gap-2">
                {isLive ? <Pause className="h-4 w-4 text-indigo-400" /> : <Play className="h-4 w-4" />}
                SYSTEM FEED STREAM
              </span>
              <span className="text-[10px] font-semibold">
                {isLive ? 'ACTIVE' : 'PAUSED'}
              </span>
            </button>

            {/* Ingress Anomaly Simulator Toggle */}
            <button
              id="mobile-anomaly-simulator-btn"
              onClick={() => {
                setSimulateAnomaly(!simulateAnomaly);
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-mono border transition-all duration-200 ${
                simulateAnomaly
                  ? 'bg-red-500/10 border-red-500/30 text-red-300'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className={`h-4 w-4 ${simulateAnomaly ? 'text-red-400 animate-pulse' : ''}`} />
                METRICS CHOKE
              </span>
              <span className="text-[10px] font-semibold font-mono">
                {simulateAnomaly ? 'RECOVER TRAFFIC' : 'SIMULATE ANOMALY'}
              </span>
            </button>
          </div>

          <div className="h-[1px] bg-white/5 w-full" />

          {/* Author Links */}
          <div className="flex items-center justify-around py-1">
            <a
              href="https://matthews-thekiso-portfolio.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-all font-mono"
            >
              <Globe className="h-4 w-4 text-indigo-400" />
              Portfolio
            </a>
            <a
              href="https://github.com/HewieT"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-all font-mono"
            >
              <Github className="h-4 w-4 text-indigo-400" />
              GitHub
            </a>
            <a
              href="mailto:sefellethekiso@gmail.com"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-all font-mono"
            >
              <Mail className="h-4 w-4 text-indigo-400" />
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
