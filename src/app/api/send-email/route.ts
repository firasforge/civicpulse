import { NextRequest, NextResponse } from "next/server";
import { sendReportReceiptEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const {
      to,
      ticketId,
      title,
      category,
      priority,
      priorityScore,
      status,
      street,
      address,
      summary,
      citizenName,
    } = body;

    if (!to || typeof to !== "string" || !to.includes("@")) {
      return NextResponse.json(
        {
          success: false,
          error: "Recipient email address ('to') is required and must be valid.",
        },
        { status: 400 }
      );
    }

    if (!ticketId || typeof ticketId !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Ticket ID ('ticketId') is required.",
        },
        { status: 400 }
      );
    }

    const result = await sendReportReceiptEmail({
      to,
      ticketId,
      title: title || "Civic Incident Report",
      category: category || "General Issue",
      priority: priority || "Medium",
      priorityScore: typeof priorityScore === "number" ? priorityScore : 50,
      status: status || "Submitted",
      street,
      address,
      summary,
      citizenName,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("[POST /api/send-email] Caught unexpected error:", error);
    // Never fail the caller during report creation
    return NextResponse.json(
      {
        success: true,
        delivered: false,
        simulated: true,
        message: "Email dispatch gracefully bypassed due to internal notice.",
      },
      { status: 200 }
    );
  }
}
