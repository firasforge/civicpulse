import { NextRequest, NextResponse } from "next/server";
import { reportStore } from "@/lib/store";
import { generateActionBriefWithGemini } from "@/lib/ai/actionBrief";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const report = reportStore.getById(id);

    if (!report) {
      return NextResponse.json(
        { success: false, error: `Report with ID "${id}" was not found.` },
        { status: 404 }
      );
    }

    // If already generated, return cached unless forceRefresh is true
    const body = await request.json().catch(() => ({}));
    if (report.actionBrief && !body.forceRefresh) {
      return NextResponse.json({
        success: true,
        actionBrief: report.actionBrief,
        cached: true,
      });
    }

    // Synthesize action brief using Gemini 3.8 Flash or heuristic engine
    const brief = await generateActionBriefWithGemini(report);

    // Save on report
    const updated = reportStore.update(id, {
      actionBrief: brief,
    });

    return NextResponse.json({
      success: true,
      actionBrief: brief,
      cached: false,
      report: updated,
    });
  } catch (error) {
    console.error("POST /api/reports/[id]/action-brief error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate AI action brief" },
      { status: 500 }
    );
  }
}
