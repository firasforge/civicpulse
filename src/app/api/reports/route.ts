import { NextRequest, NextResponse } from "next/server";
import { reportStore } from "@/lib/store";
import { CreateReportSchema } from "@/lib/schemas";
import { analyzeReportWithGemini } from "@/lib/ai/gemini";
import { detectDuplicates } from "@/lib/ai/similarity";
import { CivicReport, TimelineEvent } from "@/lib/types";
import {
  saveReportToSupabase,
  fetchReportsFromSupabase,
  syncReportsToSupabase,
} from "@/lib/supabase";
import { sendReportReceiptEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const priority = searchParams.get("priority");
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.toLowerCase();

    // Synchronize from Supabase PostgreSQL if configured
    const remoteReports = await fetchReportsFromSupabase();
    if (remoteReports && remoteReports.length > 0) {
      reportStore.syncAll(remoteReports);
    }

    let reports = reportStore.getAll();

    if (category && category !== "All") {
      reports = reports.filter((r) => r.category === category);
    }
    if (priority && priority !== "All") {
      reports = reports.filter((r) => r.priority === priority);
    }
    if (status && status !== "All") {
      reports = reports.filter((r) => r.status === status);
    }
    if (search) {
      reports = reports.filter(
        (r) =>
          r.title.toLowerCase().includes(search) ||
          r.description.toLowerCase().includes(search) ||
          r.location.street.toLowerCase().includes(search) ||
          r.location.address.toLowerCase().includes(search) ||
          r.id.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("GET /api/reports error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve civic reports" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validate and sanitize input with Zod
    const validationResult = CreateReportSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 2. Scan for duplicates and calculate frequency
    const existingReports = reportStore.getAll();
    const duplicateCheck = detectDuplicates(
      {
        title: data.title,
        description: data.description,
        category: data.category,
        location: {
          lat: data.location.lat,
          lng: data.location.lng,
          street: data.location.street,
        },
      },
      existingReports
    );

    let duplicateFrequency = 0;
    if (duplicateCheck.isDuplicate && duplicateCheck.bestMatch) {
      const parentId = duplicateCheck.bestMatch.id;
      duplicateFrequency =
        1 +
        existingReports.filter(
          (r) => r.duplicateLink?.parentReportId.toLowerCase() === parentId.toLowerCase()
        ).length;
    }

    // 3. AI Understanding Pipeline: Gemini 3.8 Flash with duplicate frequency context
    const aiAnalysis = await analyzeReportWithGemini({
      title: data.title,
      description: data.description,
      category: data.category,
      street: data.location.street,
      address: data.location.address,
      duplicateFrequency,
    });

    // 4. Generate guaranteed collision-proof unique tracking ticket ID
    const existingNumbers = existingReports
      .map((r) => {
        const m = r.id.match(/CP-2026-(\d+)/i);
        return m ? parseInt(m[1], 10) : 0;
      })
      .filter((n) => !isNaN(n) && n > 0);
    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 1000;
    let nextTicketNumber = Math.max(maxNumber + 1, 1001);
    while (existingReports.some((r) => r.id === `CP-2026-${nextTicketNumber}`)) {
      nextTicketNumber++;
    }
    const reportId = `CP-2026-${nextTicketNumber}`;
    const now = new Date().toISOString();

    const initialTimeline: TimelineEvent[] = [
      {
        id: `tl-${Date.now()}-1`,
        status: "Submitted",
        timestamp: now,
        actor: data.citizenContact?.name || "Citizen (Web Portal)",
        role: "Citizen",
        note: "Complaint submitted with location and multimedia evidence.",
      },
      {
        id: `tl-${Date.now()}-2`,
        status: "Submitted",
        timestamp: new Date(Date.now() + 1000).toISOString(),
        actor: aiAnalysis.isAiLive ? "Gemini 3.8 Flash Dispatch AI" : "CivicPulse AI Engine",
        role: "System",
        note: `AI Analyzed: Priority ${aiAnalysis.priority} (Score: ${aiAnalysis.priorityScore}/100). ${aiAnalysis.priorityReasons[0]}`,
      },
    ];

    if (duplicateCheck.isDuplicate && duplicateCheck.duplicateLink) {
      initialTimeline.push({
        id: `tl-${Date.now()}-3`,
        status: "Submitted",
        timestamp: new Date(Date.now() + 2000).toISOString(),
        actor: "CivicPulse Duplicate Linker",
        role: "System",
        note: `Flagged potential duplicate of ${duplicateCheck.duplicateLink.parentReportId} (${Math.round(duplicateCheck.duplicateLink.similarityScore * 100)}% match).`,
      });
    }

    // 5. Construct full CivicReport
    const newReport: CivicReport = {
      id: reportId,
      title: data.title,
      description: data.description,
      category: aiAnalysis.category,
      location: data.location,
      imageUrl: data.imageUrl,
      status: "Submitted",
      priority: aiAnalysis.priority,
      priorityScore: aiAnalysis.priorityScore,
      priorityReasons: aiAnalysis.priorityReasons,
      summary: aiAnalysis.summary,
      duplicateLink: duplicateCheck.isDuplicate ? duplicateCheck.duplicateLink : undefined,
      assignedDepartment: aiAnalysis.suggestedDepartment,
      assignedCrew: aiAnalysis.suggestedCrew,
      estimatedResolutionTime: aiAnalysis.estimatedResolutionTime,
      timeline: initialTimeline,
      citizenContact: data.citizenContact,
      upvotes: 1,
      createdAt: now,
      updatedAt: now,
    };

    const saved = reportStore.create(newReport);

    // Save report to Supabase PostgreSQL so data persists across refreshes and accounts
    await saveReportToSupabase(saved);

    // Dispatch email receipt if citizen provided email (with graceful fallback if RESEND_API_KEY is not set)
    if (data.citizenContact?.email) {
      sendReportReceiptEmail({
        to: data.citizenContact.email,
        ticketId: saved.id,
        title: saved.title,
        category: saved.category,
        priority: saved.priority,
        priorityScore: saved.priorityScore,
        status: saved.status,
        street: saved.location.street,
        address: saved.location.address,
        summary: saved.summary,
        citizenName: data.citizenContact.name,
      }).catch((err) => {
        console.warn("[CivicPulse Email] Dispatch caught non-fatal notice:", err);
      });
    }

    return NextResponse.json(
      {
        success: true,
        report: saved,
        trackingId: saved.id,
        isAiLive: aiAnalysis.isAiLive,
        duplicateDetected: duplicateCheck.isDuplicate,
        duplicateMatch: duplicateCheck.bestMatch ? {
          id: duplicateCheck.bestMatch.id,
          title: duplicateCheck.bestMatch.title,
          similarityScore: duplicateCheck.duplicateLink?.similarityScore,
        } : undefined,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reports error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process civic report submission" },
      { status: 500 }
    );
  }
}

// Sync entire report store from localStorage if needed
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (Array.isArray(body.reports)) {
      const synced = reportStore.syncAll(body.reports);
      // Synchronize batch to Supabase PostgreSQL
      await syncReportsToSupabase(synced);
      return NextResponse.json({
        success: true,
        message: "Server store synchronized with client state and Supabase",
        count: synced.length,
      });
    }
    return NextResponse.json(
      { success: false, error: "Invalid reports array payload" },
      { status: 400 }
    );
  } catch (error) {
    console.error("PUT /api/reports error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to synchronize reports" },
      { status: 500 }
    );
  }
}

// Reset store endpoint for judges to test cleanly
export async function DELETE() {
  try {
    const resetList = reportStore.reset();
    return NextResponse.json({
      success: true,
      message: "Database reset to benchmark reports",
      count: resetList.length,
    });
  } catch (error) {
    console.error("DELETE /api/reports error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset database" },
      { status: 500 }
    );
  }
}
