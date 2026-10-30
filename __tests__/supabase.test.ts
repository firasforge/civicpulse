import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isSupabaseConfigured,
  supabase,
  fetchReportsFromSupabase,
  saveReportToSupabase,
  updateReportInSupabase,
  syncReportsToSupabase,
  getLocalStorageReports,
  saveToLocalStorage,
  LOCAL_STORAGE_KEY,
} from "../src/lib/supabase";
import { CivicReport } from "../src/lib/types";

const mockReport: CivicReport = {
  id: "CP-2026-9999",
  title: "Test Sinkhole on Central Ave",
  description: "Test description of road hazard requiring urgent attention.",
  category: "Damaged Roads",
  location: {
    lat: 40.7128,
    lng: -74.006,
    address: "100 Central Ave",
    street: "Central Ave",
  },
  status: "Submitted",
  priority: "High",
  priorityScore: 78,
  priorityReasons: ["Pavement breach"],
  summary: "Test summary",
  timeline: [],
  upvotes: 1,
  createdAt: "2026-10-30T10:00:00.000Z",
  updatedAt: "2026-10-30T10:00:00.000Z",
};

describe("Supabase Integration & Fallback Layer", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("handles missing credentials gracefully without throwing", () => {
    // When environment variables are absent, isSupabaseConfigured should be false
    // and supabase client should be safely null so the app never crashes
    expect(typeof isSupabaseConfigured).toBe("boolean");
    if (!isSupabaseConfigured) {
      expect(supabase).toBeNull();
    }
  });

  it("fetchReportsFromSupabase returns null gracefully when unconfigured", async () => {
    if (!isSupabaseConfigured) {
      const result = await fetchReportsFromSupabase();
      expect(result).toBeNull();
    }
  });

  it("saveReportToSupabase falls back safely without throwing", async () => {
    const result = await saveReportToSupabase(mockReport);
    expect(typeof result).toBe("boolean");
  });

  it("updateReportInSupabase falls back safely without throwing", async () => {
    const result = await updateReportInSupabase("CP-2026-9999", { status: "In Review" });
    expect(typeof result).toBe("boolean");
  });

  it("syncReportsToSupabase handles empty or unconfigured batches safely", async () => {
    const result = await syncReportsToSupabase([mockReport]);
    expect(typeof result).toBe("boolean");
  });

  it("local storage helper functions read and write reliably", () => {
    const testStorage: Record<string, string> = {};
    const mockStorage = {
      getItem: vi.fn((key: string) => testStorage[key] || null),
      setItem: vi.fn((key: string, val: string) => {
        testStorage[key] = val;
      }),
      removeItem: vi.fn((key: string) => {
        delete testStorage[key];
      }),
      clear: vi.fn(() => {}),
      length: 0,
      key: vi.fn(() => null),
    };

    vi.stubGlobal("window", { localStorage: mockStorage });
    vi.stubGlobal("localStorage", mockStorage);

    saveToLocalStorage([mockReport]);
    expect(mockStorage.setItem).toHaveBeenCalledWith(
      LOCAL_STORAGE_KEY,
      expect.stringContaining("CP-2026-9999")
    );

    const retrieved = getLocalStorageReports();
    expect(retrieved).not.toBeNull();
    expect(retrieved?.[0].id).toBe("CP-2026-9999");

    vi.unstubAllGlobals();
  });

  it("handles authentication workflows (signUp, signIn, signOut, stateChange) reliably", async () => {
    const testStorage: Record<string, string> = {};
    const mockStorage = {
      getItem: vi.fn((key: string) => testStorage[key] || null),
      setItem: vi.fn((key: string, val: string) => {
        testStorage[key] = val;
      }),
      removeItem: vi.fn((key: string) => {
        delete testStorage[key];
      }),
      clear: vi.fn(() => {}),
      length: 0,
      key: vi.fn(() => null),
    };

    vi.stubGlobal("window", {
      localStorage: mockStorage,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    vi.stubGlobal("localStorage", mockStorage);

    // 1. Sign up
    const signUpRes = await import("../src/lib/supabase").then((m) =>
      m.signUpUser("tester@civicpulse.org", "Pass123!", "Civic Tester")
    );
    expect(signUpRes.user).not.toBeNull();
    expect(signUpRes.user?.email).toBe("tester@civicpulse.org");

    // 2. Current user
    const current = await import("../src/lib/supabase").then((m) => m.getCurrentUser());
    expect(current?.email).toBe("tester@civicpulse.org");

    // 3. Sign in
    const signInRes = await import("../src/lib/supabase").then((m) =>
      m.signInWithPassword("tester@civicpulse.org", "Pass123!")
    );
    expect(signInRes.user?.email).toBe("tester@civicpulse.org");

    // 4. Sign out
    const signOutRes = await import("../src/lib/supabase").then((m) => m.signOutUser());
    expect(signOutRes.error).toBeNull();

    const afterSignOut = await import("../src/lib/supabase").then((m) => m.getCurrentUser());
    expect(afterSignOut).toBeNull();

    // 5. Auth State Change subscription
    const sub = await import("../src/lib/supabase").then((m) =>
      m.onAuthStateChange(() => {})
    );
    expect(typeof sub.unsubscribe).toBe("function");
    sub.unsubscribe();

    vi.unstubAllGlobals();
  });
});

