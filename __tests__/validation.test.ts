import { describe, it, expect } from "vitest";
import { CreateReportSchema, UpdateReportStatusSchema, sanitizeText } from "@/lib/schemas";

describe("Input Validation & XSS Sanitization", () => {
  it("should strip malicious script tags and inline event handlers", () => {
    const maliciousInput = '<script>alert("xss")</script>Dangerous pothole <img src=x onerror=alert(1)>';
    const sanitized = sanitizeText(maliciousInput);
    expect(sanitized).not.toContain("<script>");
    expect(sanitized).not.toContain("</script>");
    expect(sanitized).not.toContain("onerror=");
    expect(sanitized).toContain("Dangerous pothole");
  });

  it("should strip javascript: pseudo protocol", () => {
    const malicious = "javascript:alert(1)";
    expect(sanitizeText(malicious)).toBe("alert(1)");
  });

  it("should accept valid civic report payload", () => {
    const payload = {
      title: "Deep Pothole on Oak Street",
      description: "A very deep pothole roughly 2 feet wide has opened up in the lane.",
      category: "Damaged Roads",
      location: {
        lat: 40.7128,
        lng: -74.006,
        address: "123 Oak Street, City Center",
        street: "Oak Street",
        zone: "Central",
      },
      citizenContact: {
        name: "Jane Citizen",
        email: "jane@example.com",
      },
    };

    const result = CreateReportSchema.safeParse(payload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Deep Pothole on Oak Street");
      expect(result.data.category).toBe("Damaged Roads");
    }
  });

  it("should reject payload with missing or short description", () => {
    const payload = {
      title: "Deep Pothole",
      description: "Too short", // under 10 chars
      category: "Damaged Roads",
      location: {
        lat: 40.7128,
        lng: -74.006,
        address: "123 Oak Street",
        street: "Oak Street",
      },
    };

    const result = CreateReportSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("should reject invalid category", () => {
    const payload = {
      title: "Broken streetlight",
      description: "The light fixture has broken and is pitch dark outside.",
      category: "Alien Invasion", // Invalid
      location: {
        lat: 40.7128,
        lng: -74.006,
        address: "123 Oak Street",
        street: "Oak Street",
      },
    };

    const result = CreateReportSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("should validate and sanitize status update transitions", () => {
    const updatePayload = {
      status: "Dispatched",
      assignedDepartment: "Public Works <b onclick='hack()'>Dept</b>",
      assignedCrew: "Unit 4",
      note: "Crew deployed with high-pressure suction vacuum.",
      actor: "Chief Dispatcher Miller",
    };

    const result = UpdateReportStatusSchema.safeParse(updatePayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("Dispatched");
      expect(result.data.assignedDepartment).toBe("Public Works Dept");
      expect(result.data.assignedDepartment).not.toContain("onclick");
    }
  });
});
