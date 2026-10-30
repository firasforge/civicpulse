import { describe, it, expect } from "vitest";
import { detectHotspotClusters } from "@/lib/ai/clustering";
import { allMockReports } from "@/lib/mockReports";
import { calculateDistanceMeters } from "@/lib/ai/similarity";

describe("Spatial Clustering & Hotspot Detection", () => {
  it("should calculate accurate Haversine distance in meters", () => {
    // Two points roughly 111 meters apart in latitude (0.001 deg)
    const dist = calculateDistanceMeters(40.7128, -74.006, 40.7138, -74.006);
    expect(dist).toBeGreaterThan(100);
    expect(dist).toBeLessThan(125);
  });

  it("should detect the dense cascading cluster on Main Street from synthetic dataset", () => {
    const clusters = detectHotspotClusters(allMockReports);
    expect(clusters.length).toBeGreaterThan(0);

    // Look for Main Street cluster
    const mainStreetCluster = clusters.find(
      (c) => c.street.toLowerCase().includes("main") || c.name.toLowerCase().includes("main")
    );

    expect(mainStreetCluster).toBeDefined();
    if (mainStreetCluster) {
      expect(mainStreetCluster.reportCount).toBeGreaterThanOrEqual(3);
      expect(mainStreetCluster.severityScore).toBeGreaterThan(50);
      expect(mainStreetCluster.aiClusterDiagnosis).toBeDefined();
      expect(mainStreetCluster.recommendedSystemicAction).toBeDefined();
      expect(mainStreetCluster.center.lat).toBeCloseTo(40.713, 2);
    }
  });

  it("should rank clusters in descending order of severity", () => {
    const clusters = detectHotspotClusters(allMockReports);
    for (let i = 0; i < clusters.length - 1; i++) {
      expect(clusters[i].severityScore).toBeGreaterThanOrEqual(clusters[i + 1].severityScore);
    }
  });

  it("should accurately isolate isolated reports that have no neighbors", () => {
    const isolatedReport = {
      ...allMockReports[0],
      id: "ISOLATED-1",
      location: {
        lat: 41.5, // Far away
        lng: -75.0,
        address: "Remote Highway 99",
        street: "Remote Highway",
      },
    };

    const clusters = detectHotspotClusters([isolatedReport]);
    // Single isolated report must not form a cluster (minimum size is 3)
    expect(clusters.length).toBe(0);
  });
});
