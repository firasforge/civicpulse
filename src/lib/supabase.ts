import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { CivicReport, AuthUser } from "./types";

export const LOCAL_STORAGE_KEY = "civicpulse_reports_v1";
export const LOCAL_AUTH_KEY = "civicpulse_auth_user";
export const SUPABASE_REPORTS_TABLE = "civic_reports";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

/**
 * Checks whether Supabase credentials are configured and valid.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseUrl.trim() !== "" &&
    supabaseUrl.startsWith("http") &&
    supabaseAnonKey &&
    supabaseAnonKey.trim() !== "" &&
    supabaseAnonKey !== "placeholder_key"
);

/**
 * Supabase client instance. Null if credentials are not configured
 * so the application falls back gracefully to localStorage without crashing.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: typeof window !== "undefined",
        autoRefreshToken: typeof window !== "undefined",
      },
    })
  : null;

/**
 * Safe client-side localStorage reader fallback.
 */
export function getLocalStorageReports(): CivicReport[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CivicReport[]) : null;
  } catch (err) {
    console.warn("[CivicPulse] Failed to read reports from localStorage:", err);
    return null;
  }
}

/**
 * Safe client-side localStorage writer fallback.
 */
export function saveToLocalStorage(reports: CivicReport[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reports));
  } catch (err) {
    console.warn("[CivicPulse] Failed to write reports to localStorage:", err);
  }
}

/**
 * Maps a CivicReport domain object to a Supabase PostgreSQL row.
 */
function reportToRow(report: CivicReport) {
  return {
    id: report.id,
    title: report.title,
    description: report.description,
    category: report.category,
    status: report.status,
    priority: report.priority,
    priority_score: report.priorityScore,
    location: report.location,
    image_url: report.imageUrl || null,
    summary: report.summary || null,
    priority_reasons: report.priorityReasons || [],
    duplicate_link: report.duplicateLink || null,
    assigned_department: report.assignedDepartment || null,
    assigned_crew: report.assignedCrew || null,
    estimated_resolution_time: report.estimatedResolutionTime || null,
    action_brief: report.actionBrief || null,
    timeline: report.timeline || [],
    citizen_contact: report.citizenContact || null,
    upvotes: report.upvotes ?? 1,
    upvoted_by_ip: report.upvotedByIp || [],
    raw_data: report,
    created_at: report.createdAt,
    updated_at: report.updatedAt,
  };
}

/**
 * Maps a Supabase PostgreSQL row back to a CivicReport domain object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToReport(row: any): CivicReport {
  if (row.raw_data && typeof row.raw_data === "object") {
    return {
      ...(row.raw_data as CivicReport),
      id: row.id || row.raw_data.id,
      status: row.status || row.raw_data.status,
      upvotes: typeof row.upvotes === "number" ? row.upvotes : row.raw_data.upvotes,
      updatedAt: row.updated_at || row.raw_data.updatedAt,
    };
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    location: row.location,
    imageUrl: row.image_url || undefined,
    status: row.status,
    priority: row.priority,
    priorityScore: row.priority_score ?? 50,
    priorityReasons: row.priority_reasons || [],
    summary: row.summary || "",
    duplicateLink: row.duplicate_link || undefined,
    assignedDepartment: row.assigned_department || undefined,
    assignedCrew: row.assigned_crew || undefined,
    estimatedResolutionTime: row.estimated_resolution_time || undefined,
    actionBrief: row.action_brief || undefined,
    timeline: row.timeline || [],
    citizenContact: row.citizen_contact || undefined,
    upvotes: row.upvotes ?? 1,
    upvotedByIp: row.upvoted_by_ip || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at || row.created_at,
  };
}

/**
 * Fetch all reports from Supabase PostgreSQL.
 * Falls back to null if Supabase is unconfigured or unavailable.
 */
export async function fetchReportsFromSupabase(): Promise<CivicReport[] | null> {
  if (!supabase || !isSupabaseConfigured) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from(SUPABASE_REPORTS_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[CivicPulse Supabase] SELECT query warning:", error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return data.map(rowToReport);
  } catch (err) {
    console.warn("[CivicPulse Supabase] Failed to fetch from Supabase:", err);
    return null;
  }
}

/**
 * Save a single report to Supabase PostgreSQL.
 * Automatically mirrors to localStorage fallback if in browser.
 */
export async function saveReportToSupabase(report: CivicReport): Promise<boolean> {
  // Always maintain localStorage fallback so app never loses state
  if (typeof window !== "undefined") {
    const local = getLocalStorageReports() || [];
    const filtered = local.filter((r) => r.id !== report.id);
    saveToLocalStorage([report, ...filtered]);
  }

  if (!supabase || !isSupabaseConfigured) {
    return false;
  }

  try {
    const row = reportToRow(report);
    const { error } = await supabase
      .from(SUPABASE_REPORTS_TABLE)
      .upsert(row, { onConflict: "id" });

    if (error) {
      console.warn("[CivicPulse Supabase] Upsert warning:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn("[CivicPulse Supabase] Failed to save report to Supabase:", err);
    return false;
  }
}

/**
 * Update an existing report in Supabase PostgreSQL.
 */
export async function updateReportInSupabase(
  id: string,
  updates: Partial<CivicReport>
): Promise<boolean> {
  // Always update localStorage
  if (typeof window !== "undefined") {
    const local = getLocalStorageReports() || [];
    const updatedLocal = local.map((r) =>
      r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
    );
    saveToLocalStorage(updatedLocal);
  }

  if (!supabase || !isSupabaseConfigured) {
    return false;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowUpdates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.status) rowUpdates.status = updates.status;
    if (updates.assignedDepartment) rowUpdates.assigned_department = updates.assignedDepartment;
    if (updates.assignedCrew) rowUpdates.assigned_crew = updates.assignedCrew;
    if (updates.estimatedResolutionTime) rowUpdates.estimated_resolution_time = updates.estimatedResolutionTime;
    if (updates.timeline) rowUpdates.timeline = updates.timeline;
    if (updates.upvotes !== undefined) rowUpdates.upvotes = updates.upvotes;
    if (updates.upvotedByIp) rowUpdates.upvoted_by_ip = updates.upvotedByIp;
    if (updates.actionBrief) rowUpdates.action_brief = updates.actionBrief;

    const { error } = await supabase
      .from(SUPABASE_REPORTS_TABLE)
      .update(rowUpdates)
      .eq("id", id);

    if (error) {
      console.warn("[CivicPulse Supabase] Update error:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn("[CivicPulse Supabase] Failed to update report in Supabase:", err);
    return false;
  }
}

/**
 * Batch synchronize reports to Supabase PostgreSQL (e.g. on store sync or benchmark seed).
 */
export async function syncReportsToSupabase(reports: CivicReport[]): Promise<boolean> {
  if (typeof window !== "undefined") {
    saveToLocalStorage(reports);
  }

  if (!supabase || !isSupabaseConfigured || reports.length === 0) {
    return false;
  }

  try {
    const rows = reports.map(reportToRow);
    const { error } = await supabase
      .from(SUPABASE_REPORTS_TABLE)
      .upsert(rows, { onConflict: "id" });

    if (error) {
      console.warn("[CivicPulse Supabase] Batch upsert warning:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn("[CivicPulse Supabase] Failed to batch sync to Supabase:", err);
    return false;
  }
}

/* ============================================================================
 * Supabase Authentication & Resilient Local Session Fallback
 * ============================================================================ */

export function getLocalAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLocalAuthUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(user));
  } catch {}
}

export function removeLocalAuthUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LOCAL_AUTH_KEY);
  } catch {}
}

/**
 * Register a new user with email and password via Supabase Auth.
 * Falls back to local session if Supabase is unconfigured.
 */
export async function signUpUser(
  email: string,
  password: string,
  name?: string
): Promise<{ user: AuthUser | null; error: string | null; message?: string }> {
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split("@")[0],
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || email,
          name: name || data.user.user_metadata?.name || email.split("@")[0],
          role: "citizen",
        };

        if (data.session) {
          saveLocalAuthUser(authUser);
          return { user: authUser, error: null };
        } else {
          return {
            user: authUser,
            error: null,
            message: "Account created! If confirmation is required, please verify your email.",
          };
        }
      }

      return { user: null, error: "Registration failed. Please try again." };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign up failed.";
      return { user: null, error: msg };
    }
  }

  // Fallback demo/offline registration
  const localUser: AuthUser = {
    id: "usr-" + Date.now(),
    email,
    name: name || email.split("@")[0],
    role: "citizen",
  };
  saveLocalAuthUser(localUser);
  return { user: localUser, error: null };
}

/**
 * Sign in an existing user with email and password via Supabase Auth.
 * Falls back to local session if Supabase is unconfigured.
 */
export async function signInWithPassword(
  email: string,
  password: string
): Promise<{ user: AuthUser | null; error: string | null }> {
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.name || email.split("@")[0],
          role: data.user.user_metadata?.role || "citizen",
        };
        saveLocalAuthUser(authUser);
        return { user: authUser, error: null };
      }

      return { user: null, error: "Failed to sign in. Please check your credentials." };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign in error.";
      return { user: null, error: msg };
    }
  }

  // Fallback demo/offline authentication
  if (!email || !password || password.length < 6) {
    return { user: null, error: "Password must be at least 6 characters." };
  }

  const localUser: AuthUser = {
    id: "usr-" + Date.now(),
    email,
    name: email.split("@")[0],
    role: email.includes("admin") ? "admin" : "citizen",
  };
  saveLocalAuthUser(localUser);
  return { user: localUser, error: null };
}

/**
 * Sign out current user from Supabase and local storage.
 */
export async function signOutUser(): Promise<{ error: string | null }> {
  removeLocalAuthUser();

  if (supabase && isSupabaseConfigured) {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) return { error: error.message };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign out error.";
      return { error: msg };
    }
  }

  return { error: null };
}

/**
 * Get the currently authenticated user.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || "",
          name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "Citizen",
          role: data.user.user_metadata?.role || "citizen",
        };
        saveLocalAuthUser(authUser);
        return authUser;
      }
    } catch {
      // Fallback to local user
    }
  }

  return getLocalAuthUser();
}

/**
 * Subscribe to Supabase authentication state changes.
 */
export function onAuthStateChange(
  callback: (user: AuthUser | null) => void
): { unsubscribe: () => void } {
  if (supabase && isSupabaseConfigured) {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Citizen",
          role: session.user.user_metadata?.role || "citizen",
        };
        saveLocalAuthUser(authUser);
        callback(authUser);
      } else {
        removeLocalAuthUser();
        callback(null);
      }
    });

    return {
      unsubscribe: () => {
        subscription.unsubscribe();
      },
    };
  }

  // Fallback storage listener for client-side multi-tab synchronization
  const handleStorage = (e: StorageEvent) => {
    if (e.key === LOCAL_AUTH_KEY) {
      callback(getLocalAuthUser());
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return {
    unsubscribe: () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorage);
      }
    },
  };
}

