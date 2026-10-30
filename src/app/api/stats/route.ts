import { NextResponse } from "next/server";
import { reportStore } from "@/lib/store";
import { detectHotspotClusters } from "@/lib/ai/clustering";

export async function GET() {
  try {
    const stats = reportStore.getStats();
    const reports = reportStore.getAll();
    const clusters = detectHotspotClusters(reports);
    stats.activeHotspots = clusters.length;

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve system statistics" },
      { status: 500 }
    );
  }
}
