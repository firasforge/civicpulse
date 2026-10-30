import { NextRequest, NextResponse } from "next/server";
import { reportStore } from "@/lib/store";
import { UpdateReportStatusSchema } from "@/lib/schemas";
import { TimelineEvent } from "@/lib/types";
import { updateReportInSupabase } from "@/lib/supabase";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const report = reportStore.getById(id);

    if (!report) {
      return NextResponse.json(
        { success: false, error: `Report with ID "${id}" was not found.` },
        { status: 404 }
      );
    }

    // Find linked duplicate reports if this report is a parent
    const allReports = reportStore.getAll();
    const childDuplicates = allReports.filter(
      (r) => r.duplicateLink?.parentReportId.toLowerCase() === id.toLowerCase()
    );

    return NextResponse.json({
      success: true,
      report,
      childDuplicates,
    });
  } catch (error) {
    console.error("GET /api/reports/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve report details" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const existing = reportStore.getById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Report with ID "${id}" was not found.` },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validationResult = UpdateReportStatusSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status update payload",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Create new timeline event for audit trail
    const newEvent: TimelineEvent = {
      id: `tl-${Date.now()}`,
      status: data.status,
      timestamp: new Date().toISOString(),
      actor: data.actor || "Municipal Operations",
      role: data.actor.includes("Crew") ? "Field Supervisor" : "Dispatcher",
      note: data.note,
    };

    const updatedTimeline = [...existing.timeline, newEvent];

    const updatedReport = reportStore.update(id, {
      status: data.status,
      assignedDepartment: data.assignedDepartment ?? existing.assignedDepartment,
      assignedCrew: data.assignedCrew ?? existing.assignedCrew,
      estimatedResolutionTime: data.estimatedResolutionTime ?? existing.estimatedResolutionTime,
      timeline: updatedTimeline,
    });

    if (updatedReport) {
      await updateReportInSupabase(id, {
        status: data.status,
        assignedDepartment: updatedReport.assignedDepartment,
        assignedCrew: updatedReport.assignedCrew,
        estimatedResolutionTime: updatedReport.estimatedResolutionTime,
        timeline: updatedTimeline,
      });
    }

    return NextResponse.json({
      success: true,
      report: updatedReport,
      message: `Status transitioned to ${data.status}`,
    });
  } catch (error) {
    console.error("PATCH /api/reports/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update report status" },
      { status: 500 }
    );
  }
}
