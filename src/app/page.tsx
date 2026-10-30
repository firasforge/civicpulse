"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { OverviewStage } from "@/components/OverviewStage";
import { CaptureStage } from "@/components/CaptureStage";
import { MapHotspotsStage } from "@/components/MapHotspotsStage";
import { ActionStage } from "@/components/ActionStage";
import { TrackingView } from "@/components/TrackingView";
import { ActionBriefModal } from "@/components/ActionBriefModal";
import { DuplicateModal } from "@/components/DuplicateModal";
import { AuthModal } from "@/components/AuthModal";
import {
  CivicReport,
  HotspotCluster,
  SystemStats,
  ReportStatus,
  ActionBrief,
  PortalRole,
  ReportCategory,
  AuthUser,
} from "@/lib/types";
import { detectHotspotClusters } from "@/lib/ai/clustering";
import {
  fetchReportsFromSupabase,
  LOCAL_STORAGE_KEY,
  isSupabaseConfigured,
  getCurrentUser,
  signOutUser,
  onAuthStateChange,
} from "@/lib/supabase";

const STORAGE_KEY = LOCAL_STORAGE_KEY;

function computeStatsFromReports(reports: CivicReport[], activeHotspots: number): SystemStats {
  const breakdown: Record<ReportCategory, number> = {
    Waterlogging: 0,
    "Damaged Roads": 0,
    "Garbage Overflow": 0,
    "Broken Streetlights": 0,
    "Disrupted Services": 0,
  };

  let submitted = 0;
  let inReview = 0;
  let dispatched = 0;
  let resolved = 0;
  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;
  let duplicatesLinked = 0;

  for (const r of reports) {
    if (r.status === "Submitted") submitted++;
    else if (r.status === "In Review") inReview++;
    else if (r.status === "Dispatched") dispatched++;
    else if (r.status === "Resolved") resolved++;

    if (r.priority === "Critical") criticalCount++;
    else if (r.priority === "High") highCount++;
    else if (r.priority === "Medium") mediumCount++;
    else if (r.priority === "Low") lowCount++;

    if (r.duplicateLink) duplicatesLinked++;

    if (r.category in breakdown) {
      breakdown[r.category] = (breakdown[r.category] || 0) + 1;
    }
  }

  return {
    totalReports: reports.length,
    submitted,
    inReview,
    dispatched,
    resolved,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    activeHotspots,
    duplicateReportsLinked: duplicatesLinked,
    avgResolutionHours: 4.8,
    categoryBreakdown: breakdown,
  };
}

export default function CivicPulseApp() {
  const [activeTab, setActiveTab] = useState<"overview" | "submit" | "map" | "admin" | "track">("overview");
  const [portalRole, setPortalRole] = useState<PortalRole>("citizen");
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [clusters, setClusters] = useState<HotspotCluster[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    totalReports: 0,
    submitted: 0,
    inReview: 0,
    dispatched: 0,
    resolved: 0,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
    activeHotspots: 0,
    duplicateReportsLinked: 0,
    avgResolutionHours: 4.8,
    categoryBreakdown: {
      Waterlogging: 0,
      "Damaged Roads": 0,
      "Garbage Overflow": 0,
      "Broken Streetlights": 0,
      "Disrupted Services": 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Selected item modal states
  const [selectedReportForBrief, setSelectedReportForBrief] = useState<CivicReport | null>(null);
  const [selectedReportForDuplicate, setSelectedReportForDuplicate] = useState<CivicReport | null>(null);
  const [targetTrackingId, setTargetTrackingId] = useState<string>("CP-2026-1001");
  const [mapCenterCoord, setMapCenterCoord] = useState<{ lat: number; lng: number } | null>(null);

  // Data Fetching & LocalStorage Sync
  const fetchAllData = async (forceServerReset = false) => {
    try {
      // Asynchronous tick to avoid synchronous setState inside mount effect
      await Promise.resolve();

      // 1. If Supabase is configured, fetch live PostgreSQL data first
      if (!forceServerReset && isSupabaseConfigured) {
        try {
          const supabaseReports = await fetchReportsFromSupabase();
          if (supabaseReports && supabaseReports.length > 0) {
            setReports(supabaseReports);
            if (typeof window !== "undefined") {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(supabaseReports));
            }
            const computedClusters = detectHotspotClusters(supabaseReports);
            setClusters(computedClusters);
            setStats(computeStatsFromReports(supabaseReports, computedClusters.length));
            setLoading(false);

            fetch("/api/reports", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reports: supabaseReports }),
            }).catch(() => {});
            return;
          }
        } catch (err) {
          console.warn("[CivicPulse] Supabase fetch error, falling back to localStorage:", err);
        }
      }

      // 2. Fallback gracefully to LocalStorage if Supabase not configured or offline
      if (!forceServerReset && typeof window !== "undefined") {
        const cachedRaw = localStorage.getItem(STORAGE_KEY);
        if (cachedRaw) {
          try {
            const cachedReports: CivicReport[] = JSON.parse(cachedRaw);
            if (Array.isArray(cachedReports) && cachedReports.length > 0) {
              setReports(cachedReports);
              const computedClusters = detectHotspotClusters(cachedReports);
              setClusters(computedClusters);
              setStats(computeStatsFromReports(cachedReports, computedClusters.length));
              setLoading(false);

              // Background hydrate to server store
              fetch("/api/reports", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reports: cachedReports }),
              }).catch(() => {});
              return;
            }
          } catch (e) {
            console.warn("Failed to parse cached localStorage reports:", e);
          }
        }
      }

      // 2. Fetch from server if not cached
      const [reportsRes, clustersRes, statsRes] = await Promise.all([
        fetch("/api/reports"),
        fetch("/api/clusters"),
        fetch("/api/stats"),
      ]);

      const [reportsData, clustersData, statsData] = await Promise.all([
        reportsRes.json(),
        clustersRes.json(),
        statsRes.json(),
      ]);

      if (reportsData.success && Array.isArray(reportsData.reports)) {
        setReports(reportsData.reports);
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(reportsData.reports));
        }
      }
      if (clustersData.success) setClusters(clustersData.clusters);
      if (statsData.success) setStats(statsData.stats);
    } catch (err) {
      console.error("Failed to load CivicPulse data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchAllData();
    }, 0);

    // Check initial user authentication
    void getCurrentUser().then((user) => {
      if (user) setCurrentUser(user);
    });

    // Subscribe to live auth state changes
    const { unsubscribe } = onAuthStateChange((user) => {
      setCurrentUser(user);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
  };

  // Reset Mock Data to clean benchmark state (clears localStorage & server memory)
  const handleResetData = async () => {
    setResetting(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
      const res = await fetch("/api/reports", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await fetchAllData(true);
      }
    } catch (err) {
      console.error("Failed to reset:", err);
    } finally {
      setResetting(false);
    }
  };

  // Called when citizen submits a new report
  const handleReportCreated = (newReportId: string) => {
    setTargetTrackingId(newReportId);
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.reports)) {
          setReports(data.reports);
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.reports));
          }
          const computedClusters = detectHotspotClusters(data.reports);
          setClusters(computedClusters);
          setStats(computeStatsFromReports(data.reports, computedClusters.length));
        }
      })
      .catch((err) => console.error("Sync error after report creation:", err));
  };

  // Status transition handler with LocalStorage sync
  const handleUpdateReportStatus = async (
    id: string,
    status: ReportStatus,
    note: string,
    department?: string,
    crew?: string
  ) => {
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          note,
          assignedDepartment: department,
          assignedCrew: crew,
        }),
      });
      const data = await res.json();
      if (data.success && data.report) {
        setReports((prev) => {
          const updated = prev.map((r) => (r.id === id ? data.report : r));
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          }
          const computedClusters = detectHotspotClusters(updated);
          setClusters(computedClusters);
          setStats(computeStatsFromReports(updated, computedClusters.length));
          return updated;
        });
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Upvote report handler with LocalStorage sync
  const handleUpvote = async (reportId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/reports/${reportId}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterToken: "citizen-token-" + Date.now() }),
      });
      const data = await res.json();
      if (data.success) {
        setReports((prev) => {
          const updated = prev.map((r) =>
            r.id === reportId ? { ...r, upvotes: data.upvotes } : r
          );
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          }
          return updated;
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to upvote:", err);
      return false;
    }
  };

  // AI Action Brief Refresh
  const handleRefreshBrief = async (reportId: string): Promise<ActionBrief | null> => {
    try {
      const res = await fetch(`/api/reports/${reportId}/action-brief`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forceRefresh: true }),
      });
      const data = await res.json();
      if (data.success) {
        setReports((prev) => {
          const updated = prev.map((r) => (r.id === reportId ? data.report : r));
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          }
          return updated;
        });
        if (selectedReportForBrief?.id === reportId) {
          setSelectedReportForBrief(data.report);
        }
        return data.actionBrief;
      }
      return null;
    } catch (err) {
      console.error("Failed to regenerate action brief:", err);
      return null;
    }
  };

  // Navigation callbacks
  const handleSelectReport = (reportId: string) => {
    setTargetTrackingId(reportId);
    setActiveTab("track");
  };

  const handleViewOnMap = (lat: number, lng: number) => {
    setMapCenterCoord({ lat, lng });
    setActiveTab("map");
  };

  const parentReportOfSelectedDuplicate = selectedReportForDuplicate?.duplicateLink
    ? reports.find(
        (r) =>
          r.id.toLowerCase() ===
          selectedReportForDuplicate.duplicateLink?.parentReportId.toLowerCase()
      ) || null
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100">
      {/* Universal Header with Auth, Role Switcher & Reset */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        portalRole={portalRole}
        setPortalRole={setPortalRole}
        onResetData={handleResetData}
        resetting={resetting}
        totalCount={reports.length}
        criticalCount={stats.criticalCount}
        user={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Pages */}
      <main className="flex-1 pb-16">
        {loading ? (
          <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-cyan-300">
              Initializing CivicPulse AI Grid &amp; Synchronizing State...
            </p>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <OverviewStage
                stats={stats}
                clusters={clusters}
                reports={reports}
                onNavigateTab={setActiveTab}
                onSelectReport={handleSelectReport}
              />
            )}

            {activeTab === "submit" && (
              <CaptureStage
                onSuccess={handleReportCreated}
                onViewOnMap={handleViewOnMap}
                user={currentUser}
              />
            )}

            {activeTab === "map" && (
              <MapHotspotsStage
                reports={reports}
                clusters={clusters}
                onSelectReport={handleSelectReport}
                selectedCoordinate={mapCenterCoord}
              />
            )}

            {activeTab === "admin" && (
              <ActionStage
                reports={reports}
                onUpdateReportStatus={handleUpdateReportStatus}
                onOpenActionBrief={(r) => setSelectedReportForBrief(r)}
                onOpenDuplicateModal={(r) => setSelectedReportForDuplicate(r)}
                onTrackReport={handleSelectReport}
              />
            )}

            {activeTab === "track" && (
              <TrackingView
                reports={reports}
                initialSelectedId={targetTrackingId}
                onUpvote={handleUpvote}
                onViewOnMap={handleViewOnMap}
              />
            )}
          </>
        )}
      </main>

      {/* Modal: 1-Minute Executive Action Brief */}
      <ActionBriefModal
        report={selectedReportForBrief}
        onClose={() => setSelectedReportForBrief(null)}
        onRefreshBrief={handleRefreshBrief}
      />

      {/* Modal: Duplicate Linker Comparison */}
      <DuplicateModal
        report={selectedReportForDuplicate}
        parentReport={parentReportOfSelectedDuplicate}
        onClose={() => setSelectedReportForDuplicate(null)}
        onViewParent={(parentId) => {
          setSelectedReportForDuplicate(null);
          handleSelectReport(parentId);
        }}
      />

      {/* Modal: Accessible Supabase Authentication */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 glass-panel py-6 text-center text-xs text-slate-400 space-y-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">CivicPulse</span>
            <span>•</span>
            <span>Built for PromptWars × ASTRA Hackathon</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Next.js 15 App Router</span>
            <span>•</span>
            <span>React 19</span>
            <span>•</span>
            <span>LocalStorage Synced (civicpulse_reports_v1)</span>
            <span>•</span>
            <span>@google/genai (Gemini 3.8 Flash)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
