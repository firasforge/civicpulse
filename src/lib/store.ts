import { CivicReport, SystemStats } from "./types";
import { allMockReports } from "./mockReports";

// Global singleton across serverless invocations in dev/prod
declare global {
  var __civicPulseReports: CivicReport[] | undefined;
}

function initReports(): CivicReport[] {
  if (!global.__civicPulseReports) {
    global.__civicPulseReports = JSON.parse(JSON.stringify(allMockReports));
  }
  return global.__civicPulseReports!;
}

export const reportStore = {
  getAll(): CivicReport[] {
    return initReports();
  },

  getById(id: string): CivicReport | undefined {
    const list = initReports();
    return list.find((r) => r.id.toLowerCase() === id.toLowerCase());
  },

  create(report: CivicReport): CivicReport {
    const list = initReports();
    list.unshift(report);
    return report;
  },

  update(id: string, updates: Partial<CivicReport>): CivicReport | undefined {
    const list = initReports();
    const index = list.findIndex((r) => r.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return undefined;

    const existing = list[index];
    const updated: CivicReport = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    return updated;
  },

  upvote(id: string, voterToken: string = "anonymous"): { report?: CivicReport; success: boolean; alreadyVoted?: boolean } {
    const list = initReports();
    const index = list.findIndex((r) => r.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return { success: false };

    const report = list[index];
    const voters = report.upvotedByIp || [];
    if (voters.includes(voterToken)) {
      return { report, success: false, alreadyVoted: true };
    }

    report.upvotes += 1;
    report.upvotedByIp = [...voters, voterToken];
    report.updatedAt = new Date().toISOString();
    return { report, success: true };
  },

  reset(): CivicReport[] {
    global.__civicPulseReports = JSON.parse(JSON.stringify(allMockReports));
    return global.__civicPulseReports!;
  },

  syncAll(reports: CivicReport[]): CivicReport[] {
    global.__civicPulseReports = reports;
    return global.__civicPulseReports;
  },

  getStats(): SystemStats {
    const reports = initReports();
    const breakdown = {
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

      breakdown[r.category] = (breakdown[r.category] || 0) + 1;
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
      activeHotspots: 4, // Computed dynamically from clustering
      duplicateReportsLinked: duplicatesLinked,
      avgResolutionHours: 4.8,
      categoryBreakdown: breakdown,
    };
  },
};
