import { NextRequest, NextResponse } from "next/server";
import { reportStore } from "@/lib/store";
import { UpvoteReportSchema } from "@/lib/schemas";
import { updateReportInSupabase } from "@/lib/supabase";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const parsed = UpvoteReportSchema.safeParse(body);
    const voterToken = parsed.success ? parsed.data.voterToken : "client-" + Date.now();

    const result = reportStore.upvote(id, voterToken);

    if (!result.report) {
      return NextResponse.json(
        { success: false, error: `Report "${id}" not found.` },
        { status: 404 }
      );
    }

    if (result.alreadyVoted) {
      return NextResponse.json({
        success: false,
        alreadyVoted: true,
        message: "You have already upvoted this complaint.",
        upvotes: result.report.upvotes,
      });
    }

    // Persist upvote increment to Supabase PostgreSQL
    await updateReportInSupabase(id, {
      upvotes: result.report.upvotes,
      upvotedByIp: result.report.upvotedByIp,
    });

    return NextResponse.json({
      success: true,
      upvotes: result.report.upvotes,
      message: "Upvote recorded. Elevating community urgency signal.",
    });
  } catch (error) {
    console.error("POST /api/reports/[id]/upvote error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record upvote" },
      { status: 500 }
    );
  }
}
