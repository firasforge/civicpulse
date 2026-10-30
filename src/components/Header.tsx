"use client";

import React from "react";
import {
  Activity,
  MapPin,
  FileText,
  SlidersHorizontal,
  Search,
  ShieldCheck,
  RotateCcw,
  User,
  Building2,
  LogIn,
  LogOut,
} from "lucide-react";
import { PortalRole, AuthUser } from "@/lib/types";

interface HeaderProps {
  activeTab: "overview" | "submit" | "map" | "admin" | "track";
  setActiveTab: (tab: "overview" | "submit" | "map" | "admin" | "track") => void;
  portalRole: PortalRole;
  setPortalRole: (role: PortalRole) => void;
  onResetData: () => void;
  resetting: boolean;
  totalCount: number;
  criticalCount: number;
  user?: AuthUser | null;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  portalRole,
  setPortalRole,
  onResetData,
  resetting,
  totalCount,
  criticalCount,
  user,
  onOpenAuth,
  onSignOut,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-400/30">
              <Activity className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  CivicPulse
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  AI v3.8 Flash
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PromptWars × ASTRA
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Autonomous Civic Complaint &amp; Action Platform
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav
            aria-label="Main Navigation"
            className="flex items-center gap-1 sm:gap-2 p-1 bg-slate-900/80 rounded-xl border border-white/5"
          >
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "overview"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span className="hidden md:inline">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("submit")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "submit"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Report</span>
            </button>

            <button
              onClick={() => setActiveTab("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all relative ${
                activeTab === "map"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Map &amp; Hotspots</span>
              {criticalCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-1 right-1" />
              )}
            </button>

            <button
              onClick={() => {
                setPortalRole("admin");
                setActiveTab("admin");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "admin"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden md:inline">Dispatch Workflow</span>
              <span className="md:hidden">Admin</span>
            </button>

            <button
              onClick={() => setActiveTab("track")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "track"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">Citizen Tracking</span>
              <span className="md:hidden">Track</span>
            </button>
          </nav>

          {/* Right Tools: Auth + Portal Role Toggle + Reset Data */}
          <div className="flex items-center gap-2">
            {/* Supabase Authentication Button or User Status */}
            {user ? (
              <div className="flex items-center gap-1.5 p-1 px-2.5 rounded-xl bg-slate-900 border border-cyan-500/30">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold">
                  {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
                <span
                  className="font-mono text-xs text-slate-200 max-w-[110px] md:max-w-[160px] truncate"
                  title={user.email}
                >
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={onSignOut}
                  title="Sign out of your account"
                  className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                title="Sign in or create a citizen account"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 hover:border-cyan-400 shadow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In / Register</span>
                <span className="sm:hidden">Sign In</span>
              </button>
            )}

            {/* Lightweight Role / Portal Switcher */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setPortalRole("citizen");
                  if (activeTab === "admin") setActiveTab("submit");
                }}
                title="Switch to Citizen View (Public Submission &amp; Live Tracking)"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  portalRole === "citizen"
                    ? "bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-sm font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Citizen Portal</span>
                <span className="xl:hidden">Citizen</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPortalRole("admin");
                  if (activeTab === "submit" || activeTab === "track") setActiveTab("admin");
                }}
                title="Switch to Municipal Admin View (Decision-Maker Console &amp; AI Action Briefs)"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  portalRole === "admin"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Municipal Admin</span>
                <span className="xl:hidden">Admin</span>
              </button>
            </div>

            {/* Action Button: Reset Benchmark Data */}
            <button
              onClick={onResetData}
              disabled={resetting}
              title="Reset localStorage &amp; database to the benchmark reports"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 transition-colors disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
              <span className="hidden lg:inline">Reset Mock Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role Context Notification Bar */}
      <div className={`px-4 py-1 text-center text-[11px] font-medium border-t border-white/5 transition-colors ${
        portalRole === "admin"
          ? "bg-indigo-950/40 text-indigo-300 border-indigo-500/20"
          : "bg-cyan-950/30 text-cyan-300 border-cyan-500/20"
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {portalRole === "admin" ? (
              <>
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span><strong>Municipal Command View Active:</strong> Dispatch board, 1-minute executive briefs, and cluster management enabled.</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span><strong>Public Citizen View Active:</strong> Fast &lt; 1-minute incident capture, GPS locator, and transparent status tracking.</span>
              </>
            )}
          </div>
          <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">
            Synced: {totalCount} reports in database &amp; localStorage
          </span>
        </div>
      </div>
    </header>
  );
}
