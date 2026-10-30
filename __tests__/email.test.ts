import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendReportReceiptEmail } from "../src/lib/email";
import { POST } from "../src/app/api/send-email/route";
import { NextRequest } from "next/server";

describe("Email Receipt Service (Resend Integration & Fallback)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("sendReportReceiptEmail falls back gracefully when RESEND_API_KEY is not set", async () => {
    const originalKey = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;

    const result = await sendReportReceiptEmail({
      to: "citizen@example.com",
      ticketId: "CP-2026-1044",
      title: "Broken Streetlight on 5th Ave",
      category: "Broken Streetlights",
      priority: "High",
      priorityScore: 75,
      status: "Submitted",
      street: "5th Ave",
      address: "123 5th Ave",
      summary: "Damaged pole with flashing fixture posing hazard",
      citizenName: "Citizen Alex",
    });

    expect(result.success).toBe(true);
    expect(result.simulated).toBe(true);
    expect(result.delivered).toBe(false);
    expect(result.message).toContain("CP-2026-1044");

    process.env.RESEND_API_KEY = originalKey;
  });

  it("POST /api/send-email validates required fields", async () => {
    // Missing 'to'
    const reqWithoutTo = new NextRequest("http://localhost:3000/api/send-email", {
      method: "POST",
      body: JSON.stringify({ ticketId: "CP-2026-1001" }),
    });
    const resWithoutTo = await POST(reqWithoutTo);
    expect(resWithoutTo.status).toBe(400);

    // Missing 'ticketId'
    const reqWithoutId = new NextRequest("http://localhost:3000/api/send-email", {
      method: "POST",
      body: JSON.stringify({ to: "user@example.com" }),
    });
    const resWithoutId = await POST(reqWithoutId);
    expect(resWithoutId.status).toBe(400);
  });

  it("POST /api/send-email dispatches email or gracefully simulates with 200 status", async () => {
    const req = new NextRequest("http://localhost:3000/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        to: "citizen@test.org",
        ticketId: "CP-2026-1088",
        title: "Main Street Flash Flood",
        category: "Waterlogging",
        priority: "Critical",
        priorityScore: 92,
        status: "Submitted",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
  });
});
