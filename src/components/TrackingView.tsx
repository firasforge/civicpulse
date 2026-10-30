"use client";

import React, { useState } from "react";
import {
  Search,
  Clock,
  Truck,
  Building2,
  ThumbsUp,
  Bell,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { CivicReport, ReportStatus } from "@/lib/types";

interface TrackingViewProps {
  reports: CivicReport[];
  initialSelectedId?: string;
  onUpvote: (reportId: string) => Promise<boolean>;
  onViewOnMap?: (lat: number, lng: number) => void;
}

const LIFECYCLE_STEPS: { status: ReportStatus; label: string; description: string }[] = [
  {
    status: "Submitted",
    label: "Submitted",
    description: "Complaint logged and evaluated by AI risk pipeline.",
  },
  {
    status: "In Review",
    label: "Under Review",
    description: "Assessed by municipal engineer; work order generated.",
  },
  {
    status: "Dispatched",
    label: "Crew Dispatched",
    description: "Tactical repair team mobilized on site with specialized gear.",
  },
  {
    status: "Resolved",
    label: "Resolved",
    description: "Repairs completed, inspected, and verified.",
  },
];

export function TrackingView({
  reports,
  initialSelectedId,
  onUpvote,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onViewOnMap: _onViewOnMap,
}: TrackingViewProps) {
  const [searchId, setSearchId] = useState(initialSelectedId || "CP-2026-1001");
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(
    reports.find((r) => r.id.toLowerCase() === (initialSelectedId || "CP-2026-1001").toLowerCase()) ||
      reports[0] ||
      null
  );
  const [subscribed, setSubscribed] = useState(false);
  const [upvoting, setUpvoting] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = reports.find(
      (r) => r.id.toLowerCase() === searchId.trim().toLowerCase()
    );
    if (found) {
      setSelectedReport(found);
    }
  };

  const handleSelectRecent = (r: CivicReport) => {
    setSelectedReport(r);
    setSearchId(r.id);
  };

  const handleUpvoteClick = async () => {
    if (!selectedReport || upvoting) return;
    setUpvoting(true);
    try {
      const ok = await onUpvote(selectedReport.id);
      if (ok) {
        // optimistically increment
        selectedReport.upvotes += 1;
      }
    } finally {
      setUpvoting(false);
    }
  };

  const getStepIndex = (status: ReportStatus) => {
    switch (status) {
      case "Submitted":
        return 0;
      case "In Review":
        return 1;
      case "Dispatched":
        return 2;
      case "Resolved":
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = selectedReport ? getStepIndex(selectedReport.status) : 0;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Search Header */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              Live Public Transparency Portal
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Citizen Complaint Tracking &amp; Status Monitor
            </h2>
            <p className="text-xs text-slate-400">
              Track real-time progress, assigned crews, dispatch logs, and resolution milestones.
            </p>
          </div>

          {/* Quick Ticket Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">
              Recent Submissions:
            </span>
            {reports.slice(0, 4).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleSelectRecent(r)}
                className={`text-[11px] font-mono font-semibold px-2 py-1 rounded-lg border transition-all ${
                  selectedReport?.id === r.id
                    ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold"
                    : "bg-slate-800 text-slate-300 border-white/10 hover:border-cyan-500/30"
                }`}
              >
                {r.id}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Ticket ID (e.g. CP-2026-1001)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-xs font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <span>Track</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Selected Report Card */}
      {selectedReport ? (
        <div className="space-y-6">
          {/* Main Info Card */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-6">
            {/* Top Row: Ticket ID, Priority, Upvotes */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold font-mono text-cyan-400">
                  #{selectedReport.id}
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    selectedReport.priority === "Critical"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                      : selectedReport.priority === "High"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                  }`}
                >
                  Priority: {selectedReport.priority} ({selectedReport.priorityScore}/100)
                </span>
                <span className="text-xs text-slate-400">
                  Category: <strong className="text-slate-200">{selectedReport.category}</strong>
                </span>
              </div>

              {/* Upvote & Notifications Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUpvoteClick}
                  disabled={upvoting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Upvote ({selectedReport.upvotes})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSubscribed(!subscribed)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                    subscribed
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-slate-800 text-slate-300 border-white/10 hover:text-white"
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{subscribed ? "Subscribed to Alerts" : "Get SMS / Email Updates"}</span>
                </button>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-lg font-bold text-white">
                {selectedReport.title}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {selectedReport.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {selectedReport.location.address}, {selectedReport.location.street}
                </span>
                <span>•</span>
                <span>Submitted: {new Date(selectedReport.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* 4-STAGE LIFECYCLE STEPPER */}
            <div className="py-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Resolution Lifecycle Progress:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                {LIFECYCLE_STEPS.map((step, idx) => {
                  const isCompleted = idx < currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div
                      key={step.status}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCurrent
                          ? "bg-cyan-500/15 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400"
                          : isCompleted
                          ? "bg-emerald-500/10 border-emerald-500/30"
                          : "bg-slate-900/40 border-white/5 opacity-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCompleted
                              ? "bg-emerald-500 text-slate-950"
                              : isCurrent
                              ? "bg-cyan-500 text-slate-950 animate-pulse"
                              : "bg-slate-800 text-slate-500"
                          }`}
                        >
                          {isCompleted ? "✓" : idx + 1}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Stage {idx + 1}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-white">
                        {step.label}
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Department & Crew Dispatch Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-cyan-400" />
                  Assigned Department
                </span>
                <span className="font-bold text-white text-xs mt-0.5 block truncate">
                  {selectedReport.assignedDepartment || "Departmental Routing in Progress"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-indigo-400" />
                  Designated Tactical Crew
                </span>
                <span className="font-bold text-indigo-300 text-xs mt-0.5 block truncate">
                  {selectedReport.assignedCrew || "Crew Scheduled"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  Estimated Resolution Time
                </span>
                <span className="font-bold text-emerald-300 text-xs mt-0.5 block">
                  {selectedReport.estimatedResolutionTime || "24 - 48 Hours"}
                </span>
              </div>
            </div>

            {/* Explainable Prioritization Logic */}
            {selectedReport.priorityReasons.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 space-y-2">
                <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Explainable Prioritization Rationale:
                </h4>
                <ul className="space-y-1">
                  {selectedReport.priorityReasons.map((reason, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Live Audit Log / Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Incident Timeline &amp; Field Dispatch Notes:
              </h4>
              <div className="space-y-2.5">
                {selectedReport.timeline.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-xl bg-slate-900/50 border border-white/5 flex items-start gap-3 text-xs"
                  >
                    <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-semibold text-white">
                          {event.status} — {event.actor} ({event.role})
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(event.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] mt-0.5">
                        {event.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl glass-panel text-slate-400">
          <p>No complaint found with ticket ID &ldquo;{searchId}&rdquo;.</p>
        </div>
      )}
    </div>
  );
}
