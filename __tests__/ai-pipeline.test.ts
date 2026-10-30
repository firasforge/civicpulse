import { describe, it, expect } from "vitest";
import { heuristicAnalyzeReport } from "@/lib/ai/gemini";
import { heuristicActionBrief } from "@/lib/ai/actionBrief";
import { CivicReport } from "@/lib/types";

describe("AI Understanding & Prioritization Pipeline", () => {
  it("should classify live electrical hazard near school as Critical (Score >= 80)", () => {
    const analysis = heuristicAnalyzeReport({
      title: "Sparking Live Wire Dangling",
      description: "A live electric wire is sparking violently right outside the elementary school entrance where children walk.",
      category: "Broken Streetlights",
      street: "Oak Street",
      address: "120 Oak Street",
    });

    expect(analysis.priority).toBe("Critical");
    expect(analysis.priorityScore).toBeGreaterThanOrEqual(80);
    expect(analysis.priorityReasons.length).toBeGreaterThan(0);
    // Explainable AI factors
    const combinedReasons = analysis.priorityReasons.join(" ");
    expect(combinedReasons.toLowerCase()).toMatch(/electrocution|electrical|school|hazard/);
    expect(analysis.suggestedCrew).toContain("High-Voltage");
  });

  it("should classify missing manhole on active road as Critical", () => {
    const analysis = heuristicAnalyzeReport({
      title: "Missing manhole cover on 5th Avenue",
      description: "An open manhole with a 10 foot deep pit is completely uncovered on the bike lane.",
      category: "Damaged Roads",
      street: "5th Avenue",
      address: "310 5th Avenue",
    });

    expect(analysis.priority).toBe("Critical");
    expect(analysis.priorityScore).toBeGreaterThanOrEqual(80);
    expect(analysis.priorityReasons[0]).toContain("fall hazard");
  });

  it("should route Waterlogging complaints to Stormwater & Drainage Division", () => {
    const analysis = heuristicAnalyzeReport({
      title: "Street flooded after rain",
      description: "The storm drain is blocked and 1 foot of water is standing in front of houses.",
      category: "Waterlogging",
      street: "Main Street",
      address: "200 Main Street",
    });

    expect(analysis.suggestedDepartment).toBe("Stormwater & Drainage Division");
  });

  it("should synthesize a comprehensive 1-minute Action Brief with tools and safety directives", () => {
    const dummyReport: CivicReport = {
      id: "TEST-01",
      title: "Severe Roadway Flooding at Main St",
      description: "Storm drain blocked with mud and branches, water backing up into road.",
      category: "Waterlogging",
      location: {
        lat: 40.7128,
        lng: -74.006,
        address: "Main St",
        street: "Main Street",
      },
      status: "Submitted",
      priority: "Critical",
      priorityScore: 92,
      priorityReasons: ["Severe flooding"],
      summary: "Severe flooding",
      timeline: [],
      upvotes: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const brief = heuristicActionBrief(dummyReport);
    expect(brief.rootCause).toBeDefined();
    expect(brief.recommendedCrew).toBeDefined();
    expect(brief.requiredEquipment.length).toBeGreaterThanOrEqual(2);
    expect(brief.safetyPrecautions.length).toBeGreaterThanOrEqual(1);
    expect(brief.estimatedResolutionTime).toBeDefined();
    expect(brief.budgetEstimate).toBeDefined();
  });
});
