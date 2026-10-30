"use client";

import React, { useState } from "react";
import {
  Sparkles,
  X,
  Wrench,
  ShieldCheck,
  Clock,
  DollarSign,
  Truck,
  Copy,
  Check,
  RefreshCw,
  FileText,
} from "lucide-react";
import { CivicReport, ActionBrief } from "@/lib/types";

interface ActionBriefModalProps {
  report: CivicReport | null;
  onClose: () => void;
  onRefreshBrief?: (reportId: string) => Promise<ActionBrief | null>;
}

export function ActionBriefModal({
  report,
  onClose,
  onRefreshBrief,
}: ActionBriefModalProps) {
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!report) return null;

  const brief = report.actionBrief;

  const handleCopy = () => {
    if (!brief) return;
    const text = `CIVICPULSE 1-MINUTE EXECUTIVE ACTION BRIEF
Ticket: ${report.id} - ${report.title}
Location: ${report.location.address}, ${report.location.street}
Priority: ${report.priority} (Score: ${report.priorityScore}/100)

ROOT CAUSE:
${brief.rootCause}

RECOMMENDED CREW:
${brief.recommendedCrew}

REQUIRED EQUIPMENT:
${brief.requiredEquipment.map((e) => `- ${e}`).join("\n")}

SAFETY PRECAUTIONS:
${brief.safetyPrecautions.map((s) => `- ${s}`).join("\n")}

ESTIMATED TIME TO RESOLVE: ${brief.estimatedResolutionTime}
BUDGET BALLPARK: ${brief.budgetEstimate || "N/A"}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = async () => {
    if (!onRefreshBrief) return;
    setIsRefreshing(true);
    try {
      await onRefreshBrief(report.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl glass-panel border-2 border-indigo-500/40 p-6 space-y-5 shadow-2xl relative bg-gradient-to-br from-slate-900/90 via-slate-900 to-indigo-950/40">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Gemini AI Synthesizer
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                  1-Minute Executive Action Brief
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {report.id}: {report.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {brief ? (
          <div className="space-y-4 text-xs">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  Target ETA
                </span>
                <span className="font-bold text-white mt-0.5 block">
                  {brief.estimatedResolutionTime}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-emerald-400" />
                  Budget Estimate
                </span>
                <span className="font-bold text-white mt-0.5 block">
                  {brief.budgetEstimate || "$400 - $800"}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 col-span-2">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-indigo-400" />
                  Designated Tactical Crew
                </span>
                <span className="font-bold text-indigo-300 mt-0.5 block truncate">
                  {brief.recommendedCrew}
                </span>
              </div>
            </div>

            {/* Root Cause Analysis */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-indigo-500/20">
              <h4 className="font-bold text-indigo-300 flex items-center gap-1.5 mb-1 text-xs">
                <FileText className="w-3.5 h-3.5" />
                Root Cause &amp; Engineering Assessment:
              </h4>
              <p className="text-slate-200 leading-relaxed">
                {brief.rootCause}
              </p>
            </div>

            {/* Two-Column: Equipment & Safety Directives */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Required Equipment */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
                <h4 className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                  <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                  Required Equipment Checklist:
                </h4>
                <ul className="space-y-1">
                  {brief.requiredEquipment.map((eq, i) => (
                    <li key={i} className="text-slate-300 flex items-start gap-1.5 text-[11px]">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{eq}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Safety Precautions */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
                <h4 className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Mandatory Safety Directives:
                </h4>
                <ul className="space-y-1">
                  {brief.safetyPrecautions.map((safe, i) => (
                    <li key={i} className="text-slate-300 flex items-start gap-1.5 text-[11px]">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{safe}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 space-y-2">
            <p>Action brief not yet generated for this report.</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Regenerate Brief</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Brief"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
