import { CivicReport, DuplicateLink } from "../types";

/**
 * Calculates Haversine distance in meters between two lat/lng coordinates.
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Tokenizes and extracts normalized word tokens, discarding stop words.
 */
const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "in", "on", "at", "to", "for", "of", "with",
  "is", "are", "was", "were", "it", "this", "that", "there", "has", "have",
  "had", "by", "from", "be", "been", "as", "about", "into", "through", "over"
]);

export function tokenize(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  return new Set(words);
}

/**
 * Computes Jaccard similarity coefficient between two sets of tokens (0 to 1).
 */
export function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 1.0;
  if (setA.size === 0 || setB.size === 0) return 0.0;

  let intersectionSize = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      intersectionSize++;
    }
  }

  const unionSize = setA.size + setB.size - intersectionSize;
  return unionSize === 0 ? 0 : intersectionSize / unionSize;
}

/**
 * Computes character bigram Dice-Sørensen similarity for typo tolerance.
 */
export function stringBigramSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().replace(/\s+/g, "");
  const s2 = str2.toLowerCase().replace(/\s+/g, "");
  if (s1 === s2) return 1;
  if (s1.length < 2 || s2.length < 2) return 0;

  const bigrams1 = new Map<string, number>();
  for (let i = 0; i < s1.length - 1; i++) {
    const bigram = s1.substring(i, i + 2);
    bigrams1.set(bigram, (bigrams1.get(bigram) || 0) + 1);
  }

  let intersection = 0;
  for (let i = 0; i < s2.length - 1; i++) {
    const bigram = s2.substring(i, i + 2);
    const count = bigrams1.get(bigram) || 0;
    if (count > 0) {
      bigrams1.set(bigram, count - 1);
      intersection++;
    }
  }

  return (2.0 * intersection) / (s1.length - 1 + (s2.length - 1));
}

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  bestMatch?: CivicReport;
  duplicateLink?: DuplicateLink;
}

/**
 * Scans existing reports to find potential duplicate complaints.
 * Uses geospatial proximity (Haversine) + semantic text token overlap + bigram similarity.
 */
export function detectDuplicates(
  target: {
    title: string;
    description: string;
    category: string;
    location: { lat: number; lng: number; street: string };
  },
  existingReports: CivicReport[],
  excludeId?: string
): DuplicateDetectionResult {
  const targetTokens = tokenize(`${target.title} ${target.description}`);
  let highestScore = 0;
  let bestMatch: CivicReport | undefined = undefined;
  let bestSharedFactors: string[] = [];

  for (const report of existingReports) {
    if (excludeId && report.id === excludeId) continue;

    // 1. Distance score
    const distanceMeters = calculateDistanceMeters(
      target.location.lat,
      target.location.lng,
      report.location.lat,
      report.location.lng
    );

    // 2. Textual similarity
    const reportTokens = tokenize(`${report.title} ${report.description}`);
    const tokenSim = jaccardSimilarity(targetTokens, reportTokens);
    const bigramSim = stringBigramSimilarity(
      `${target.title} ${target.description.slice(0, 150)}`,
      `${report.title} ${report.description.slice(0, 150)}`
    );
    const textScore = Math.max(tokenSim, bigramSim * 0.85);

    // 3. Category match bonus
    const isSameCategory = target.category === report.category;

    // 4. Street match bonus
    const streetMatch =
      target.location.street &&
      report.location.street &&
      target.location.street.toLowerCase() === report.location.street.toLowerCase();

    // Composite scoring formula
    // If distance is very close (< 250m) and text is moderately similar, high probability of duplicate.
    let compositeScore = 0;
    const factors: string[] = [];

    if (distanceMeters <= 50) {
      compositeScore += 0.40;
      factors.push(`Virtually identical spot (${distanceMeters}m away)`);
    } else if (distanceMeters <= 200) {
      compositeScore += 0.28;
      factors.push(`Close proximity on same corridor (${distanceMeters}m away)`);
    } else if (distanceMeters <= 500) {
      compositeScore += 0.15;
      factors.push(`Within immediate neighborhood (${distanceMeters}m away)`);
    }

    if (streetMatch) {
      compositeScore += 0.15;
      factors.push(`Same street corridor: "${report.location.street}"`);
    }

    if (isSameCategory) {
      compositeScore += 0.15;
      factors.push(`Exact category match: "${report.category}"`);
    }

    compositeScore += textScore * 0.50;
    if (textScore > 0.40) {
      factors.push(`${Math.round(textScore * 100)}% descriptive vocabulary overlap`);
    }

    // Normalizing between 0 and 1
    const finalScore = Math.min(1.0, Math.round(compositeScore * 100) / 100);

    if (finalScore > highestScore) {
      highestScore = finalScore;
      bestMatch = report;
      bestSharedFactors = factors;
    }
  }

  // Threshold: If composite score >= 0.60 and distance <= 500m OR text score >= 0.75
  const isDuplicate = highestScore >= 0.60 && bestMatch !== undefined;

  if (isDuplicate && bestMatch) {
    return {
      isDuplicate: true,
      bestMatch,
      duplicateLink: {
        parentReportId: bestMatch.id,
        similarityScore: highestScore,
        sharedFactors: bestSharedFactors,
        isConfirmed: false,
      },
    };
  }

  return {
    isDuplicate: false,
  };
}
