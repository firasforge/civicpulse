import { NextResponse } from "next/server";
import { reportStore } from "@/lib/store";
import { detectHotspotClusters } from "@/lib/ai/clustering";

export async function GET() {
  try {
    const allReports = reportStore.getAll();
    const clusters = detectHotspotClusters(allReports);

    return NextResponse.json({
      success: true,
      clusterCount: clusters.length,
      clusters,
    });
  } catch (error) {
    console.error("GET /api/clusters error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to detect infrastructure clusters" },
      { status: 500 }
    );
  }
}
