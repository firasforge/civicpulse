import { GoogleGenAI } from "@google/genai";
import { PriorityLevel, ReportCategory } from "../types";

export interface AIAnalysisResult {
  summary: string;
  category: ReportCategory;
  priority: PriorityLevel;
  priorityScore: number;
  priorityReasons: string[];
  suggestedDepartment: string;
  suggestedCrew: string;
  estimatedResolutionTime: string;
  isAiLive: boolean;
}

export interface AnalyzeReportInput {
  title: string;
  description: string;
  category: ReportCategory;
  street: string;
  address: string;
  duplicateFrequency?: number;
}

/**
 * Heuristic/semantic offline reasoning engine for guaranteed reliability.
 * Calculates explainable prioritization factors and structured analysis
 * when GEMINI_API_KEY is not configured or in offline environments.
 */
export function heuristicAnalyzeReport(input: AnalyzeReportInput): AIAnalysisResult {
  const text = `${input.title} ${input.description}`.toLowerCase();
  let score = 35;
  const reasons: string[] = [];

  // 1. Critical Environmental / Public Safety Risk Triggers (85 - 100)
  const isElectricShock =
    text.includes("spark") ||
    text.includes("live wire") ||
    text.includes("exposed wire") ||
    text.includes("electrocution") ||
    text.includes("high voltage") ||
    text.includes("fire") ||
    text.includes("smoke");

  const isOpenManhole =
    text.includes("manhole") ||
    text.includes("open drain") ||
    text.includes("missing cover") ||
    text.includes("deep pit") ||
    text.includes("hole in bridge") ||
    text.includes("railing collapsed");

  const isSevereFlooding =
    text.includes("submerged") ||
    text.includes("waist deep") ||
    text.includes("knee deep") ||
    text.includes("cars trapped") ||
    text.includes("water entering houses") ||
    text.includes("flooding") ||
    text.includes("deep water");

  const isGasOrChemicalLeak =
    text.includes("gas leak") ||
    text.includes("gas smell") ||
    text.includes("natural gas") ||
    text.includes("pipeline rupture") ||
    text.includes("toxic fumes") ||
    text.includes("chemical spill") ||
    text.includes("explosion");

  const isEnvironmentalHazard = isElectricShock || isOpenManhole || isSevereFlooding || isGasOrChemicalLeak;

  // 2. Traffic & Proximity to Schools / Hospitals (+15 Priority Boost)
  const isVulnerableZone =
    text.includes("school") ||
    text.includes("hospital") ||
    text.includes("clinic") ||
    text.includes("kindergarten") ||
    text.includes("pedestrian crossing") ||
    text.includes("children") ||
    text.includes("elderly") ||
    input.street.toLowerCase().includes("school") ||
    input.street.toLowerCase().includes("hospital");

  const isMajorTrafficCorridor =
    text.includes("main road") ||
    text.includes("highway") ||
    text.includes("intersection") ||
    text.includes("junction") ||
    text.includes("transit") ||
    text.includes("bus stop") ||
    text.includes("heavy traffic") ||
    input.street.toLowerCase().includes("main st") ||
    input.street.toLowerCase().includes("avenue") ||
    input.street.toLowerCase().includes("expressway");

  const isProximityBoost = isVulnerableZone || isMajorTrafficCorridor;

  // Apply Environmental / Safety Hazard base tier (85 - 100)
  if (isEnvironmentalHazard) {
    score = Math.max(score, 85);
    if (isElectricShock) {
      score += 10;
      reasons.push("Critical electrical discharge / active electrocution hazard to pedestrians (85-100 baseline)");
    }
    if (isGasOrChemicalLeak) {
      score += 10;
      reasons.push("High-risk gas leak / chemical vapor hazard threatening public health (85-100 baseline)");
    }
    if (isOpenManhole) {
      score += 7;
      reasons.push("Immediate fall hazard / open underground shaft with risk of fatal trauma (85-100 baseline)");
    }
    if (isSevereFlooding) {
      score += 5;
      reasons.push("Severe water accumulation / submerged roadway trapping vehicular transit (85-100 baseline)");
    }
  }

  // Apply Traffic / Proximity Boost (+15)
  if (isProximityBoost) {
    score += 15;
    if (isVulnerableZone) {
      reasons.push("Proximity to active school/hospital/pedestrian zone (+15 priority boost)");
    } else {
      reasons.push("High-throughput arterial traffic corridor / transit route (+15 priority boost)");
    }
  }

  // 3. Duplicate Frequency Urgency Boost
  const dupFreq = input.duplicateFrequency ?? 0;
  if (dupFreq > 0) {
    const dupBoost = Math.min(15, dupFreq * 5);
    score += dupBoost;
    reasons.push(`High community urgency: ${dupFreq} duplicate/correlated report(s) on same issue (+${dupBoost} boost)`);
  }

  const isHealthHazard =
    text.includes("toxic") ||
    text.includes("chemical") ||
    text.includes("rotting") ||
    text.includes("maggots") ||
    text.includes("stench") ||
    text.includes("rats") ||
    text.includes("medical waste");

  if (isHealthHazard && !isEnvironmentalHazard) {
    score += 20;
    reasons.push("Active biohazard / sanitation risk promoting vermin and disease vectors");
  }

  // Category specific base adjustments
  let assignedDepartment = "Public Works";
  let assignedCrew = "General Maintenance";
  let eta = "24 - 48 hours";

  if (input.category === "Broken Streetlights") {
    assignedDepartment = "Municipal Electrical & Lighting Dept";
    assignedCrew = isElectricShock ? "High-Voltage Emergency Unit" : "Bucket Truck Line Crew";
    eta = isElectricShock ? "1 - 2 hours" : "12 - 24 hours";
    if (!isElectricShock && reasons.length === 0) reasons.push("Reduced night-time visibility on public right-of-way");
  } else if (input.category === "Waterlogging") {
    assignedDepartment = "Stormwater & Drainage Division";
    assignedCrew = "High-Capacity Dewatering Unit";
    eta = score >= 75 ? "2 - 4 hours" : "8 - 12 hours";
    if (reasons.length === 0) reasons.push("Drainage blockage causing localized surface pooling");
  } else if (input.category === "Damaged Roads") {
    assignedDepartment = "Department of Transportation (Roads)";
    assignedCrew = score >= 75 ? "Emergency Asphalt Quick-Patch Squad" : "Road Paving Maintenance";
    eta = score >= 75 ? "4 - 8 hours" : "24 - 48 hours";
    if (reasons.length === 0) reasons.push("Pavement crater with potential for rim and tire damage");
  } else if (input.category === "Garbage Overflow") {
    assignedDepartment = "Solid Waste Management Bureau";
    assignedCrew = "Heavy Compactor & Sanitization Unit";
    eta = score >= 75 ? "3 - 6 hours" : "12 - 24 hours";
    if (reasons.length === 0) reasons.push("Public cleanliness violation impeding walkway access");
  } else if (input.category === "Disrupted Services") {
    assignedDepartment = "City Utilities & Transit Authority";
    assignedCrew = isGasOrChemicalLeak ? "Emergency Utility HazMat Unit" : "Utility Infrastructure Rapid Team";
    eta = isGasOrChemicalLeak ? "1 - 2 hours" : "4 - 8 hours";
    if (reasons.length === 0) reasons.push("Interrupted civic amenity affecting residential sector");
  }

  // Normalization (0 to 100)
  const priorityScore = Math.max(15, Math.min(100, score));
  let priority: PriorityLevel = "Low";
  if (priorityScore >= 80) priority = "Critical";
  else if (priorityScore >= 60) priority = "High";
  else if (priorityScore >= 40) priority = "Medium";

  // Build clean summary
  const summary = `${input.category} reported at ${input.street}. ${
    reasons[0] ? reasons[0] : "Identified for civic review and dispatch scheduling."
  }`;

  return {
    summary,
    category: input.category,
    priority,
    priorityScore,
    priorityReasons: reasons.length > 0 ? reasons : ["Standard civic maintenance request without immediate life-safety hazards"],
    suggestedDepartment: assignedDepartment,
    suggestedCrew: assignedCrew,
    estimatedResolutionTime: eta,
    isAiLive: false,
  };
}

/**
 * Calls Gemini 3.8 Flash via @google/genai SDK for real-time analysis,
 * falling back gracefully to heuristic intelligence when API key is omitted.
 */
export async function analyzeReportWithGemini(input: AnalyzeReportInput): Promise<AIAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "placeholder_key") {
    return heuristicAnalyzeReport(input);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an elite municipal emergency AI dispatcher for a smart city platform.
Analyze this incoming citizen report and respond ONLY with a valid JSON object matching the requested schema.

Report Input:
- Title: "${input.title}"
- Description: "${input.description}"
- Selected Category: "${input.category}"
- Street/Location: "${input.street}, ${input.address}"
- Correlated Duplicate Frequency: ${input.duplicateFrequency || 0} existing complaints

Evaluation & Prioritization Formula:
1. Environmental/Safety Hazard (e.g. live sparking wires, deep water/flash floods, gas leaks, open manholes) -> Base threat score must be 85 - 100 (Critical Priority).
2. Traffic & Proximity to Schools or Hospitals -> Apply a mandatory +15 priority boost.
3. Duplicate Frequency (${input.duplicateFrequency || 0} duplicates) -> Apply a +5 boost per duplicate report (up to +15 max) reflecting escalating community urgency.
4. Scale: Critical (80-100), High (60-79), Medium (40-59), Low (15-39).

Respond with strict JSON ONLY in this format:
{
  "summary": "1-2 sentence executive summary of the problem and location",
  "category": "Waterlogging" | "Damaged Roads" | "Garbage Overflow" | "Broken Streetlights" | "Disrupted Services",
  "priority": "Critical" | "High" | "Medium" | "Low",
  "priorityScore": 88,
  "priorityReasons": [
    "Specific factor 1 (e.g., Live 240V sparking conductor dangling near pedestrian sidewalk - 85-100 hazard)",
    "Specific factor 2 (e.g., Proximity to school zone / traffic corridor - +15 priority boost)"
  ],
  "suggestedDepartment": "Department Name",
  "suggestedCrew": "Specialized Crew Name",
  "estimatedResolutionTime": "e.g. 1 - 2 hours"
}`;

    // Use gemini-3.8-flash
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const textOutput = response.text || "";
    const cleaned = textOutput.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const validCategories: ReportCategory[] = [
      "Waterlogging",
      "Damaged Roads",
      "Garbage Overflow",
      "Broken Streetlights",
      "Disrupted Services",
    ];
    const category: ReportCategory = validCategories.includes(parsed.category)
      ? parsed.category
      : input.category;

    const validPriorities: PriorityLevel[] = ["Critical", "High", "Medium", "Low"];
    const priority: PriorityLevel = validPriorities.includes(parsed.priority)
      ? parsed.priority
      : "Medium";

    const score = typeof parsed.priorityScore === "number" ? parsed.priorityScore : 50;

    return {
      summary: parsed.summary || `${input.category} reported at ${input.street}`,
      category,
      priority,
      priorityScore: Math.max(10, Math.min(99, score)),
      priorityReasons:
        Array.isArray(parsed.priorityReasons) && parsed.priorityReasons.length > 0
          ? parsed.priorityReasons
          : ["Assessed via Gemini 3.8 Flash municipal risk matrix"],
      suggestedDepartment: parsed.suggestedDepartment || "City Operations",
      suggestedCrew: parsed.suggestedCrew || "Field Response Crew",
      estimatedResolutionTime: parsed.estimatedResolutionTime || "12 - 24 hours",
      isAiLive: true,
    };
  } catch (error) {
    console.warn("Gemini API call failed, falling back to local heuristic reasoning:", error);
    return heuristicAnalyzeReport(input);
  }
}
