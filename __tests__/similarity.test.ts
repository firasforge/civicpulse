import { describe, it, expect } from "vitest";
import {
  detectDuplicates,
  jaccardSimilarity,
  stringBigramSimilarity,
  tokenize,
} from "@/lib/ai/similarity";
import { allMockReports } from "@/lib/mockReports";

describe("Semantic Similarity & Duplicate Linker", () => {
  it("should compute accurate Jaccard token similarity", () => {
    const textA = tokenize("Massive pothole on Main Street near grocery store");
    const textB = tokenize("Huge deep pothole on Main Street by the grocery store");
    const sim = jaccardSimilarity(textA, textB);
    expect(sim).toBeGreaterThan(0.5);
  });

  it("should compute high bigram similarity for close strings with typos", () => {
    const s1 = "Severe waterlogging 4th avenue";
    const s2 = "Severe waterloging 4th avenue"; // intentional typo
    const sim = stringBigramSimilarity(s1, s2);
    expect(sim).toBeGreaterThan(0.85);
  });

  it("should identify deliberate duplicate pair CP-2026-1004 & CP-2026-1005 (Food Court Dumpsters)", () => {
    const parentReport = allMockReports.find((r) => r.id === "CP-2026-1004")!;
    expect(parentReport).toBeDefined();

    const incomingReport = {
      title: "Food Court Bins Spilling Rotten Waste and Trash into Alley",
      description: "The alleyway behind the food court on 8th st is completely trashed. Garbage cans are overflowing everywhere with spoiled food.",
      category: "Garbage Overflow",
      location: {
        lat: 40.7162,
        lng: -74.0012,
        street: "8th Street",
      },
    };

    const result = detectDuplicates(incomingReport, [parentReport]);
    expect(result.isDuplicate).toBe(true);
    expect(result.bestMatch?.id).toBe("CP-2026-1004");
    expect(result.duplicateLink?.similarityScore).toBeGreaterThan(0.65);
    expect(result.duplicateLink?.sharedFactors.length).toBeGreaterThan(0);
  });

  it("should identify deliberate duplicate pair for Live Sparking Wire (CP-2026-1011)", () => {
    const parentReport = allMockReports.find((r) => r.id === "CP-2026-1011")!;
    expect(parentReport).toBeDefined();

    const incomingDuplicate = {
      title: "Downed Electrical Cable Sparking on Oak St near School",
      description: "There is an electric cable hanging from a wooden pole near the school crosswalk on Oak Street. Sparks are flying.",
      category: "Broken Streetlights",
      location: {
        lat: 40.7189,
        lng: -74.0094,
        street: "Oak Street",
      },
    };

    const result = detectDuplicates(incomingDuplicate, [parentReport]);
    expect(result.isDuplicate).toBe(true);
    expect(result.bestMatch?.id).toBe("CP-2026-1011");
    expect(result.duplicateLink?.similarityScore).toBeGreaterThan(0.7);
  });

  it("should not flag completely unrelated reports as duplicates", () => {
    const streetlightReport = allMockReports.find((r) => r.id === "CP-2026-1030")!;

    const unrelatedComplaint = {
      title: "Broken Playground Swing in East Park",
      description: "A rubber swing seat has snapped on the playground set.",
      category: "Damaged Roads",
      location: {
        lat: 40.78, // 8 km away
        lng: -73.95,
        street: "East Boulevard",
      },
    };

    const result = detectDuplicates(unrelatedComplaint, [streetlightReport]);
    expect(result.isDuplicate).toBe(false);
  });
});
