"use client";

import React from "react";
import { Sparkles, X, CheckCircle2, ArrowRight } from "lucide-react";
import { CivicReport } from "@/lib/types";

interface DuplicateModalProps {
  report: CivicReport | null;
  parentReport: CivicReport | null;
  onClose: () => void;
  onViewParent: (parentId: string) => void;
}

export function DuplicateModal({
  report,
  parentReport,
  onClose,
  onViewParent,
}: DuplicateModalProps) {
  if (!report || !report.duplicateLink) return null;

  const { duplicateLink } = report;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl glass-panel border-2 border-purple-500/40 p-6 space-y-5 shadow-2xl relative bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                CivicPulse Semantic Duplicate Linker
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Automated Duplicate Correlation
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-purple-300 font-semibold block">
                Composite Similarity Score
              </span>
              <span className="text-xl font-bold font-mono text-purple-200">
                {Math.round(duplicateLink.similarityScore * 100)}% Match
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-purple-300 font-semibold block">
                Status
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Linked to Primary Incident
              </span>
            </div>
          </div>

          {/* Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Incoming Duplicate */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-purple-400">
                This Report: #{report.id}
              </span>
              <h4 className="font-semibold text-white leading-snug">
                {report.title}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {report.description}
              </p>
              <div className="text-[10px] text-slate-400 pt-1">
                {report.location.street} • Priority: {report.priority}
              </div>
            </div>

            {/* Parent Primary Report */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-cyan-400">
                Primary Master Ticket: #{duplicateLink.parentReportId}
              </span>
              <h4 className="font-semibold text-white leading-snug">
                {parentReport ? parentReport.title : "Primary Incident"}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {parentReport ? parentReport.description : "Primary complaint details."}
              </p>
              <div className="text-[10px] text-slate-400 pt-1">
                {parentReport ? `${parentReport.location.street} • Status: ${parentReport.status}` : ""}
              </div>
            </div>
          </div>

          {/* Shared Correlation Factors */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
            <h4 className="font-bold text-slate-200 text-xs">
              Algorithmic Shared Factors Detected:
            </h4>
            <ul className="space-y-1">
              {duplicateLink.sharedFactors.map((factor, idx) => (
                <li key={idx} className="text-slate-300 text-[11px] flex items-center gap-1.5">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onViewParent(duplicateLink.parentReportId);
            }}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
          >
            <span>Inspect Primary Ticket</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
