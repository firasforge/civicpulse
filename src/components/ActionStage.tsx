"use client";

import React, { useState } from "react";
import {
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  Search,
  ChevronRight,
  Building2,
} from "lucide-react";
import { CivicReport, ReportStatus } from "@/lib/types";

interface ActionStageProps {
  reports: CivicReport[];
  onUpdateReportStatus: (
    id: string,
    status: ReportStatus,
    note: string,
    department?: string,
    crew?: string
  ) => Promise<void>;
  onOpenActionBrief: (report: CivicReport) => void;
  onOpenDuplicateModal: (report: CivicReport) => void;
  onTrackReport?: (id: string) => void;
}

const DEPARTMENTS = [
  "Stormwater & Drainage Division",
  "Department of Transportation (Roads)",
  "Solid Waste Management Bureau",
  "Municipal Electrical & Lighting Dept",
  "City Utilities & Transit Authority",
];

const STATUS_COLUMNS: { status: ReportStatus; label: string; color: string; badgeBg: string }[] = [
  {
    status: "Submitted",
    label: "1. Incoming Triage",
    color: "border-cyan-500/30 text-cyan-400",
    badgeBg: "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20",
  },
  {
    status: "In Review",
    label: "2. Under Assessment",
    color: "border-indigo-500/30 text-indigo-400",
    badgeBg: "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20",
  },
  {
    status: "Dispatched",
    label: "3. Crew Deployed",
    color: "border-amber-500/30 text-amber-400",
    badgeBg: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
  },
  {
    status: "Resolved",
    label: "4. Incident Closed",
    color: "border-emerald-500/30 text-emerald-400",
    badgeBg: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
  },
];

export function ActionStage({
  reports,
  onUpdateReportStatus,
  onOpenActionBrief,
  onOpenDuplicateModal,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTrackReport: _onTrackReport,
}: ActionStageProps) {
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");

  // Status update modal state
  const [activeReportToUpdate, setActiveReportToUpdate] = useState<CivicReport | null>(null);
  const [newStatus, setNewStatus] = useState<ReportStatus>("In Review");
  const [assignedDept, setAssignedDept] = useState("");
  const [assignedCrew, setAssignedCrew] = useState("");
  const [auditNote, setAuditNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter reports
  const filtered = reports.filter((r) => {
    if (selectedCategory !== "All" && r.category !== selectedCategory) return false;
    if (selectedPriority !== "All" && r.priority !== selectedPriority) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.location.street.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenStatusModal = (report: CivicReport) => {
    setActiveReportToUpdate(report);
    setNewStatus(
      report.status === "Submitted"
        ? "In Review"
        : report.status === "In Review"
        ? "Dispatched"
        : report.status === "Dispatched"
        ? "Resolved"
        : "Resolved"
    );
    setAssignedDept(report.assignedDepartment || DEPARTMENTS[0]);
    setAssignedCrew(report.assignedCrew || "");
    setAuditNote(
      report.status === "Submitted"
        ? "Incident verified by operations desk. Department assigned."
        : report.status === "In Review"
        ? "Work order issued and field crew dispatched with equipment."
        : "Work completed and verified on site."
    );
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReportToUpdate) return;

    setIsUpdating(true);
    try {
      await onUpdateReportStatus(
        activeReportToUpdate.id,
        newStatus,
        auditNote,
        assignedDept,
        assignedCrew
      );
      setActiveReportToUpdate(null);
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Banner: Stage 4 Act */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel-subtle border border-cyan-500/20 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-indigo-950/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Stage 4: Act — Municipal Decision-Maker &amp; Dispatch Console
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Decision Workflow
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Departmental routing, status transitions, instant 1-minute AI action briefs, and duplicate management.
            </p>
          </div>
        </div>

        {/* View Switcher & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-white/10 text-xs">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                viewMode === "kanban"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                viewMode === "table"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Data Table
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl glass-panel text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search complaints by title, ID, street, or keyword..."
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter by Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-slate-300 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Waterlogging">Waterlogging</option>
            <option value="Damaged Roads">Damaged Roads</option>
            <option value="Garbage Overflow">Garbage Overflow</option>
            <option value="Broken Streetlights">Broken Streetlights</option>
            <option value="Disrupted Services">Disrupted Services</option>
          </select>

          <select
            aria-label="Filter by Priority"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-slate-300 focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <span className="text-slate-400 font-mono text-[11px] px-2">
            Showing {filtered.length} reports
          </span>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATUS_COLUMNS.map((col) => {
            const colReports = filtered.filter((r) => r.status === col.status);
            return (
              <div
                key={col.status}
                className="rounded-2xl glass-panel p-3.5 flex flex-col space-y-3 min-h-[600px] border border-white/10"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                    {col.label}
                  </h3>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                    {colReports.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {colReports.map((report) => {
                    const isCritical = report.priority === "Critical";
                    const isHigh = report.priority === "High";

                    return (
                      <div
                        key={report.id}
                        className={`p-3.5 rounded-xl border transition-all glass-card-hover space-y-2.5 relative ${
                          isCritical
                            ? "bg-slate-950/80 border-rose-500/40 shadow-lg shadow-rose-950/20"
                            : isHigh
                            ? "bg-slate-900/70 border-amber-500/30"
                            : "bg-slate-900/50 border-white/5"
                        }`}
                      >
                        {/* Card Top: Ticket ID + Priority */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold text-cyan-400">
                            {report.id}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isCritical
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"
                                : isHigh
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            }`}
                          >
                            {report.priority} ({report.priorityScore})
                          </span>
                        </div>

                        {/* Title & Street */}
                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                            {report.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {report.location.street} • {report.category}
                          </p>
                        </div>

                        {/* Explainable Prioritization Factor */}
                        {report.priorityReasons.length > 0 && (
                          <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5 text-[11px] text-slate-300 leading-snug">
                            <span className="text-cyan-400 font-bold block mb-0.5">
                              Explainable AI Factor:
                            </span>
                            {report.priorityReasons[0]}
                          </div>
                        )}

                        {/* Duplicate Alert Pill if applicable */}
                        {report.duplicateLink && (
                          <button
                            type="button"
                            onClick={() => onOpenDuplicateModal(report)}
                            className="w-full text-left p-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-[10px] text-purple-300 flex items-center justify-between hover:bg-purple-900/40 transition-colors"
                          >
                            <span className="flex items-center gap-1 font-semibold truncate">
                              <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                              Duplicate of #{report.duplicateLink.parentReportId}
                            </span>
                            <span className="font-mono font-bold shrink-0">
                              {Math.round(report.duplicateLink.similarityScore * 100)}% Match
                            </span>
                          </button>
                        )}

                        {/* Department & Crew Badges */}
                        {report.assignedDepartment && (
                          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-1">
                            <Building2 className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="truncate">{report.assignedDepartment}</span>
                          </div>
                        )}

                        {/* Decision-Maker Quick Actions */}
                        <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-1.5">
                          {/* 1-Minute AI Action Brief Button */}
                          <button
                            type="button"
                            onClick={() => onOpenActionBrief(report)}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 transition-colors flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            Action Brief
                          </button>

                          {/* Advance Status Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenStatusModal(report)}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center gap-1"
                          >
                            <span>Advance</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {colReports.length === 0 && (
                    <div className="h-32 flex items-center justify-center text-xs text-slate-500 border border-dashed border-white/5 rounded-xl">
                      No reports in this status
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DATA TABLE VIEW */
        <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Title &amp; Street</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Priority Score</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Department</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((report) => (
                  <tr key={report.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-mono font-bold text-cyan-400">
                      {report.id}
                    </td>
                    <td className="p-3 max-w-xs">
                      <div className="font-semibold text-white truncate">{report.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{report.location.street}</div>
                    </td>
                    <td className="p-3 text-slate-300">{report.category}</td>
                    <td className="p-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          report.priority === "Critical"
                            ? "bg-rose-500/20 text-rose-300"
                            : report.priority === "High"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {report.priority} ({report.priorityScore})
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-200">{report.status}</span>
                    </td>
                    <td className="p-3 text-slate-400 truncate max-w-[180px]">
                      {report.assignedDepartment || "Unassigned"}
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenActionBrief(report)}
                        className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-[11px] font-semibold"
                      >
                        Brief
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenStatusModal(report)}
                        className="px-2 py-1 rounded bg-cyan-500 text-slate-950 hover:bg-cyan-400 text-[11px] font-bold"
                      >
                        Dispatch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STATUS TRANSITION & DISPATCH MODAL */}
      {activeReportToUpdate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl glass-panel border border-cyan-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Municipal Action Workflow
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Update Status &amp; Dispatch Crew: {activeReportToUpdate.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveReportToUpdate(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
              <div>
                <label htmlFor="modal-status-select" className="block text-slate-300 font-semibold mb-1">
                  Target Workflow Status:
                </label>
                <select
                  id="modal-status-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                >
                  <option value="Submitted">1. Submitted (Pending Triage)</option>
                  <option value="In Review">2. In Review (Department Assessment)</option>
                  <option value="Dispatched">3. Dispatched (Crew En Route)</option>
                  <option value="Resolved">4. Resolved (Work Verified Closed)</option>
                </select>
              </div>

              <div>
                <label htmlFor="modal-department-select" className="block text-slate-300 font-semibold mb-1">
                  Assign Municipal Department:
                </label>
                <select
                  id="modal-department-select"
                  value={assignedDept}
                  onChange={(e) => setAssignedDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="modal-crew-input" className="block text-slate-300 font-semibold mb-1">
                  Designated Field Crew / Unit:
                </label>
                <input
                  id="modal-crew-input"
                  type="text"
                  value={assignedCrew}
                  onChange={(e) => setAssignedCrew(e.target.value)}
                  placeholder="e.g., Emergency Dewatering Unit 4, Lineman Crew 1"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="modal-audit-note" className="block text-slate-300 font-semibold mb-1">
                  Audit Log &amp; Public Tracking Note:
                </label>
                <textarea
                  id="modal-audit-note"
                  rows={3}
                  required
                  value={auditNote}
                  onChange={(e) => setAuditNote(e.target.value)}
                  placeholder="Explain dispatch orders, field work underway, or resolution details..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveReportToUpdate(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-2"
                >
                  {isUpdating ? (
                    <span>Updating...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Commit Status Change</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
