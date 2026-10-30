import { CivicReport } from "./types";

/**
 * 42 Pre-loaded realistic civic complaints for CivicPulse.
 * Features:
 * - 5 official categories
 * - Cohesive metropolitan geographic distribution (Metro Downtown Grid)
 * - Dense multi-failure cluster on Main Street (Waterlogging, Drain Clogging, Pavement Crater, Utility Conduit)
 * - Deliberate duplicate pairs with linked relationships and shared factors
 * - Urgent life-safety hazards with explainable prioritization
 * - Multi-stage status distribution: Submitted, In Review, Dispatched, Resolved
 */
export const initialMockReports: CivicReport[] = [
  // ==========================================
  // CLUSTER ON MAIN STREET (Cascading Hotspot)
  // ==========================================
  {
    id: "CP-2026-1001",
    title: "Waist-Deep Flash Waterlogging at Main & 4th Avenue",
    description: "After 45 minutes of heavy rain, the entire intersection of Main Street and 4th Avenue is submerged in over 2 feet of water. Two sedans are stalled with water reaching their doors. Pedestrian crossings are completely impassable.",
    category: "Waterlogging",
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: "Intersection of Main St & 4th Ave",
      street: "Main Street",
      landmark: "Opposite City Hall Annex",
      zone: "Downtown Central",
    },
    status: "Dispatched",
    priority: "Critical",
    priorityScore: 94,
    priorityReasons: [
      "Waist-deep water accumulation trapping vehicular transit",
      "Direct obstruction of primary arterial commuter corridor",
      "Risk of water ingress into ground-floor commercial basements"
    ],
    summary: "Severe flooding at Main St & 4th Ave with stranded vehicles and submerged pedestrian crosswalks.",
    assignedDepartment: "Stormwater & Drainage Division",
    assignedCrew: "Emergency Dewatering Unit 4",
    estimatedResolutionTime: "1 - 3 hours",
    actionBrief: {
      rootCause: "Subterranean stormwater trunk line occluded by silt wash-off and construction debris.",
      recommendedCrew: "Stormwater Rapid Jet-Vac & Dewatering Taskforce",
      requiredEquipment: [
        "Vactor 2100 high-pressure vacuum truck",
        "Dual 6-inch Godson diesel trash pumps",
        "Inflatable pipe plugs (36-inch)",
        "Water rescue neoprene drysuits"
      ],
      safetyPrecautions: [
        "Immediate four-way police barrier closure of intersection",
        "Emergency diversion of bus lines 12 & 14 via 2nd Ave",
        "Perimeter check for floating debris and open submerged manholes"
      ],
      estimatedResolutionTime: "2 - 3 hours",
      budgetEstimate: "$1,400 - $2,200",
      generatedAt: "2026-10-30T08:15:00Z"
    },
    timeline: [
      {
        id: "t1001-1",
        status: "Submitted",
        timestamp: "2026-10-30T07:45:00Z",
        actor: "Sarah Jenkins (Citizen)",
        role: "Citizen",
        note: "Reported stalled vehicles and rapid water rise."
      },
      {
        id: "t1001-2",
        status: "In Review",
        timestamp: "2026-10-30T07:48:00Z",
        actor: "CivicPulse AI Engine",
        role: "System",
        note: "Auto-prioritized to Critical (Score 94) based on trapped vehicle risk."
      },
      {
        id: "t1001-3",
        status: "Dispatched",
        timestamp: "2026-10-30T08:05:00Z",
        actor: "Chief Dispatcher Miller",
        role: "Dispatcher",
        note: "Emergency Dewatering Unit 4 deployed with high-capacity pumps."
      }
    ],
    citizenContact: { name: "Sarah Jenkins", email: "sarah.j@example.com", phone: "+1 (555) 234-5678" },
    upvotes: 38,
    createdAt: "2026-10-30T07:45:00Z",
    updatedAt: "2026-10-30T08:05:00Z"
  },
  {
    id: "CP-2026-1002",
    title: "Blocked Storm Grate Backing Up Black Sludge",
    description: "The storm drainage inlet directly outside 142 Main Street is choked with tree branches, plastic waste, and thick mud. Dark foul-smelling sewer water is geysering back onto the pedestrian sidewalk.",
    category: "Waterlogging",
    location: {
      lat: 40.7131,
      lng: -74.0057,
      address: "142 Main Street",
      street: "Main Street",
      landmark: "Near Central Metro Plaza",
      zone: "Downtown Central",
    },
    status: "Dispatched",
    priority: "High",
    priorityScore: 78,
    priorityReasons: [
      "Curbside catch basin obstruction accelerating street ponding",
      "Biological sewer effluent discharge onto public pedestrian walkway",
      "Direct contributor to Main Street cascading flood cluster"
    ],
    summary: "Clogged stormwater inlet geysering sewer water onto Main Street sidewalk.",
    assignedDepartment: "Stormwater & Drainage Division",
    assignedCrew: "Emergency Dewatering Unit 4",
    estimatedResolutionTime: "2 - 4 hours",
    timeline: [
      {
        id: "t1002-1",
        status: "Submitted",
        timestamp: "2026-10-30T08:02:00Z",
        actor: "Marcus Vance",
        role: "Citizen",
        note: "Submitted photo of clogged storm grate bubbling up."
      },
      {
        id: "t1002-2",
        status: "In Review",
        timestamp: "2026-10-30T08:05:00Z",
        actor: "CivicPulse AI Engine",
        role: "System",
        note: "Linked to Main Street Drainage Cluster (Severity 92)."
      },
      {
        id: "t1002-3",
        status: "Dispatched",
        timestamp: "2026-10-30T08:15:00Z",
        actor: "Chief Dispatcher Miller",
        role: "Dispatcher",
        note: "Assigned to Unit 4 currently operating on 4th Ave."
      }
    ],
    citizenContact: { name: "Marcus Vance", email: "m.vance@example.org" },
    upvotes: 19,
    createdAt: "2026-10-30T08:02:00Z",
    updatedAt: "2026-10-30T08:15:00Z"
  },
  {
    id: "CP-2026-1003",
    title: "Submerged Asphalt Crater / Massive Pothole at 180 Main St",
    description: "Underneath the standing water on Main Street, a massive pothole has collapsed, roughly 4 feet wide and 8 inches deep. Two motorists already blew out front tires because the crater is completely hidden under water.",
    category: "Damaged Roads",
    location: {
      lat: 40.7135,
      lng: -74.0052,
      address: "180 Main Street",
      street: "Main Street",
      landmark: "In front of Metro Bank",
      zone: "Downtown Central",
    },
    status: "In Review",
    priority: "Critical",
    priorityScore: 88,
    priorityReasons: [
      "Submerged invisible road crater actively destroying vehicle suspensions",
      "Immediate accident risk with sudden steering loss on high-speed corridor",
      "Asphalt sub-base destabilized by stormwater saturation"
    ],
    summary: "Dangerous hidden road collapse beneath standing water at 180 Main Street causing tire blowouts.",
    assignedDepartment: "Department of Transportation (Roads)",
    assignedCrew: "Emergency Hot-Patch Squad",
    estimatedResolutionTime: "4 - 6 hours",
    timeline: [
      {
        id: "t1003-1",
        status: "Submitted",
        timestamp: "2026-10-30T08:10:00Z",
        actor: "David Kim",
        role: "Citizen",
        note: "Blew out tire on submerged pothole; reported immediate hazard."
      },
      {
        id: "t1003-2",
        status: "In Review",
        timestamp: "2026-10-30T08:12:00Z",
        actor: "Supervisor Reynolds",
        role: "Field Supervisor",
        note: "Requesting DOT asphalt crew to coordinate with stormwater pump team."
      }
    ],
    upvotes: 27,
    createdAt: "2026-10-30T08:10:00Z",
    updatedAt: "2026-10-30T08:12:00Z"
  },

  // ==========================================
  // DELIBERATE DUPLICATE PAIR 1 (Food Court Waste)
  // ==========================================
  {
    id: "CP-2026-1004",
    title: "Severe Garbage Overflow behind Metro Food Court",
    description: "Four commercial 4-yard waste dumpsters are overflowing onto the alleyway behind Metro Food Court on 8th Street. Garbage bags have burst, with food scraps and rotting produce attracting dozens of rats and flies.",
    category: "Garbage Overflow",
    location: {
      lat: 40.7160,
      lng: -74.0010,
      address: "210 8th Street Alleyway",
      street: "8th Street",
      landmark: "Behind Metro Food Court",
      zone: "Commercial East",
    },
    status: "In Review",
    priority: "High",
    priorityScore: 72,
    priorityReasons: [
      "Active biohazard with rodent infestation near high-density food establishments",
      "Blocking fire egress corridor behind multi-tenant commercial center",
      "Decomposing organic matter generating severe environmental odor"
    ],
    summary: "Massive commercial waste overflow behind Metro Food Court causing rodent infestation.",
    assignedDepartment: "Solid Waste Management Bureau",
    assignedCrew: "Heavy Compactor Unit 7",
    estimatedResolutionTime: "6 - 12 hours",
    timeline: [
      {
        id: "t1004-1",
        status: "Submitted",
        timestamp: "2026-10-30T06:30:00Z",
        actor: "Elena Rostova",
        role: "Citizen",
        note: "Reported severe dumpster overflow and rodent activity."
      },
      {
        id: "t1004-2",
        status: "In Review",
        timestamp: "2026-10-30T07:00:00Z",
        actor: "Inspector Chen",
        role: "Inspector",
        note: "Commercial violation issued to food court management; clearing scheduled."
      }
    ],
    upvotes: 14,
    createdAt: "2026-10-30T06:30:00Z",
    updatedAt: "2026-10-30T07:00:00Z"
  },
  {
    id: "CP-2026-1005",
    title: "Food Court Bins Spilling Rotten Waste and Trash into Alley",
    description: "The alleyway behind the food court on 8th st is completely trashed. Garbage cans are overflowing everywhere with spoiled food, swarms of flies, and terrible smell. Walkway is blocked.",
    category: "Garbage Overflow",
    location: {
      lat: 40.7162,
      lng: -74.0012,
      address: "214 8th Street (Alley Rear)",
      street: "8th Street",
      landmark: "Metro Food Court Rear Entrance",
      zone: "Commercial East",
    },
    status: "In Review",
    priority: "High",
    priorityScore: 71,
    priorityReasons: [
      "Sanitation hazard with decaying food matter impeding alley access",
      "Identified as duplicate complaint of parent report CP-2026-1004"
    ],
    summary: "Duplicate report of commercial food waste overflow behind 8th St Food Court.",
    duplicateLink: {
      parentReportId: "CP-2026-1004",
      similarityScore: 0.89,
      sharedFactors: [
        "Virtually identical spot (28m away)",
        "Same street corridor: \"8th Street\"",
        "Exact category match: \"Garbage Overflow\"",
        "84% descriptive vocabulary overlap (food court, alley, rotten waste)"
      ],
      isConfirmed: true
    },
    timeline: [
      {
        id: "t1005-1",
        status: "Submitted",
        timestamp: "2026-10-30T07:15:00Z",
        actor: "Tom Gallagher",
        role: "Citizen",
        note: "Complained about smelly garbage in alley."
      },
      {
        id: "t1005-2",
        status: "In Review",
        timestamp: "2026-10-30T07:16:00Z",
        actor: "CivicPulse AI Duplicate Linker",
        role: "System",
        note: "Auto-linked as duplicate of CP-2026-1004 (Confidence 89%)."
      }
    ],
    upvotes: 8,
    createdAt: "2026-10-30T07:15:00Z",
    updatedAt: "2026-10-30T07:16:00Z"
  },

  // ==========================================
  // CRITICAL LIFE SAFETY HAZARD 1 (Live Wire near School)
  // ==========================================
  {
    id: "CP-2026-1011",
    title: "LIVE Sparking Power Line Hanging near Lincoln Elementary",
    description: "A heavy tree limb sheared an overhead power cable at Oak & Elm Street. The live 240V wire is swinging 4 feet above the sidewalk, violently sparking and sizzling in the drizzle directly where school children walk home.",
    category: "Broken Streetlights",
    location: {
      lat: 40.7188,
      lng: -74.0095,
      address: "Corner of Oak St & Elm St",
      street: "Oak Street",
      landmark: "Adjacent to Lincoln Elementary East Gate",
      zone: "North Residential",
    },
    status: "Dispatched",
    priority: "Critical",
    priorityScore: 99,
    priorityReasons: [
      "Immediate lethal electrocution hazard from dangling uninsulated 240V line",
      "Direct proximity to elementary school gate with high child foot traffic",
      "Active intermittent arc flash with fire ignition risk on asphalt"
    ],
    summary: "URGENT: Live sparking electrical line dangling 4ft above sidewalk near Lincoln Elementary school gate.",
    assignedDepartment: "Municipal Electrical & Lighting Dept",
    assignedCrew: "High-Voltage Emergency Grid Unit 1",
    estimatedResolutionTime: "Under 1 hour",
    actionBrief: {
      rootCause: "Storm wind mechanical shear on primary distribution drop conductor from adjacent overhanging oak tree.",
      recommendedCrew: "Emergency High-Voltage Lineman Unit & Fire Dept Standby",
      requiredEquipment: [
        "Insulated 46kV fiberglass hot-sticks",
        "Utility bucket truck with boom grounding",
        "Digital tick-tracer high-voltage detector",
        "Class 2 rubber insulating blankets and gloves"
      ],
      safetyPrecautions: [
        "Immediate 100-foot perimeter isolation; prevent student egress via East Gate",
        "Remote SCADA isolation or breaker pull at Oak St substation",
        "Post active sentry to keep public clear until circuit de-energization confirmed"
      ],
      estimatedResolutionTime: "45 minutes",
      budgetEstimate: "$850 - $1,500",
      generatedAt: "2026-10-30T07:35:00Z"
    },
    timeline: [
      {
        id: "t1011-1",
        status: "Submitted",
        timestamp: "2026-10-30T07:28:00Z",
        actor: "Principal Arthur Barnes",
        role: "Citizen",
        note: "Reported live wire spitting blue sparks right near school perimeter."
      },
      {
        id: "t1011-2",
        status: "In Review",
        timestamp: "2026-10-30T07:29:00Z",
        actor: "CivicPulse AI Emergency Gate",
        role: "System",
        note: "MAX PRIORITY (Score 99) triggered by keywords 'sparking live wire' + 'elementary school'."
      },
      {
        id: "t1011-3",
        status: "Dispatched",
        timestamp: "2026-10-30T07:32:00Z",
        actor: "City Operations Command",
        role: "Dispatcher",
        note: "Emergency Lineman Unit 1 dispatched with Code 3 sirens."
      }
    ],
    citizenContact: { name: "Principal Arthur Barnes", phone: "+1 (555) 987-6543" },
    upvotes: 62,
    createdAt: "2026-10-30T07:28:00Z",
    updatedAt: "2026-10-30T07:32:00Z"
  },

  // ==========================================
  // DELIBERATE DUPLICATE PAIR 2 (Duplicate of Wire)
  // ==========================================
  {
    id: "CP-2026-1012",
    title: "Downed Electrical Cable Sparking on Oak St near School",
    description: "There is an electric cable hanging from a wooden pole near the school crosswalk on Oak Street. Sparks are flying whenever the wind blows. Very dangerous for kids.",
    category: "Broken Streetlights",
    location: {
      lat: 40.7189,
      lng: -74.0094,
      address: "Oak St near Elm intersection",
      street: "Oak Street",
      landmark: "Opposite School Crosswalk",
      zone: "North Residential",
    },
    status: "Dispatched",
    priority: "Critical",
    priorityScore: 98,
    priorityReasons: [
      "Life-safety electrical hazard adjacent to school crossing",
      "Linked as verified duplicate of active emergency dispatch CP-2026-1011"
    ],
    summary: "Duplicate report of live electrical wire at Oak St school crosswalk.",
    duplicateLink: {
      parentReportId: "CP-2026-1011",
      similarityScore: 0.94,
      sharedFactors: [
        "Virtually identical spot (15m away)",
        "Same street corridor: \"Oak Street\"",
        "Exact category match: \"Broken Streetlights\"",
        "91% semantic text match (sparking electric cable, school, oak st)"
      ],
      isConfirmed: true
    },
    timeline: [
      {
        id: "t1012-1",
        status: "Submitted",
        timestamp: "2026-10-30T07:35:00Z",
        actor: "Parent Crossing Guard",
        role: "Citizen",
        note: "Crossing guard flagging down traffic."
      },
      {
        id: "t1012-2",
        status: "In Review",
        timestamp: "2026-10-30T07:36:00Z",
        actor: "CivicPulse AI Duplicate Linker",
        role: "System",
        note: "Linked to active dispatch CP-2026-1011. Crew already en route."
      }
    ],
    upvotes: 41,
    createdAt: "2026-10-30T07:35:00Z",
    updatedAt: "2026-10-30T07:36:00Z"
  },

  // ==========================================
  // MORE MAIN STREET HOTSPOT MEMBERS
  // ==========================================
  {
    id: "CP-2026-1006",
    title: "Flooded Electrical Junction Box at 210 Main St",
    description: "The sidewalk electrical pull-box for street lamps at 210 Main St is submerged under muddy water. Light buzzing sounds and steam coming from the metal cover.",
    category: "Broken Streetlights",
    location: {
      lat: 40.7138,
      lng: -74.0048,
      address: "210 Main Street",
      street: "Main Street",
      landmark: "Outside Metro Pharmacy",
      zone: "Downtown Central",
    },
    status: "In Review",
    priority: "Critical",
    priorityScore: 91,
    priorityReasons: [
      "Submerged high-voltage utility conduit in active pedestrian path",
      "Audible arcing / vapor emission indicating dielectric breakdown",
      "Direct compounding risk within Main Street waterlogging cluster"
    ],
    summary: "Submerged sidewalk electrical junction box buzzing and steaming at 210 Main St.",
    assignedDepartment: "Municipal Electrical & Lighting Dept",
    assignedCrew: "Electrical Rapid Squad 2",
    estimatedResolutionTime: "2 - 4 hours",
    timeline: [
      {
        id: "t1006-1",
        status: "Submitted",
        timestamp: "2026-10-30T08:20:00Z",
        actor: "Dr. Rachel Green",
        role: "Citizen",
        note: "Noticed steaming junction box while walking into pharmacy."
      },
      {
        id: "t1006-2",
        status: "In Review",
        timestamp: "2026-10-30T08:22:00Z",
        actor: "CivicPulse AI Engine",
        role: "System",
        note: "Correlated to Main Street Multidisciplinary Infrastructure Cluster."
      }
    ],
    upvotes: 22,
    createdAt: "2026-10-30T08:20:00Z",
    updatedAt: "2026-10-30T08:22:00Z"
  },
  {
    id: "CP-2026-1007",
    title: "Metro Bus 12 & 14 Transit Stalled on Main Street",
    description: "Two articulated municipal transit buses are stranded in rising water between 4th and 5th Avenue on Main Street. Over 60 passengers are waiting for safe evacuation assistance.",
    category: "Disrupted Services",
    location: {
      lat: 40.7130,
      lng: -74.0059,
      address: "Main St between 4th and 5th Ave",
      street: "Main Street",
      landmark: "Transit Stop #4102",
      zone: "Downtown Central",
    },
    status: "Dispatched",
    priority: "Critical",
    priorityScore: 93,
    priorityReasons: [
      "Mass passenger transit disruption with trapped riders in standing water",
      "Major arterial blockage preventing emergency vehicle transit",
      "Requires coordinated multi-agency transit and water rescue response"
    ],
    summary: "Articulated transit buses stranded on Main Street with passengers requiring evacuation.",
    assignedDepartment: "City Utilities & Transit Authority",
    assignedCrew: "Transit Operations Heavy Recovery",
    estimatedResolutionTime: "1 - 2 hours",
    timeline: [
      {
        id: "t1007-1",
        status: "Submitted",
        timestamp: "2026-10-30T08:14:00Z",
        actor: "Transit Driver #884",
        role: "Citizen",
        note: "Bus engine flooded out; passengers safe on board."
      },
      {
        id: "t1007-2",
        status: "In Review",
        timestamp: "2026-10-30T08:15:00Z",
        actor: "Emergency Operations Desk",
        role: "Dispatcher",
        note: "Coordinating with Transit Rescue."
      },
      {
        id: "t1007-3",
        status: "Dispatched",
        timestamp: "2026-10-30T08:25:00Z",
        actor: "Chief Dispatcher Miller",
        role: "Dispatcher",
        note: "Heavy wrecker and shuttle relief buses dispatched."
      }
    ],
    upvotes: 45,
    createdAt: "2026-10-30T08:14:00Z",
    updatedAt: "2026-10-30T08:25:00Z"
  },
  {
    id: "CP-2026-1008",
    title: "Storm Grate Completely Covered in Construction Debris",
    description: "Runoff gravel and plastic wrap from the high-rise renovation at 165 Main St have washed into the curb grate, causing 15 inches of water to back up onto storefronts.",
    category: "Waterlogging",
    location: {
      lat: 40.7133,
      lng: -74.0055,
      address: "165 Main Street",
      street: "Main Street",
      landmark: "Near Apex Construction Site",
      zone: "Downtown Central",
    },
    status: "In Review",
    priority: "High",
    priorityScore: 76,
    priorityReasons: [
      "Construction runoff clogging municipal stormwater inlet",
      "Water backing up directly into retail commercial entries",
      "Part of the Main Street infrastructure cascade"
    ],
    summary: "Construction debris choking storm drain and flooding commercial entrances on Main St.",
    assignedDepartment: "Stormwater & Drainage Division",
    assignedCrew: "Dewatering Unit 4",
    estimatedResolutionTime: "3 - 5 hours",
    timeline: [
      {
        id: "t1008-1",
        status: "Submitted",
        timestamp: "2026-10-30T08:22:00Z",
        actor: "Store Owner Patel",
        role: "Citizen",
        note: "Water about to enter retail store."
      }
    ],
    upvotes: 18,
    createdAt: "2026-10-30T08:22:00Z",
    updatedAt: "2026-10-30T08:22:00Z"
  },

  // ==========================================
  // URGENT CRITICAL HAZARD 2 (Open Manhole on Bike Lane)
  // ==========================================
  {
    id: "CP-2026-1015",
    title: "Open Missing Manhole Cover on 5th Avenue Bike Corridor",
    description: "The 30-inch heavy cast-iron sewer cover is completely missing on the protected 5th Avenue cycleway. There is a sheer 12-foot drop directly into an active sewer conduit. Zero barricades or markings.",
    category: "Damaged Roads",
    location: {
      lat: 40.7145,
      lng: -74.0035,
      address: "310 5th Avenue",
      street: "5th Avenue",
      landmark: "Near City Bike Station #14",
      zone: "Downtown Core",
    },
    status: "Dispatched",
    priority: "Critical",
    priorityScore: 97,
    priorityReasons: [
      "Lethal 12-foot open vertical shaft in designated high-speed bicycle lane",
      "High probability of fatal head/spinal trauma for cyclists",
      "Immediate municipal liability requiring emergency physical barrier"
    ],
    summary: "LETHAL HAZARD: Uncovered 30-inch manhole shaft in active 5th Avenue bicycle lane.",
    assignedDepartment: "Department of Transportation (Roads)",
    assignedCrew: "Rapid Barrier & Ironwork Squad",
    estimatedResolutionTime: "Under 2 hours",
    actionBrief: {
      rootCause: "Heavy delivery truck wheel impact popped cast-iron frame, followed by unauthorized removal or dislocation.",
      recommendedCrew: "Emergency Highway Safety Barricade Unit & Sewer Iron Crew",
      requiredEquipment: [
        "Heavy-duty cast iron 30-inch Type-C replacement ring and cover",
        "Type III reflective safety barricades with solar strobe beacons",
        "Epoxy rapid-set mortar for frame seating",
        "Manhole safety retrieval tripod and gas monitor"
      ],
      safetyPrecautions: [
        "Immediate closure of bike lane 50 yards prior to drop",
        "Place orange cones and safety mesh netting over opening immediately",
        "Atmospheric testing of shaft before positioning replacement cover"
      ],
      estimatedResolutionTime: "1 hour 30 mins",
      budgetEstimate: "$500 - $950",
      generatedAt: "2026-10-30T08:00:00Z"
    },
    timeline: [
      {
        id: "t1015-1",
        status: "Submitted",
        timestamp: "2026-10-30T07:50:00Z",
        actor: "Cyclist Julian Scott",
        role: "Citizen",
        note: "Almost fell into the 12-foot pit on my morning commute!"
      },
      {
        id: "t1015-2",
        status: "In Review",
        timestamp: "2026-10-30T07:51:00Z",
        actor: "CivicPulse AI Engine",
        role: "System",
        note: "Classified Critical (Score 97) - Fall to Death / High-Speed Lane."
      },
      {
        id: "t1015-3",
        status: "Dispatched",
        timestamp: "2026-10-30T07:55:00Z",
        actor: "Chief Dispatcher Miller",
        role: "Dispatcher",
        note: "Ironwork Squad dispatched with replacement lid and barricades."
      }
    ],
    upvotes: 56,
    createdAt: "2026-10-30T07:50:00Z",
    updatedAt: "2026-10-30T07:55:00Z"
  },

  // ==========================================
  // DELIBERATE DUPLICATE PAIR 3 (Grand Ave Pothole)
  // ==========================================
  {
    id: "CP-2026-1022",
    title: "Deep Axle-Breaking Pothole on Grand Avenue Right Lane",
    description: "Extremely deep jagged pothole in the right lane of Grand Avenue approaching the highway on-ramp. Reaches down to the underlying concrete rebar, about 10 inches deep.",
    category: "Damaged Roads",
    location: {
      lat: 40.7210,
      lng: -74.0040,
      address: "540 Grand Avenue",
      street: "Grand Avenue",
      landmark: "Approaching Route 9 On-Ramp",
      zone: "West Arterial",
    },
    status: "In Review",
    priority: "High",
    priorityScore: 79,
    priorityReasons: [
      "Deep asphalt crater causing severe vehicle wheel damage",
      "Situated on high-speed expressway acceleration corridor",
      "Exposed sub-surface steel reinforcement mesh"
    ],
    summary: "10-inch deep asphalt crater on Grand Avenue highway approach damaging vehicles.",
    assignedDepartment: "Department of Transportation (Roads)",
    assignedCrew: "Asphalt Patch Unit 3",
    estimatedResolutionTime: "8 - 12 hours",
    timeline: [
      {
        id: "t1022-1",
        status: "Submitted",
        timestamp: "2026-10-30T06:15:00Z",
        actor: "Carlos Mendez",
        role: "Citizen",
        note: "Cracked wheel rim on this pothole this morning."
      }
    ],
    upvotes: 24,
    createdAt: "2026-10-30T06:15:00Z",
    updatedAt: "2026-10-30T06:15:00Z"
  },
  {
    id: "CP-2026-1023",
    title: "Huge Hole in Asphalt on Grand Ave Cracked My Wheel",
    description: "There is a giant hole in the asphalt on Grand Avenue right by the highway ramp. My tire blew out and rim cracked. Someone is going to lose control.",
    category: "Damaged Roads",
    location: {
      lat: 40.7212,
      lng: -74.0041,
      address: "548 Grand Avenue",
      street: "Grand Avenue",
      landmark: "Before Route 9 On-Ramp",
      zone: "West Arterial",
    },
    status: "In Review",
    priority: "High",
    priorityScore: 78,
    priorityReasons: [
      "High-speed roadway defect with tire blow-out history",
      "Identified as duplicate of active report CP-2026-1022"
    ],
    summary: "Duplicate report of deep crater on Grand Avenue near highway ramp.",
    duplicateLink: {
      parentReportId: "CP-2026-1022",
      similarityScore: 0.91,
      sharedFactors: [
        "Virtually identical spot (24m away)",
        "Same street corridor: \"Grand Avenue\"",
        "Exact category match: \"Damaged Roads\"",
        "86% textual similarity (grand ave, hole in asphalt, cracked rim)"
      ],
      isConfirmed: true
    },
    timeline: [
      {
        id: "t1023-1",
        status: "Submitted",
        timestamp: "2026-10-30T06:45:00Z",
        actor: "Devon Reed",
        role: "Citizen",
        note: "Another car hit the same crater."
      },
      {
        id: "t1023-2",
        status: "In Review",
        timestamp: "2026-10-30T06:46:00Z",
        actor: "CivicPulse AI Duplicate Linker",
        role: "System",
        note: "Linked as duplicate of CP-2026-1022."
      }
    ],
    upvotes: 19,
    createdAt: "2026-10-30T06:45:00Z",
    updatedAt: "2026-10-30T06:46:00Z"
  },

  // ==========================================
  // RESOLVED CIVIC REPORTS (For Lifecycle Showcase)
  // ==========================================
  {
    id: "CP-2026-1030",
    title: "Broken Streetlight Plunging Park Walkway into Darkness",
    description: "Two twin sodium street lamps along Riverside Memorial Park promenade have been non-functional for three nights, creating a pitch-black blind spot for evening joggers.",
    category: "Broken Streetlights",
    location: {
      lat: 40.7090,
      lng: -74.0120,
      address: "Riverside Promenade & Pier 3",
      street: "Riverside Drive",
      landmark: "Riverside Memorial Park",
      zone: "Waterfront District",
    },
    status: "Resolved",
    priority: "Medium",
    priorityScore: 52,
    priorityReasons: [
      "Public park illumination deficiency along pedestrian corridor",
      "Elevated evening slip and personal security vulnerability"
    ],
    summary: "Non-functional promenade lighting at Riverside Memorial Park restored with LED retrofit.",
    assignedDepartment: "Municipal Electrical & Lighting Dept",
    assignedCrew: "Bucket Truck Line Crew 3",
    estimatedResolutionTime: "Resolved in 18 hours",
    timeline: [
      {
        id: "t1030-1",
        status: "Submitted",
        timestamp: "2026-10-29T19:00:00Z",
        actor: "Joggers Association",
        role: "Citizen",
        note: "Complained about dark walkway."
      },
      {
        id: "t1030-2",
        status: "In Review",
        timestamp: "2026-10-29T20:15:00Z",
        actor: "Lighting Supervisor",
        role: "Dispatcher",
        note: "Assigned for morning bulb and photocell replacement."
      },
      {
        id: "t1030-3",
        status: "Dispatched",
        timestamp: "2026-10-30T06:30:00Z",
        actor: "Crew Lead Hansen",
        role: "Field Supervisor",
        note: "Bucket truck on site; replacing faulty ballast."
      },
      {
        id: "t1030-4",
        status: "Resolved",
        timestamp: "2026-10-30T08:10:00Z",
        actor: "Crew Lead Hansen",
        role: "Field Supervisor",
        note: "Replaced photocell and installed 150W energy-efficient LED luminaire head. Tested and operational."
      }
    ],
    upvotes: 31,
    createdAt: "2026-10-29T19:00:00Z",
    updatedAt: "2026-10-30T08:10:00Z"
  },
  {
    id: "CP-2026-1031",
    title: "Overflowing Park Bins after Sunday Food Festival",
    description: "Ten green trash barrels at Lincoln Park are stuffed past capacity with paper food boats, soda cans, and cardboard.",
    category: "Garbage Overflow",
    location: {
      lat: 40.7175,
      lng: -74.0080,
      address: "Lincoln Park Central Meadow",
      street: "Park Boulevard",
      landmark: "Central Bandstand",
      zone: "Parks & Recreation",
    },
    status: "Resolved",
    priority: "Low",
    priorityScore: 38,
    priorityReasons: [
      "Standard post-event public refuse accumulation",
      "Contained within dedicated park recreation boundary"
    ],
    summary: "Post-event refuse at Lincoln Park bandstand cleared and sanitized.",
    assignedDepartment: "Solid Waste Management Bureau",
    assignedCrew: "Parks Sanitation Squad B",
    estimatedResolutionTime: "Resolved in 4 hours",
    timeline: [
      {
        id: "t1031-1",
        status: "Submitted",
        timestamp: "2026-10-29T21:30:00Z",
        actor: "Park Visitor Kevin",
        role: "Citizen",
        note: "Trash bins full after festival."
      },
      {
        id: "t1031-2",
        status: "Resolved",
        timestamp: "2026-10-30T07:00:00Z",
        actor: "Supervisor Martinez",
        role: "Dispatcher",
        note: "Special festival cleanup run cleared all 10 bins and washed surrounding asphalt."
      }
    ],
    upvotes: 11,
    createdAt: "2026-10-29T21:30:00Z",
    updatedAt: "2026-10-30T07:00:00Z"
  },

  // ==========================================
  // EXTENSIVE CIVIC REPORTS ACROSS ALL CATEGORIES
  // ==========================================
  {
    id: "CP-2026-1032",
    title: "Burst Water Main Flooding Pine Street Basements",
    description: "A 12-inch potable water distribution pipe ruptured under Pine Street. Pressurized water is buckling the sidewalk flags and flooding three residential apartment basements.",
    category: "Disrupted Services",
    location: {
      lat: 40.7115,
      lng: -74.0075,
      address: "78 Pine Street",
      street: "Pine Street",
      landmark: "Between Broadway & Nassau",
      zone: "Financial South",
    },
    status: "Dispatched",
    priority: "Critical",
    priorityScore: 95,
    priorityReasons: [
      "High-pressure water main rupture causing severe private property structural flooding",
      "Sidewalk and roadway undermining with sinkhole formation risk",
      "Immediate loss of clean drinking water to over 200 residential units"
    ],
    summary: "12-inch water main rupture flooding Pine Street and threatening building foundations.",
    assignedDepartment: "City Utilities & Transit Authority",
    assignedCrew: "Water Distribution Emergency Crew 1",
    estimatedResolutionTime: "2 - 4 hours",
    timeline: [
      {
        id: "t1032-1",
        status: "Submitted",
        timestamp: "2026-10-30T08:00:00Z",
        actor: "Building Supt. Frank",
        role: "Citizen",
        note: "Water rising 3 feet in boiler room!"
      },
      {
        id: "t1032-2",
        status: "Dispatched",
        timestamp: "2026-10-30T08:08:00Z",
        actor: "Water Operations",
        role: "Dispatcher",
        note: "Emergency valve turn-off crew en route to isolate Pine St main."
      }
    ],
    upvotes: 49,
    createdAt: "2026-10-30T08:00:00Z",
    updatedAt: "2026-10-30T08:08:00Z"
  },
  {
    id: "CP-2026-1033",
    title: "Collapsed Guardrail on Ravine Footbridge",
    description: "A 15-foot section of metal pedestrian safety railing rusted through and collapsed over the rocky ravine on Highland Trail. A sudden slip could result in a 30-foot drop onto rocks.",
    category: "Damaged Roads",
    location: {
      lat: 40.7250,
      lng: -74.0020,
      address: "Highland Footbridge Trail Marker 4",
      street: "Highland Way",
      landmark: "Highland Ravine Park",
      zone: "North Heights",
    },
    status: "Submitted",
    priority: "Critical",
    priorityScore: 89,
    priorityReasons: [
      "Severe 30-foot vertical fall hazard along unlit pedestrian footbridge",
      "Missing structural guardrail in popular trail and dog-walking path",
      "Requires immediate temporary barrier and bridge steel fabrication"
    ],
    summary: "Dangerous collapsed guardrail with 30ft ravine drop on Highland Trail footbridge.",
    timeline: [
      {
        id: "t1033-1",
        status: "Submitted",
        timestamp: "2026-10-30T08:30:00Z",
        actor: "Trail Volunteer Maya",
        role: "Citizen",
        note: "Discovered collapsed railing this morning; hazardous."
      }
    ],
    upvotes: 17,
    createdAt: "2026-10-30T08:30:00Z",
    updatedAt: "2026-10-30T08:30:00Z"
  },
  {
    id: "CP-2026-1034",
    title: "Streetlight Pole Leaning at Dangerous 45-Degree Angle",
    description: "A delivery box truck sideswiped an aluminum streetlight mast at Elm & 2nd St. The pole is bent at 45 degrees over the moving traffic lane, held up only by its tension wires.",
    category: "Broken Streetlights",
    location: {
      lat: 40.7155,
      lng: -74.0085,
      address: "Elm St & 2nd Street",
      street: "Elm Street",
      landmark: "Corner Convenience Store",
      zone: "Midtown West",
    },
    status: "Dispatched",
    priority: "Critical",
    priorityScore: 92,
    priorityReasons: [
      "Structural pole collapse imminent over active vehicular traffic lanes",
      "Potential catastrophic crush injury to passenger vehicles or cyclists",
      "Tension on live electrical supply cable creating secondary fire risk"
    ],
    summary: "Bent streetlight mast dangling at 45 degrees over moving traffic lane at Elm & 2nd St.",
    assignedDepartment: "Municipal Electrical & Lighting Dept",
    assignedCrew: "Heavy Crane & Pole Recovery Unit",
    estimatedResolutionTime: "1 - 2 hours",
    timeline: [
      {
        id: "t1034-1",
        status: "Submitted",
        timestamp: "2026-10-30T07:40:00Z",
        actor: "Traffic Officer Ruiz",
        role: "Citizen",
        note: "Holding traffic; pole is ready to fall."
      },
      {
        id: "t1034-2",
        status: "Dispatched",
        timestamp: "2026-10-30T07:44:00Z",
        actor: "Chief Dispatcher Miller",
        role: "Dispatcher",
        note: "Crane truck and boom dispatched for emergency de-rigging."
      }
    ],
    upvotes: 35,
    createdAt: "2026-10-30T07:40:00Z",
    updatedAt: "2026-10-30T07:44:00Z"
  },
  {
    id: "CP-2026-1035",
    title: "Illegal Dumping of Toxic Paint Thinners and Solvents",
    description: "Someone dumped eight 5-gallon unlabeled chemical drums in the vacant lot off Cedar Lane. Two cans are leaking pungent chemical liquid towards the municipal storm runoff ditch.",
    category: "Garbage Overflow",
    location: {
      lat: 40.7225,
      lng: -74.0150,
      address: "410 Cedar Lane",
      street: "Cedar Lane",
      landmark: "Adjacent to Industrial Railroad Spur",
      zone: "Industrial West",
    },
    status: "In Review",
    priority: "Critical",
    priorityScore: 86,
    priorityReasons: [
      "Hazardous chemical solvent spill threatening municipal stormwater water table",
      "Volatile solvent fumes posing combustion and respiratory danger",
      "Requires certified HazMat containment response"
    ],
    summary: "Leaking illegal chemical drums off Cedar Lane threatening stormwater ditch.",
    assignedDepartment: "Solid Waste Management Bureau",
    assignedCrew: "HazMat Environmental Response Team",
    estimatedResolutionTime: "3 - 5 hours",
    timeline: [
      {
        id: "t1035-1",
        status: "Submitted",
        timestamp: "2026-10-30T08:05:00Z",
        actor: "Yard Manager Scott",
        role: "Citizen",
        note: "Discovered toxic drums smelling strongly of solvent."
      }
    ],
    upvotes: 28,
    createdAt: "2026-10-30T08:05:00Z",
    updatedAt: "2026-10-30T08:05:00Z"
  },
  {
    id: "CP-2026-1036",
    title: "Traffic Signal Failure All Flashers Red at Broadway & 7th",
    description: "The primary 4-way traffic signal computer went into fault mode at Broadway & 7th Avenue. All lights are flashing red, causing massive 2-mile gridlock in both directions.",
    category: "Disrupted Services",
    location: {
      lat: 40.7170,
      lng: -74.0030,
      address: "Broadway & 7th Avenue",
      street: "Broadway",
      landmark: "Broadway Theater District",
      zone: "Downtown Central",
    },
    status: "Dispatched",
    priority: "High",
    priorityScore: 79,
    priorityReasons: [
      "Major multi-direction arterial intersection signal processor failure",
      "Causing 2-mile gridlock and near-miss collisions during rush hour",
      "Immediate traffic control technician required on site"
    ],
    summary: "Critical signal failure at Broadway & 7th Ave causing 2-mile traffic gridlock.",
    assignedDepartment: "City Utilities & Transit Authority",
    assignedCrew: "Traffic Signal Electronics Team 2",
    estimatedResolutionTime: "1 - 2 hours",
    timeline: [
      {
        id: "t1036-1",
        status: "Submitted",
        timestamp: "2026-10-30T08:12:00Z",
        actor: "Commuter Greg",
        role: "Citizen",
        note: "Total chaos at Broadway & 7th."
      },
      {
        id: "t1036-2",
        status: "Dispatched",
        timestamp: "2026-10-30T08:18:00Z",
        actor: "Traffic Operations",
        role: "Dispatcher",
        note: "Electronics tech dispatched to reboot microprocessor cabinet."
      }
    ],
    upvotes: 39,
    createdAt: "2026-10-30T08:12:00Z",
    updatedAt: "2026-10-30T08:18:00Z"
  },
  {
    id: "CP-2026-1037",
    title: "Damaged Sidewalk Heaving Caused by Oak Tree Roots",
    description: "Tree roots have lifted the sidewalk slabs by over 5 inches outside 85 Maple Street. An elderly pedestrian tripped and scraped both knees yesterday.",
    category: "Damaged Roads",
    location: {
      lat: 40.7195,
      lng: -74.0110,
      address: "85 Maple Street",
      street: "Maple Street",
      landmark: "Maple Residential Block",
      zone: "North Residential",
    },
    status: "In Review",
    priority: "Medium",
    priorityScore: 54,
    priorityReasons: [
      "5-inch vertical trip hazard on neighborhood walkway",
      "Documented pedestrian fall history involving elderly resident",
      "Root shave and concrete flag re-leveling required"
    ],
    summary: "5-inch sidewalk root heave outside 85 Maple Street creating severe trip hazard.",
    assignedDepartment: "Department of Transportation (Roads)",
    assignedCrew: "Sidewalk Repair Gang 4",
    estimatedResolutionTime: "24 - 48 hours",
    timeline: [
      {
        id: "t1037-1",
        status: "Submitted",
        timestamp: "2026-10-30T07:10:00Z",
        actor: "Mrs. Evelyn Carter",
        role: "Citizen",
        note: "Tripped on uneven sidewalk flag."
      }
    ],
    upvotes: 16,
    createdAt: "2026-10-30T07:10:00Z",
    updatedAt: "2026-10-30T07:10:00Z"
  },
  {
    id: "CP-2026-1038",
    title: "Underpass Waterlogging Trapping Delivery Vans on Canal St",
    description: "The rail underpass on Canal Street has 18 inches of accumulated rainwater. The automatic sump pump appears to have tripped its circuit breaker.",
    category: "Waterlogging",
    location: {
      lat: 40.7100,
      lng: -74.0090,
      address: "Canal Street Underpass",
      street: "Canal Street",
      landmark: "Railroad Bridge Underpass",
      zone: "Industrial South",
    },
    status: "Submitted",
    priority: "High",
    priorityScore: 77,
    priorityReasons: [
      "Low clearance underpass flooding cutting off commercial freight link",
      "Automated sump station failure requiring mechanical technician reset",
      "Standing water depth hazardous to smaller passenger vehicles"
    ],
    summary: "Canal Street railroad underpass flooded due to pump failure, blocking commercial delivery route.",
    timeline: [
      {
        id: "t1038-1",
        status: "Submitted",
        timestamp: "2026-10-30T08:24:00Z",
        actor: "Delivery Driver Mike",
        role: "Citizen",
        note: "Water is half-wheel high under the bridge."
      }
    ],
    upvotes: 21,
    createdAt: "2026-10-30T08:24:00Z",
    updatedAt: "2026-10-30T08:24:00Z"
  },
  {
    id: "CP-2026-1039",
    title: "Streetlight Strobing Rapidly at Night on Willow Way",
    description: "The sodium street lamp outside 12 Willow Way is strobing violently like a strobe light between 7 PM and 6 AM, disturbing sleep for several families with infants.",
    category: "Broken Streetlights",
    location: {
      lat: 40.7240,
      lng: -74.0065,
      address: "12 Willow Way",
      street: "Willow Way",
      landmark: "Willow Cul-de-sac",
      zone: "North Residential",
    },
    status: "Submitted",
    priority: "Low",
    priorityScore: 34,
    priorityReasons: [
      "Photocontrol flickering causing residential nuisance",
      "No structural or high-voltage safety hazard present"
    ],
    summary: "Defective streetlight photocell causing rapid night strobing on Willow Way.",
    assignedDepartment: "Municipal Electrical & Lighting Dept",
    assignedCrew: "Standard Line Maintenance",
    estimatedResolutionTime: "48 - 72 hours",
    timeline: [
      {
        id: "t1039-1",
        status: "Submitted",
        timestamp: "2026-10-30T06:50:00Z",
        actor: "Resident Laura",
        role: "Citizen",
        note: "Light flashes non-stop all night into bedroom window."
      }
    ],
    upvotes: 6,
    createdAt: "2026-10-30T06:50:00Z",
    updatedAt: "2026-10-30T06:50:00Z"
  },
  {
    id: "CP-2026-1040",
    title: "Recycling Bins Blown Over Spreading Cardboard on Park Ave",
    description: "High winds knocked over 6 commercial blue recycling bins along Park Avenue, scattering paper packaging and cardboard boxes across two lanes of traffic.",
    category: "Garbage Overflow",
    location: {
      lat: 40.7180,
      lng: -74.0045,
      address: "620 Park Avenue",
      street: "Park Avenue",
      landmark: "Corporate Plaza",
      zone: "Midtown Core",
    },
    status: "In Review",
    priority: "Medium",
    priorityScore: 48,
    priorityReasons: [
      "Windblown cardboard debris blowing into traffic lanes",
      "Minor obstruction of curbside bus pull-in lane"
    ],
    summary: "Wind-scattered recyclable debris across Park Avenue roadway.",
    assignedDepartment: "Solid Waste Management Bureau",
    assignedCrew: "Street Sweeper Unit 5",
    estimatedResolutionTime: "4 - 8 hours",
    timeline: [
      {
        id: "t1040-1",
        status: "Submitted",
        timestamp: "2026-10-30T07:55:00Z",
        actor: "Security Officer James",
        role: "Citizen",
        note: "Boxes blowing down the street."
      }
    ],
    upvotes: 9,
    createdAt: "2026-10-30T07:55:00Z",
    updatedAt: "2026-10-30T07:55:00Z"
  },
  {
    id: "CP-2026-1041",
    title: "Public Drinking Fountain Leaking Continuously onto Walkway",
    description: "The drinking fountain in Washington Square Park has a stuck internal valve and is spewing water 24/7 across the pedestrian brick path, creating slick algae.",
    category: "Disrupted Services",
    location: {
      lat: 40.7140,
      lng: -74.0070,
      address: "Washington Square Park South Gate",
      street: "Washington Street",
      landmark: "Near Dog Run",
      zone: "Historic District",
    },
    status: "In Review",
    priority: "Medium",
    priorityScore: 46,
    priorityReasons: [
      "Continuous potable water wastage (estimated 15 gallons/hour)",
      "Slick green algae forming on pedestrian brick paver walkway"
    ],
    summary: "Stuck valve on Washington Square Park drinking fountain leaking continuously.",
    assignedDepartment: "City Utilities & Transit Authority",
    assignedCrew: "Plumbing Maintenance Unit",
    estimatedResolutionTime: "12 - 24 hours",
    timeline: [
      {
        id: "t1041-1",
        status: "Submitted",
        timestamp: "2026-10-30T07:20:00Z",
        actor: "Dog Walker Sam",
        role: "Citizen",
        note: "Fountain won't shut off, puddle is getting slimy."
      }
    ],
    upvotes: 13,
    createdAt: "2026-10-30T07:20:00Z",
    updatedAt: "2026-10-30T07:20:00Z"
  },
  {
    id: "CP-2026-1042",
    title: "Sinkhole Forming in Alleyway Behind Bakery on Spring St",
    description: "A 3-foot circular depression has opened up in the cobblestone alley behind Spring St Bakery. Looking down with a flashlight, you can see a hollow cavity under the road.",
    category: "Damaged Roads",
    location: {
      lat: 40.7165,
      lng: -74.0060,
      address: "45 Spring Street Alley",
      street: "Spring Street",
      landmark: "Behind Golden Crust Bakery",
      zone: "Downtown Central",
    },
    status: "Dispatched",
    priority: "Critical",
    priorityScore: 89,
    priorityReasons: [
      "Active subsurface cavity (sinkhole) with immediate roadway collapse hazard",
      "Threat to delivery vehicle axle loads and adjacent historic brick wall",
      "Immediate physical barrier and geotechnical inspection required"
    ],
    summary: "Underground sinkhole cavity opening under cobblestones on Spring St alley.",
    assignedDepartment: "Department of Transportation (Roads)",
    assignedCrew: "Geotechnical & Heavy Repair Unit",
    estimatedResolutionTime: "4 - 8 hours",
    timeline: [
      {
        id: "t1042-1",
        status: "Submitted",
        timestamp: "2026-10-30T08:00:00Z",
        actor: "Baker Antonio",
        role: "Citizen",
        note: "Delivery truck almost broke through the hollow cobblestones!"
      },
      {
        id: "t1042-2",
        status: "Dispatched",
        timestamp: "2026-10-30T08:15:00Z",
        actor: "Chief Dispatcher Miller",
        role: "Dispatcher",
        note: "Geotechnical squad dispatched with steel trench plates."
      }
    ],
    upvotes: 33,
    createdAt: "2026-10-30T08:00:00Z",
    updatedAt: "2026-10-30T08:15:00Z"
  }
];

// Helper to generate the remaining realistic entries up to 42 reports
const additionalSyntheticReports: CivicReport[] = [
  {
    id: "CP-2026-1043",
    title: "Standing Water Trapped by Blocked Curb Basin on 3rd Ave",
    description: "Curbside puddle over 8 inches deep extends 30 feet along 3rd Avenue outside the public library. Bus riders getting soaked by passing traffic.",
    category: "Waterlogging",
    location: { lat: 40.7135, lng: -74.0072, address: "220 3rd Avenue", street: "3rd Avenue", zone: "Downtown Central" },
    status: "Submitted",
    priority: "Medium",
    priorityScore: 56,
    priorityReasons: ["Persistent water pool splashing pedestrians at transit stop"],
    summary: "Curbside ponding at 3rd Ave library splashing commuters.",
    timeline: [{ id: "t1043-1", status: "Submitted", timestamp: "2026-10-30T07:12:00Z", actor: "Librarian Alice", role: "Citizen", note: "Pedestrians drenched by taxis." }],
    upvotes: 12,
    createdAt: "2026-10-30T07:12:00Z",
    updatedAt: "2026-10-30T07:12:00Z"
  },
  {
    id: "CP-2026-1044",
    title: "Broken Streetlight at Pedestrian Crosswalk on Hudson St",
    description: "The LED street fixture at the Hudson St crosswalk is unlit. Crosswalk is nearly invisible to turning vehicles at dusk.",
    category: "Broken Streetlights",
    location: { lat: 40.7190, lng: -74.0130, address: "340 Hudson Street", street: "Hudson Street", zone: "West Corridor" },
    status: "In Review",
    priority: "High",
    priorityScore: 68,
    priorityReasons: ["Unlit crosswalk on high-speed multi-lane transit boulevard", "High pedestrian collision vulnerability during evening hours"],
    summary: "Unlit crosswalk streetlight on Hudson St increasing collision danger.",
    assignedDepartment: "Municipal Electrical & Lighting Dept",
    assignedCrew: "Bucket Truck Line Crew 2",
    timeline: [{ id: "t1044-1", status: "Submitted", timestamp: "2026-10-30T06:40:00Z", actor: "Local Resident Ben", role: "Citizen", note: "Dangerous crossing at night." }],
    upvotes: 21,
    createdAt: "2026-10-30T06:40:00Z",
    updatedAt: "2026-10-30T06:40:00Z"
  },
  {
    id: "CP-2026-1045",
    title: "Commercial Grease Spill in Restaurant Alleyway",
    description: "A grease collection drum was overturned in the alley off Mercer St, coating 50 feet of walkway in slippery cooking oil.",
    category: "Garbage Overflow",
    location: { lat: 40.7152, lng: -74.0042, address: "75 Mercer Street Alley", street: "Mercer Street", zone: "Downtown Core" },
    status: "Dispatched",
    priority: "High",
    priorityScore: 71,
    priorityReasons: ["Severe slip and fall liability across public right-of-way", "Petroleum/oil runoff into sewer catch basin"],
    summary: "Commercial oil spill in Mercer St alleyway posing severe slip hazard.",
    assignedDepartment: "Solid Waste Management Bureau",
    assignedCrew: "Sanitation Degreasing Unit",
    timeline: [{ id: "t1045-1", status: "Submitted", timestamp: "2026-10-30T07:25:00Z", actor: "Store Clerk Ryan", role: "Citizen", note: "Extremely slippery grease spill." }],
    upvotes: 15,
    createdAt: "2026-10-30T07:25:00Z",
    updatedAt: "2026-10-30T07:25:00Z"
  },
  {
    id: "CP-2026-1046",
    title: "Cracked Concrete Bridge Expansion Joint on Expressway",
    description: "The steel teeth and rubber seal of the expansion joint on Sector 4 overpass have split, creating a 4-inch gap across lanes 1 and 2.",
    category: "Damaged Roads",
    location: { lat: 40.7260, lng: -74.0070, address: "Metro Expressway Mile Marker 2.4", street: "Metro Expressway", zone: "Expressway North" },
    status: "Dispatched",
    priority: "Critical",
    priorityScore: 91,
    priorityReasons: ["Structural expansion joint failure on 55mph expressway", "High risk of vehicle tire puncture and mechanical instability"],
    summary: "Damaged bridge expansion joint splitting across expressway lanes.",
    assignedDepartment: "Department of Transportation (Roads)",
    assignedCrew: "Bridge Structural Engineering Squad",
    timeline: [{ id: "t1046-1", status: "Submitted", timestamp: "2026-10-30T07:58:00Z", actor: "Highway Patrol Sgt. Ward", role: "Citizen", note: "Bridge joint split; tire damage reports." }],
    upvotes: 38,
    createdAt: "2026-10-30T07:58:00Z",
    updatedAt: "2026-10-30T07:58:00Z"
  },
  {
    id: "CP-2026-1047",
    title: "Broken Streetlight in Senior Living Courtyard Access",
    description: "Pathway light completely out on the walkway leading to St. Jude Senior Living Center. Elderly residents unable to navigate steps after dark.",
    category: "Broken Streetlights",
    location: { lat: 40.7205, lng: -74.0102, address: "190 Maple Street", street: "Maple Street", zone: "North Residential" },
    status: "In Review",
    priority: "High",
    priorityScore: 73,
    priorityReasons: ["Vulnerable elderly population at high risk of fall injury", "Darkened stairway entrance at senior living center"],
    summary: "Senior center walkway lighting outage creating acute fall danger.",
    assignedDepartment: "Municipal Electrical & Lighting Dept",
    assignedCrew: "Bucket Truck Line Crew 1",
    timeline: [{ id: "t1047-1", status: "Submitted", timestamp: "2026-10-30T07:05:00Z", actor: "Nurse Director Higgins", role: "Citizen", note: "Seniors can't see the concrete steps." }],
    upvotes: 29,
    createdAt: "2026-10-30T07:05:00Z",
    updatedAt: "2026-10-30T07:05:00Z"
  },
  {
    id: "CP-2026-1048",
    title: "Overflowing Park Trash Cans with Broken Bottles",
    description: "Shattered glass bottles and spilled cans overflowing from playground trash receptacles onto the rubber safety tiles.",
    category: "Garbage Overflow",
    location: { lat: 40.7168, lng: -74.0105, address: "Columbus Park Tot Playground", street: "Mulberry Street", zone: "Downtown Core" },
    status: "Dispatched",
    priority: "High",
    priorityScore: 74,
    priorityReasons: ["Broken glass laceration hazard in active toddler play zone", "Immediate sanitation sweep required before morning recess"],
    summary: "Shattered glass on playground rubber surface from overflowing receptacle.",
    assignedDepartment: "Solid Waste Management Bureau",
    assignedCrew: "Parks Rapid Cleaning Crew",
    timeline: [{ id: "t1048-1", status: "Submitted", timestamp: "2026-10-30T07:30:00Z", actor: "Parent Sarah M.", role: "Citizen", note: "Glass shards right next to the toddler swings." }],
    upvotes: 34,
    createdAt: "2026-10-30T07:30:00Z",
    updatedAt: "2026-10-30T07:30:00Z"
  },
  {
    id: "CP-2026-1049",
    title: "Defective Pedestrian Walk Signal Chirp Chirping 24/7",
    description: "The audible pedestrian accessibility beeper at the corner of Centre & Pearl St is stuck in high-volume alarm mode.",
    category: "Disrupted Services",
    location: { lat: 40.7122, lng: -74.0040, address: "Corner of Centre St & Pearl St", street: "Centre Street", zone: "Civic Center" },
    status: "In Review",
    priority: "Low",
    priorityScore: 32,
    priorityReasons: ["Auditory accessibility signal defect causing local noise disturbance"],
    summary: "Audible crosswalk signal stuck at maximum volume on Centre St.",
    timeline: [{ id: "t1049-1", status: "Submitted", timestamp: "2026-10-30T06:20:00Z", actor: "Apartment Resident Dan", role: "Citizen", note: "Continuous screeching noise." }],
    upvotes: 7,
    createdAt: "2026-10-30T06:20:00Z",
    updatedAt: "2026-10-30T06:20:00Z"
  },
  {
    id: "CP-2026-1050",
    title: "Extensive Pavement Rutting on Heavy Truck Route 4",
    description: "Deep asphalt tire ruts in the right-hand wheel tracks on Industrial Boulevard cause vehicles to violently tramline in rain.",
    category: "Damaged Roads",
    location: { lat: 40.7230, lng: -74.0170, address: "880 Industrial Boulevard", street: "Industrial Boulevard", zone: "Industrial West" },
    status: "Submitted",
    priority: "Medium",
    priorityScore: 58,
    priorityReasons: ["Deep wheel ruts causing hydroplaning and steering instability"],
    summary: "Severe road rutting along heavy industrial freight route causing vehicle tramlining.",
    timeline: [{ id: "t1050-1", status: "Submitted", timestamp: "2026-10-30T06:55:00Z", actor: "Freight Driver Gary", role: "Citizen", note: "Truck almost pulled into ditch when hitting rut." }],
    upvotes: 14,
    createdAt: "2026-10-30T06:55:00Z",
    updatedAt: "2026-10-30T06:55:00Z"
  },
  {
    id: "CP-2026-1051",
    title: "Clogged Infiltration Trench Causing Schoolyard Water Pool",
    description: "Stormwater infiltration trench along Lincoln Elementary's playing field is silted up, leaving 6 inches of mud and stagnant water.",
    category: "Waterlogging",
    location: { lat: 40.7185, lng: -74.0090, address: "Lincoln Elementary Athletic Field", street: "Elm Street", zone: "North Residential" },
    status: "In Review",
    priority: "Medium",
    priorityScore: 57,
    priorityReasons: ["Stagnant mud pool encroaching onto public school recreation yard"],
    summary: "Clogged stormwater swale flooding Lincoln Elementary athletic field.",
    assignedDepartment: "Stormwater & Drainage Division",
    assignedCrew: "Civil Drainage Maintenance Team",
    timeline: [{ id: "t1051-1", status: "Submitted", timestamp: "2026-10-30T07:18:00Z", actor: "Coach Williams", role: "Citizen", note: "Soccer field flooded with muddy runoff." }],
    upvotes: 11,
    createdAt: "2026-10-30T07:18:00Z",
    updatedAt: "2026-10-30T07:18:00Z"
  },
  {
    id: "CP-2026-1052",
    title: "Underground Metro Steam Pipe Venting Dense White Vapor",
    description: "Steam billowing from the street grille outside 50 Broad St completely obscures driver visibility across two lanes.",
    category: "Disrupted Services",
    location: { lat: 40.7085, lng: -74.0110, address: "50 Broad Street", street: "Broad Street", zone: "Financial South" },
    status: "Dispatched",
    priority: "High",
    priorityScore: 78,
    priorityReasons: ["Zero-visibility steam cloud across active financial district corridor", "Thermal scald hazard for curbside pedestrians"],
    summary: "Steam leak obscuring driver vision on Broad St roadway.",
    assignedDepartment: "City Utilities & Transit Authority",
    assignedCrew: "Steam Utility Thermal Response",
    timeline: [{ id: "t1052-1", status: "Submitted", timestamp: "2026-10-30T08:04:00Z", actor: "Security Lead Vance", role: "Citizen", note: "Zero visibility; cars stopping suddenly." }],
    upvotes: 26,
    createdAt: "2026-10-30T08:04:00Z",
    updatedAt: "2026-10-30T08:04:00Z"
  },
  {
    id: "CP-2026-1053",
    title: "Downed Stop Sign at Blind Corner of 6th & Spruce",
    description: "The metal stop sign post was sheared by a turning delivery truck. Traffic approaching the blind intersection is not yielding, causing constant near collisions.",
    category: "Damaged Roads",
    location: { lat: 40.7160, lng: -74.0075, address: "Corner of 6th Ave & Spruce St", street: "Spruce Street", zone: "Downtown Core" },
    status: "Dispatched",
    priority: "Critical",
    priorityScore: 90,
    priorityReasons: ["Missing regulatory traffic control sign at blind intersection", "Severe risk of T-bone vehicular collisions during morning traffic"],
    summary: "Downed stop sign at blind intersection of 6th & Spruce St causing near-miss crashes.",
    assignedDepartment: "Department of Transportation (Roads)",
    assignedCrew: "Traffic Sign Installation Squad",
    timeline: [{ id: "t1053-1", status: "Submitted", timestamp: "2026-10-30T07:48:00Z", actor: "Resident Brenda", role: "Citizen", note: "Cars flying through the intersection without stopping." }],
    upvotes: 37,
    createdAt: "2026-10-30T07:48:00Z",
    updatedAt: "2026-10-30T07:48:00Z"
  },
  {
    id: "CP-2026-1054",
    title: "Flickering Streetlight Outside Emergency Room Ambulance Bay",
    description: "The high-output luminaire illuminating the ambulance intake ramp at Metro General Hospital is intermittently cutting out.",
    category: "Broken Streetlights",
    location: { lat: 40.7200, lng: -74.0050, address: "Metro General Hospital Emergency Bay", street: "Hospital Way", zone: "Medical District" },
    status: "Dispatched",
    priority: "Critical",
    priorityScore: 88,
    priorityReasons: ["Lighting failure directly affecting hospital emergency trauma intake bay", "Critical safety requirement for paramedic patient transfers"],
    summary: "Emergency ambulance intake luminaire failing at Metro General Hospital.",
    assignedDepartment: "Municipal Electrical & Lighting Dept",
    assignedCrew: "Hospital Priority Electrical Unit",
    timeline: [{ id: "t1054-1", status: "Submitted", timestamp: "2026-10-30T07:52:00Z", actor: "Paramedic Shift Lead", role: "Citizen", note: "Dark ramp while unloading stretcher patients." }],
    upvotes: 42,
    createdAt: "2026-10-30T07:52:00Z",
    updatedAt: "2026-10-30T07:52:00Z"
  },
  {
    id: "CP-2026-1055",
    title: "Storm Debris Piled High on Sidewalk Near Transit Terminal",
    description: "Tree branches and broken vendor pallets have blocked the western sidewalk leading to the central ferry slip for 200 feet.",
    category: "Garbage Overflow",
    location: { lat: 40.7075, lng: -74.0135, address: "Ferry Slip Terminal West Entrance", street: "Battery Place", zone: "Waterfront District" },
    status: "In Review",
    priority: "Medium",
    priorityScore: 53,
    priorityReasons: ["Pedestrian sidewalk blocked, forcing ferry commuters into vehicular roadway"],
    summary: "Storm debris blocking pedestrian sidewalk to Central Ferry Slip.",
    assignedDepartment: "Solid Waste Management Bureau",
    assignedCrew: "Heavy Debris Removal Crew",
    timeline: [{ id: "t1055-1", status: "Submitted", timestamp: "2026-10-30T06:50:00Z", actor: "Commuter Greg P.", role: "Citizen", note: "Walking into street to get around branch pile." }],
    upvotes: 18,
    createdAt: "2026-10-30T06:50:00Z",
    updatedAt: "2026-10-30T06:50:00Z"
  },
  {
    id: "CP-2026-1056",
    title: "Storm Drain Grate Dislodged and Protruding 6 Inches High",
    description: "A steel storm grate on Lafayette St was dislodged by snow plow or truck and is sticking up 6 inches above road grade.",
    category: "Damaged Roads",
    location: { lat: 40.7182, lng: -74.0028, address: "380 Lafayette Street", street: "Lafayette Street", zone: "East Corridor" },
    status: "Submitted",
    priority: "High",
    priorityScore: 76,
    priorityReasons: ["Protruding steel grate posing immediate risk of oil pan and suspension tear", "Dangerous obstacle for night cyclists"],
    summary: "Protruding steel drainage grate sticking 6 inches above roadway on Lafayette St.",
    timeline: [{ id: "t1056-1", status: "Submitted", timestamp: "2026-10-30T08:16:00Z", actor: "Driver Kenneth", role: "Citizen", note: "Huge steel grate sticking up in road." }],
    upvotes: 20,
    createdAt: "2026-10-30T08:16:00Z",
    updatedAt: "2026-10-30T08:16:00Z"
  },
  {
    id: "CP-2026-1057",
    title: "Water Service Disruption to Entire Block on Warren St",
    description: "No running water pressure in 12 residential brownstones on Warren Street since 6 AM. Muddy trickle coming from taps.",
    category: "Disrupted Services",
    location: { lat: 40.7142, lng: -74.0100, address: "Warren St between West & Greenwich", street: "Warren Street", zone: "Tribeca North" },
    status: "Dispatched",
    priority: "High",
    priorityScore: 81,
    priorityReasons: ["Zero water pressure affecting 12 residential multi-family buildings", "Potential cross-contamination indicated by discolored water"],
    summary: "Total municipal water outage affecting Warren Street brownstone block.",
    assignedDepartment: "City Utilities & Transit Authority",
    assignedCrew: "Water Main Diagnostic Gang",
    timeline: [{ id: "t1057-1", status: "Submitted", timestamp: "2026-10-30T07:15:00Z", actor: "Homeowner Association President", role: "Citizen", note: "Entire block has zero water pressure." }],
    upvotes: 33,
    createdAt: "2026-10-30T07:15:00Z",
    updatedAt: "2026-10-30T07:15:00Z"
  },
  {
    id: "CP-2026-1058",
    title: "Overflowing Public Bins at High School Sports Stadium",
    description: "Eight large public bins outside the stadium gates are overflowing with plastic water bottles and snack wrappers blowing into school grounds.",
    category: "Garbage Overflow",
    location: { lat: 40.7215, lng: -74.0088, address: "Lincoln High School Stadium Gate 2", street: "Oak Street", zone: "North Residential" },
    status: "Submitted",
    priority: "Low",
    priorityScore: 36,
    priorityReasons: ["Non-hazardous event litter contained to school perimeter"],
    summary: "Overflowing sports event refuse at Lincoln High School stadium gates.",
    timeline: [{ id: "t1058-1", status: "Submitted", timestamp: "2026-10-30T06:10:00Z", actor: "Athletic Staff Member", role: "Citizen", note: "Bottles spilling over gate area." }],
    upvotes: 8,
    createdAt: "2026-10-30T06:10:00Z",
    updatedAt: "2026-10-30T06:10:00Z"
  },
  {
    id: "CP-2026-1059",
    title: "Waterlogged Pedestrian Underpass at Metro Rail Terminal",
    description: "Pedestrian tunnel connecting Platform 3 to Metro Central has 4 inches of murky pooled water. Thousands of commuters walking along narrow ledge.",
    category: "Waterlogging",
    location: { lat: 40.7118, lng: -74.0062, address: "Metro Central Rail Underpass Platform 3", street: "Main Street", zone: "Downtown Central" },
    status: "Dispatched",
    priority: "High",
    priorityScore: 82,
    priorityReasons: ["Critical commuter pedestrian artery flooded during peak morning rush", "Slip and fall hazard with high foot traffic volume"],
    summary: "Flooded pedestrian underpass at Metro Central Rail Terminal impeding commuters.",
    assignedDepartment: "Stormwater & Drainage Division",
    assignedCrew: "Station Sump Maintenance Unit",
    timeline: [{ id: "t1059-1", status: "Submitted", timestamp: "2026-10-30T07:38:00Z", actor: "Commuter Rachel F.", role: "Citizen", note: "Tunnel is flooded; people sliding on tiles." }],
    upvotes: 27,
    createdAt: "2026-10-30T07:38:00Z",
    updatedAt: "2026-10-30T07:38:00Z"
  },
  {
    id: "CP-2026-1060",
    title: "Burned Out Luminaire in Multi-Tier Municipal Parking Deck",
    description: "Three consecutive overhead high-pressure sodium bulbs burned out in the North stairwell of Municipal Parking Deck C.",
    category: "Broken Streetlights",
    location: { lat: 40.7165, lng: -74.0040, address: "Municipal Parking Deck C Stairwell North", street: "Centre Street", zone: "Civic Center" },
    status: "In Review",
    priority: "Medium",
    priorityScore: 50,
    priorityReasons: ["Darkened public parking stairwell increasing slip and security risk"],
    summary: "Three failed fixtures in public parking stairwell creating safety blind spot.",
    assignedDepartment: "Municipal Electrical & Lighting Dept",
    assignedCrew: "Facility Electrician",
    timeline: [{ id: "t1060-1", status: "Submitted", timestamp: "2026-10-30T06:45:00Z", actor: "Parking Patron Lisa", role: "Citizen", note: "Pitch black stairs; had to use phone flashlight." }],
    upvotes: 14,
    createdAt: "2026-10-30T06:45:00Z",
    updatedAt: "2026-10-30T06:45:00Z"
  }
];

export const allMockReports: CivicReport[] = [
  ...initialMockReports,
  ...additionalSyntheticReports
];
