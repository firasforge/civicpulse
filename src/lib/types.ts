export type ReportCategory =
  | "Waterlogging"
  | "Damaged Roads"
  | "Garbage Overflow"
  | "Broken Streetlights"
  | "Disrupted Services";

export type PriorityLevel = "Critical" | "High" | "Medium" | "Low";

export type ReportStatus = "Submitted" | "In Review" | "Dispatched" | "Resolved";

export type PortalRole = "citizen" | "admin";

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
  street: string;
  landmark?: string;
  zone?: string;
}

export interface ActionBrief {
  rootCause: string;
  recommendedCrew: string;
  requiredEquipment: string[];
  safetyPrecautions: string[];
  estimatedResolutionTime: string;
  budgetEstimate?: string;
  generatedAt: string;
}

export interface TimelineEvent {
  id: string;
  status: ReportStatus;
  timestamp: string;
  actor: string;
  role: "System" | "Citizen" | "Dispatcher" | "Field Supervisor" | "Inspector";
  note: string;
}

export interface DuplicateLink {
  parentReportId: string;
  similarityScore: number; // 0 to 1
  sharedFactors: string[];
  isConfirmed: boolean;
}

export interface CivicReport {
  id: string; // e.g. "CP-2026-1042"
  title: string;
  description: string;
  category: ReportCategory;
  location: GeoLocation;
  imageUrl?: string;
  status: ReportStatus;
  priority: PriorityLevel;
  priorityScore: number; // 0 to 100
  priorityReasons: string[]; // Explainable AI bullet points
  summary: string; // AI generated concise summary
  duplicateLink?: DuplicateLink;
  assignedDepartment?: string;
  assignedCrew?: string;
  estimatedResolutionTime?: string;
  actionBrief?: ActionBrief;
  timeline: TimelineEvent[];
  citizenContact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  upvotes: number;
  upvotedByIp?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface HotspotCluster {
  id: string;
  name: string;
  street: string;
  center: { lat: number; lng: number };
  radiusMeters: number;
  reportCount: number;
  reports: CivicReport[];
  primaryCategory: ReportCategory;
  categories: { [key in ReportCategory]?: number };
  criticalCount: number;
  severityScore: number; // 0 - 100
  aiClusterDiagnosis: string;
  recommendedSystemicAction: string;
}

export interface SystemStats {
  totalReports: number;
  submitted: number;
  inReview: number;
  dispatched: number;
  resolved: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  activeHotspots: number;
  duplicateReportsLinked: number;
  avgResolutionHours: number;
  categoryBreakdown: Record<ReportCategory, number>;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}
