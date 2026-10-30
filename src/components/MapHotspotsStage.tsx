"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Flame,
  Layers,
  ShieldAlert,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { CivicReport, HotspotCluster } from "@/lib/types";

// Dynamic import for Leaflet to prevent Next.js SSR window is not defined error
const DynamicLeafletMap = dynamic(
  () => import("./LeafletMapWrapper").then((mod) => mod.LeafletMapWrapper),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] rounded-2xl glass-panel flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-slate-400">Loading Geospatial Infrastructure Grid...</span>
      </div>
    ),
  }
);

interface MapHotspotsStageProps {
  reports: CivicReport[];
  clusters: HotspotCluster[];
  onSelectReport: (reportId: string) => void;
  selectedCoordinate?: { lat: number; lng: number } | null;
}

export function MapHotspotsStage({
  reports,
  clusters,
  onSelectReport,
  selectedCoordinate,
}: MapHotspotsStageProps) {
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const selectedCluster = clusters.find((c) => c.id === selectedClusterId) || clusters[0] || null;
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterPriority, setFilterPriority] = useState<string>("All");

  const filteredReports = reports.filter((r) => {
    if (filterCategory !== "All" && r.category !== filterCategory) return false;
    if (filterPriority !== "All" && r.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Banner: Stage 3 Reveal */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel-subtle border border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 via-slate-900/60 to-indigo-950/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
            <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Stage 3: Reveal — Real-Time Map &amp; Hotspot Detection
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                {clusters.length} Active Systemic Hotspots
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Correlating multi-category infrastructure failures along the same street corridors.
            </p>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <select
              aria-label="Filter Category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent text-white focus:outline-none text-xs cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Categories</option>
              <option value="Waterlogging" className="bg-slate-900">Waterlogging</option>
              <option value="Damaged Roads" className="bg-slate-900">Damaged Roads</option>
              <option value="Garbage Overflow" className="bg-slate-900">Garbage Overflow</option>
              <option value="Broken Streetlights" className="bg-slate-900">Broken Streetlights</option>
              <option value="Disrupted Services" className="bg-slate-900">Disrupted Services</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-300">
            <select
              aria-label="Filter Priority"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-transparent text-white focus:outline-none text-xs cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Priorities</option>
              <option value="Critical" className="bg-slate-900">Critical Only</option>
              <option value="High" className="bg-slate-900">High &amp; Critical</option>
              <option value="Medium" className="bg-slate-900">Medium</option>
              <option value="Low" className="bg-slate-900">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Hotspot Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Leaflet Map */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[620px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
            <DynamicLeafletMap
              reports={filteredReports}
              clusters={clusters}
              selectedCluster={selectedCluster}
              onSelectReport={onSelectReport}
              onSelectCluster={(c) => setSelectedClusterId(c.id)}
              centerCoord={selectedCoordinate}
            />

            {/* Map Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-[1000] p-3 rounded-xl glass-panel text-xs text-slate-300 space-y-1.5 border border-white/10 pointer-events-auto">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Geospatial Risk Layer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping inline-block" />
                <span>Critical Life Safety Hazard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span>High Severity Maintenance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded border border-cyan-400 bg-cyan-500/30 inline-block" />
                <span>Automated Correlated Cluster Zone</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Hotspot Intelligence Feed */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl glass-panel border border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                Identified Correlated Hotspots
              </span>
              <span className="text-xs text-slate-400">
                {clusters.length} Clusters
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Groups multiple failure vectors (drain clog + waterlogging + road damage) to uncover systemic root causes.
            </p>

            {/* Cluster Selector Tabs */}
            <div className="mt-3 space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {clusters.map((c) => {
                const isSelected = selectedCluster?.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedClusterId(c.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-cyan-500/15 border-cyan-400 shadow-md ring-1 ring-cyan-400/40"
                        : "bg-slate-900/50 border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">
                        {c.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.severityScore >= 80
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        }`}
                      >
                        Severity {c.severityScore}/100
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{c.reportCount} Correlated Reports</span>
                      <span>•</span>
                      <span>{c.criticalCount} Critical</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deep Cluster Diagnostic Panel */}
          {selectedCluster && (
            <div className="p-5 rounded-2xl glass-panel border-2 border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-slate-900/80 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-cyan-400">
                    AI Cluster Root-Cause Diagnosis
                  </span>
                  <h4 className="text-base font-bold text-white mt-0.5">
                    {selectedCluster.name}
                  </h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    Corridor: {selectedCluster.street} ({selectedCluster.radiusMeters}m Zone)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-cyan-300 block">
                    {selectedCluster.reportCount} Reports
                  </span>
                </div>
              </div>

              {/* AI Diagnosis Text */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-xs text-slate-200 leading-relaxed">
                <p className="font-medium text-cyan-300 mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                  Cascading Failure Analysis:
                </p>
                {selectedCluster.aiClusterDiagnosis}
              </div>

              {/* Recommended Systemic Action */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/20 text-xs text-slate-200 leading-relaxed">
                <p className="font-medium text-emerald-400 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Recommended Inter-Departmental Action:
                </p>
                {selectedCluster.recommendedSystemicAction}
              </div>

              {/* Cluster Reports List */}
              <div>
                <h5 className="text-xs font-semibold text-slate-300 mb-2">
                  Incidents in this Cluster ({selectedCluster.reports.length}):
                </h5>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {selectedCluster.reports.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => onSelectReport(r.id)}
                      className="w-full text-left p-2 rounded-lg bg-slate-950/60 hover:bg-cyan-950/40 border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between text-xs"
                    >
                      <div className="truncate mr-2">
                        <span className="font-mono text-cyan-400 font-bold mr-1.5">
                          {r.id}:
                        </span>
                        <span className="text-slate-200">{r.title}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          r.priority === "Critical"
                            ? "bg-rose-500/20 text-rose-300"
                            : r.priority === "High"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {r.priority}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
