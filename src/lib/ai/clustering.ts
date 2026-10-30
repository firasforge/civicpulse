import { CivicReport, HotspotCluster, ReportCategory } from "../types";
import { calculateDistanceMeters } from "./similarity";

/**
 * Cluster grouping threshold in meters.
 * Reports within 250m of each other or along the same street block are clustered.
 */
const CLUSTER_DISTANCE_METERS = 280;
const MIN_CLUSTER_SIZE = 3;

export function detectHotspotClusters(reports: CivicReport[]): HotspotCluster[] {
  // Only cluster active/non-resolved reports (or all reports to show historical density)
  const activeReports = reports.filter((r) => r.status !== "Resolved");
  const visited = new Set<string>();
  const rawClusters: CivicReport[][] = [];

  for (let i = 0; i < activeReports.length; i++) {
    const current = activeReports[i];
    if (visited.has(current.id)) continue;

    const clusterGroup: CivicReport[] = [current];
    visited.add(current.id);

    for (let j = 0; j < activeReports.length; j++) {
      if (i === j) continue;
      const candidate = activeReports[j];
      if (visited.has(candidate.id)) continue;

      const dist = calculateDistanceMeters(
        current.location.lat,
        current.location.lng,
        candidate.location.lat,
        candidate.location.lng
      );

      const sameStreet =
        current.location.street &&
        candidate.location.street &&
        current.location.street.toLowerCase() === candidate.location.street.toLowerCase();

      // If within distance or same street within 450m
      if (dist <= CLUSTER_DISTANCE_METERS || (sameStreet && dist <= 450)) {
        clusterGroup.push(candidate);
        visited.add(candidate.id);
      }
    }

    if (clusterGroup.length >= MIN_CLUSTER_SIZE) {
      rawClusters.push(clusterGroup);
    }
  }

  // Transform raw report groupings into rich HotspotCluster objects
  const clusters: HotspotCluster[] = rawClusters.map((group, index) => {
    // Calculate centroid
    const totalLat = group.reduce((sum, r) => sum + r.location.lat, 0);
    const totalLng = group.reduce((sum, r) => sum + r.location.lng, 0);
    const center = {
      lat: totalLat / group.length,
      lng: totalLng / group.length,
    };

    // Calculate maximum distance to centroid as radius
    let maxDist = 50;
    for (const r of group) {
      const d = calculateDistanceMeters(center.lat, center.lng, r.location.lat, r.location.lng);
      if (d > maxDist) maxDist = d;
    }

    // Category distribution
    const categories: { [key in ReportCategory]?: number } = {};
    for (const r of group) {
      categories[r.category] = (categories[r.category] || 0) + 1;
    }

    // Determine primary category
    let primaryCategory: ReportCategory = group[0].category;
    let maxCount = 0;
    for (const [cat, count] of Object.entries(categories)) {
      if ((count || 0) > maxCount) {
        maxCount = count || 0;
        primaryCategory = cat as ReportCategory;
      }
    }

    // Critical incidents count
    const criticalCount = group.filter((r) => r.priority === "Critical").length;
    const highCount = group.filter((r) => r.priority === "High").length;

    // Severity calculation (0 - 100)
    const baseSeverity = Math.min(
      100,
      group.length * 10 + criticalCount * 25 + highCount * 12
    );

    // Dominant street name
    const streetFrequency = new Map<string, number>();
    for (const r of group) {
      const st = r.location.street || "Metro Area";
      streetFrequency.set(st, (streetFrequency.get(st) || 0) + 1);
    }
    let dominantStreet = "Urban Sector";
    let maxStCount = 0;
    streetFrequency.forEach((count, st) => {
      if (count > maxStCount) {
        maxStCount = count;
        dominantStreet = st;
      }
    });

    // AI Cluster Diagnosis based on multi-category failure patterns
    const hasWaterlogging = (categories["Waterlogging"] || 0) > 0;
    const hasRoadDamage = (categories["Damaged Roads"] || 0) > 0;
    const hasLighting = (categories["Broken Streetlights"] || 0) > 0;
    const hasGarbage = (categories["Garbage Overflow"] || 0) > 0;

    let diagnosis = `${group.length} overlapping complaints detected along ${dominantStreet}.`;
    let systemicAction = `Deploy coordinated municipal inspection to ${dominantStreet}.`;

    if (hasWaterlogging && hasRoadDamage && hasLighting) {
      diagnosis = `Severe Cascading Infrastructure Failure: Subsurface storm drain clogging along ${dominantStreet} is backing up water, eroding asphalt sub-base, and flooding low-voltage utility conduits.`;
      systemicAction = `Joint Taskforce Mobilization: Dispatch Vactor 2100 vacuum truck for storm line de-silting, cordon submerged electrical junction boxes, and schedule emergency milling/patching post-drainage.`;
    } else if (hasWaterlogging && hasRoadDamage) {
      diagnosis = `Hydro-Structural Road Collapse Risk: Persistent stagnant stormwater pooling is destabilizing pavement integrity, creating vehicle-damaging craters.`;
      systemicAction = `Deploy stormwater suction pumps to clear corridor, followed by immediate cold-mix pothole leveling and culvert clearing.`;
    } else if (hasGarbage && hasWaterlogging) {
      diagnosis = `Drainage Clogging Vector: Overflowing commercial dumpster runoff is choking curbside storm grates, preventing natural water egress.`;
      systemicAction = `Priority Solid Waste sweep with mechanical sweepers and high-pressure grate declogging.`;
    } else if (criticalCount > 0) {
      diagnosis = `Active Public Safety Hotspot: Contains ${criticalCount} critical hazard reports with elevated risk to pedestrians and vehicular traffic.`;
      systemicAction = `Immediate emergency perimeter isolation and priority dispatch of specialized first-response technical crews.`;
    }

    return {
      id: `CLUSTER-${index + 1}-${dominantStreet.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}`,
      name: `${dominantStreet} Infrastructure Hotspot`,
      street: dominantStreet,
      center,
      radiusMeters: Math.max(80, Math.min(500, Math.round(maxDist + 30))),
      reportCount: group.length,
      reports: group,
      primaryCategory,
      categories,
      criticalCount,
      severityScore: baseSeverity,
      aiClusterDiagnosis: diagnosis,
      recommendedSystemicAction: systemicAction,
    };
  });

  // Sort by severity descending
  return clusters.sort((a, b) => b.severityScore - a.severityScore);
}
