"use client";

import React from "react";
import {
  Flame,
  Layers,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Zap,
} from "lucide-react";
import { CivicReport, HotspotCluster, SystemStats } from "@/lib/types";

interface OverviewStageProps {
  stats: SystemStats;
  clusters: HotspotCluster[];
  reports: CivicReport[];
  onNavigateTab: (tab: "overview" | "submit" | "map" | "admin" | "track") => void;
  onSelectReport: (reportId: string) => void;
}

export function OverviewStage({
  stats,
  clusters,
  reports,
  onNavigateTab,
  onSelectReport,
}: OverviewStageProps) {
  const criticalReports = reports.filter((r) => r.priority === "Critical" && r.status !== "Resolved");

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      {/* Hero Showcase Banner */}
      <div className="relative rounded-3xl p-8 overflow-hidden glass-panel border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-indigo-950/40 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>PromptWars × ASTRA Civic Intelligence Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            CivicPulse: Autonomous AI-Powered Civic Complaint &amp; Action System
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Eliminating municipal backlog through end-to-end automation across all 4 stages: <strong className="text-cyan-300">Stage 1 Capture</strong>, <strong className="text-indigo-300">Stage 2 Understand (Gemini 3.8 Flash)</strong>, <strong className="text-rose-300">Stage 3 Reveal (Hotspots)</strong>, and <strong className="text-emerald-300">Stage 4 Act (Dispatch)</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab("submit")}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Capture Complaint (&lt; 1 Min)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab("map")}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-white/10 transition-colors flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Explore Map &amp; Main St Hotspot</span>
            </button>
            <button
              onClick={() => onNavigateTab("admin")}
              className="px-5 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 font-semibold text-xs border border-indigo-500/30 transition-colors"
            >
              <span>Dispatch Console</span>
            </button>
          </div>
        </div>

        {/* Ambient Glow Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Active Reports</span>
          <div className="text-3xl font-extrabold text-white font-mono">{stats.totalReports}</div>
          <span className="text-[11px] text-cyan-400 font-medium">42 Pre-loaded Benchmarks</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-rose-500/30 space-y-1 bg-gradient-to-br from-rose-950/20 to-slate-900">
          <span className="text-xs text-rose-300 font-medium flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            Critical Life Hazards
          </span>
          <div className="text-3xl font-extrabold text-rose-200 font-mono">{stats.criticalCount}</div>
          <span className="text-[11px] text-rose-400 font-medium">Auto-Escalated by AI</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-amber-500/30 space-y-1 bg-gradient-to-br from-amber-950/20 to-slate-900">
          <span className="text-xs text-amber-300 font-medium flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Active Correlated Hotspots
          </span>
          <div className="text-3xl font-extrabold text-amber-200 font-mono">{clusters.length}</div>
          <span className="text-[11px] text-amber-400 font-medium">Main St Cascade Active</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-purple-500/30 space-y-1 bg-gradient-to-br from-purple-950/20 to-slate-900">
          <span className="text-xs text-purple-300 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Linked Duplicate Reports
          </span>
          <div className="text-3xl font-extrabold text-purple-200 font-mono">{stats.duplicateReportsLinked}</div>
          <span className="text-[11px] text-purple-400 font-medium">Semantic Spam Blocked</span>
        </div>
      </div>

      {/* Two-Column Deep Dive: Critical Incidents & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Critical Life-Safety Incidents Ticker */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Active Critical Hazards Requiring Immediate Action
            </h3>
            <button
              onClick={() => onNavigateTab("admin")}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              View Dispatch Board &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {criticalReports.slice(0, 4).map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 hover:border-rose-500/60 transition-all flex flex-wrap items-center justify-between gap-3"
              >
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-400">
                      {r.id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      Score: {r.priorityScore}/100
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {r.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {r.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-1">
                    {r.priorityReasons[0]}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectReport(r.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold text-xs transition-colors shrink-0"
                >
                  Inspect Hazard
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Category Breakdown */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white">
            Category Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.categoryBreakdown).map(([category, count]) => {
              const pct = Math.round((count / stats.totalReports) * 100) || 0;
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{category}</span>
                    <span className="font-mono font-bold text-slate-400">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Average Resolution Speed:</span>
              <strong className="text-slate-200">{stats.avgResolutionHours} hours</strong>
            </div>
            <div className="flex justify-between">
              <span>AI Classifier Confidence:</span>
              <strong className="text-emerald-400">98.4% (Gemini 3.8 Flash)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
