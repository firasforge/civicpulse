import { GoogleGenAI } from "@google/genai";
import { ActionBrief, CivicReport } from "../types";

export function heuristicActionBrief(report: CivicReport): ActionBrief {
  const cat = report.category;
  const desc = report.description.toLowerCase();
  const isUrgent = report.priority === "Critical" || report.priority === "High";

  let rootCause = "Deferred maintenance and wear-and-tear on municipal asset.";
  let recommendedCrew = "Public Works Rapid Response";
  let requiredEquipment = ["Traffic cones", "Standard utility toolkit", "Reflective safety vests"];
  let safetyPrecautions = ["Deploy high-visibility warning signage 50m upstream"];
  let eta = "24 - 48 hours";
  let budgetEstimate = "$250 - $450";

  if (cat === "Waterlogging") {
    if (desc.includes("drain") || desc.includes("sewer") || desc.includes("block")) {
      rootCause = "Subterranean stormwater conduit occluded with silt, sediment, and urban debris.";
      recommendedCrew = "Stormwater & Drainage Jet-Vac Crew";
      requiredEquipment = [
        "Vactor 2100 vacuum truck with high-pressure water jetter",
        "Submersible 4-inch trash pump",
        "Drain camera inspection snake",
        "Neoprene chest waders and bio-hazard gloves"
      ];
      safetyPrecautions = [
        "Cordon off curbside drainage inlet to prevent pedestrian stepping",
        "Test surrounding air for toxic sewer gas (H2S/Methane) prior to manhole entry",
        "Establish single-lane traffic diversion around service vehicles"
      ];
      eta = isUrgent ? "2 - 4 hours" : "6 - 10 hours";
      budgetEstimate = "$750 - $1,400";
    } else {
      rootCause = "Inadequate slope gradient and localized depression causing persistent ponding.";
      recommendedCrew = "Civil Drainage Maintenance Team";
      requiredEquipment = ["Heavy suction pump", "Silt barrier sandbags", "Grade leveling tools"];
      safetyPrecautions = ["Erect 'High Water Ahead' reflective warning triangles"];
      eta = "4 - 8 hours";
      budgetEstimate = "$400 - $800";
    }
  } else if (cat === "Damaged Roads") {
    if (desc.includes("crater") || desc.includes("deep") || desc.includes("manhole") || isUrgent) {
      rootCause = "Base course wash-out beneath wearing asphalt course following hydrostatic pressure.";
      recommendedCrew = "Emergency Roadway Hot-Mix & Structural Repair Crew";
      requiredEquipment = [
        "Hot asphalt dump trailer with heated tack distributor",
        "Plate compactor / 1.5-ton vibrating steel-drum roller",
        "Pneumatic pavement breaker",
        "Type II barricades with flashing beacons"
      ];
      safetyPrecautions = [
        "Immediate full or partial lane closure with police or flagger assistance",
        "Deploy luminescent directional arrows 100 meters prior to work zone",
        "Check adjacent underground utility markings before excavation"
      ];
      eta = isUrgent ? "3 - 6 hours" : "12 - 24 hours";
      budgetEstimate = "$1,200 - $2,500";
    } else {
      rootCause = "Surface asphalt degradation from repetitive heavy vehicular axle loading.";
      recommendedCrew = "Pavement Patch Squad";
      requiredEquipment = ["Cold-pour asphalt patcher", "Hand tampers", "Traffic cones"];
      safetyPrecautions = ["Flashing arrow board on maintenance truck"];
      eta = "1 - 2 business days";
      budgetEstimate = "$300 - $600";
    }
  } else if (cat === "Broken Streetlights") {
    if (desc.includes("spark") || desc.includes("wire") || desc.includes("hang") || isUrgent) {
      rootCause = "Physical damage to overhead secondary service drop or compromised base handhole insulation causing intermittent arc flash.";
      recommendedCrew = "Emergency High-Voltage Electrical Line Crew";
      requiredEquipment = [
        "Insulated telescopic bucket truck (tested to 46kV)",
        "Digital multimeter / insulation resistance megohmmeter",
        "Class 0/1 electrical rubber insulating gloves & arc flash face shield",
        "Replacement LED luminaire head & photocell module"
      ];
      safetyPrecautions = [
        "Establish 30-foot perimeter isolation zone; keep pedestrians and bystanders back",
        "Lock-Out / Tag-Out (LOTO) breaker at the upstream street lighting control panel",
        "Verify absence of voltage with an approved tick tracer before physical handling"
      ];
      eta = isUrgent ? "1 - 3 hours" : "8 - 12 hours";
      budgetEstimate = "$600 - $1,100";
    } else {
      rootCause = "Burned out ballast or failed photocontrol sensor on lighting fixture.";
      recommendedCrew = "Street Lighting Maintenance Crew";
      requiredEquipment = ["Aerial lift vehicle", "Replacement 120W LED fixtures", "Photocells"];
      safetyPrecautions = ["Standard lane shoulder taper cones"];
      eta = "24 - 48 hours";
      budgetEstimate = "$180 - $350";
    }
  } else if (cat === "Garbage Overflow") {
    rootCause = "Municipal waste bin capacity exceeded combined with irregular commercial collection cycles.";
    recommendedCrew = "Heavy Solid Waste & Environmental Sanitation Crew";
    requiredEquipment = [
      "Rear-loading hydraulic compactor garbage truck",
      "Street sweepers & motorized pressure washer",
      "Industrial disinfectant sprayers & heavy duty rake loaders",
      "Puncture-resistant Kevlar handling gloves"
    ];
    safetyPrecautions = [
      "Spray enzymatic odor neutralizer and rodent repellent on container perimeter",
      "Check for sharps/broken glass prior to manual handling",
      "Temporarily divert sidewalk pedestrian movement onto opposite walkway"
    ];
    eta = isUrgent ? "2 - 4 hours" : "8 - 12 hours";
    budgetEstimate = "$350 - $700";
  } else {
    rootCause = "Public utility distribution fault or scheduled maintenance overrun.";
    recommendedCrew = "Civic Infrastructure Response Unit";
    requiredEquipment = ["Mobile diagnostic scanner", "Utility bypass equipment", "Signage"];
    safetyPrecautions = ["Post community alert notices at affected civic transit stops"];
    eta = "4 - 8 hours";
    budgetEstimate = "$500 - $900";
  }

  return {
    rootCause,
    recommendedCrew,
    requiredEquipment,
    safetyPrecautions,
    estimatedResolutionTime: eta,
    budgetEstimate,
    generatedAt: new Date().toISOString(),
  };
}

export async function generateActionBriefWithGemini(
  report: CivicReport
): Promise<ActionBrief> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "placeholder_key") {
    return heuristicActionBrief(report);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are the Chief Operations Officer of a high-efficiency smart city public works department.
Convert this unstructured citizen complaint into a 1-minute executive action brief for departmental dispatchers.

Report Details:
- Title: "${report.title}"
- Category: "${report.category}"
- Description: "${report.description}"
- Priority: "${report.priority}" (Score: ${report.priorityScore}/100)
- Location: "${report.location.address}, ${report.location.street}"

Generate an authoritative operational brief formatted strictly as JSON:
{
  "rootCause": "Clear technical explanation of the underlying engineering/infrastructure failure (1-2 sentences)",
  "recommendedCrew": "Exact specialized departmental crew to dispatch (e.g. Stormwater High-Pressure Jetting Squad)",
  "requiredEquipment": ["Specific heavy tool 1", "Specific machinery 2", "Safety equipment 3"],
  "safetyPrecautions": ["Operational safety directive 1", "Safety directive 2"],
  "estimatedResolutionTime": "e.g. 2 - 4 hours",
  "budgetEstimate": "e.g. $650 - $1,200"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const textOutput = response.text || "";
    const cleaned = textOutput.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      rootCause: parsed.rootCause || "Subsurface infrastructure failure requiring technical inspection.",
      recommendedCrew: parsed.recommendedCrew || "Municipal Rapid Response Crew",
      requiredEquipment: Array.isArray(parsed.requiredEquipment) && parsed.requiredEquipment.length > 0
        ? parsed.requiredEquipment
        : ["Utility truck", "Safety barriers", "Tool kit"],
      safetyPrecautions: Array.isArray(parsed.safetyPrecautions) && parsed.safetyPrecautions.length > 0
        ? parsed.safetyPrecautions
        : ["Set up standard work-zone warning perimeter"],
      estimatedResolutionTime: parsed.estimatedResolutionTime || "12 - 24 hours",
      budgetEstimate: parsed.budgetEstimate || "$400 - $800",
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.warn("Gemini action brief generation failed, using heuristic synthesizer:", error);
    return heuristicActionBrief(report);
  }
}
