import { getSupabaseClient, createServerSupabaseClient } from "./supabase";
import type { Comment, Entry } from "./types";

// Fixed project start date used to compute "days running" on the homepage.
export const PROJECT_START_DATE = "2026-08-24";

// Homepage hero video. Not part of the entries schema — paste a YouTube
// URL here directly. Empty string shows an empty state.
export const HOMEPAGE_VIDEO_URL = "";

export type ArchiveStats = {
  entryCount: number;
  sourceCount: number;
  daysRunning: number;
};

function daysSince(isoDate: string): number {
  const start = new Date(isoDate).getTime();
  const now = Date.now();
  return Math.floor((now - start) / 86_400_000);
}

export async function getPublishedEntries(): Promise<Entry[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to load entries:", error.message);
    return [];
  }
  return (data as Entry[]) ?? [];
}

export async function getCategories(): Promise<string[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("entries")
    .select("category")
    .not("published_at", "is", null)
    .not("category", "is", null);

  if (error) {
    console.error("Failed to load categories:", error.message);
    return [];
  }

  const categories = new Set(
    (data ?? [])
      .map((row) => (row as { category: string | null }).category)
      .filter((category): category is string => Boolean(category)),
  );
  return Array.from(categories).sort((a, b) => a.localeCompare(b));
}

export async function getEntriesByCategory(category: string): Promise<Entry[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("category", category)
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to load category entries:", error.message);
    return [];
  }
  return (data as Entry[]) ?? [];
}

export type EntrySearchItem = {
  slug: string;
  title: string;
  entry_number: number | null;
  body: string | null;
};

export async function getEntrySearchIndex(): Promise<EntrySearchItem[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("entries")
    .select("slug, title, entry_number, body")
    .not("published_at", "is", null);

  if (error) {
    console.error("Failed to load entry search index:", error.message);
    return [];
  }
  return (data as EntrySearchItem[]) ?? [];
}

export async function getEntryBySlug(slug: string): Promise<Entry | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("slug", slug)
    .not("published_at", "is", null)
    .maybeSingle();

  if (error) {
    console.error("Failed to load entry:", error.message);
    return null;
  }
  return (data as Entry | null) ?? null;
}

export async function getStats(): Promise<ArchiveStats> {
  const daysRunning = daysSince(PROJECT_START_DATE);
  const entries = await getPublishedEntries();

  const sourceCount = entries.reduce(
    (total, entry) => total + (entry.sources?.length ?? 0),
    0,
  );

  return {
    entryCount: entries.length,
    sourceCount,
    daysRunning,
  };
}

export async function getVisibleComments(entryId: string): Promise<Comment[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("entry_id", entryId)
    .eq("hidden", false)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load comments:", error.message);
    return [];
  }
  return (data as Comment[]) ?? [];
}

// saved_entries has no anon grants — only the authenticated role can read
// or write it, so these always go through the session-aware server client.
export async function isEntrySaved(
  userId: string,
  entryId: string,
): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return false;

  const { data, error } = await supabase
    .from("saved_entries")
    .select("id")
    .eq("user_id", userId)
    .eq("entry_id", entryId)
    .maybeSingle();

  if (error) {
    console.error("Failed to check saved state:", error.message);
    return false;
  }
  return Boolean(data);
}

export async function getSavedEntryIds(userId: string): Promise<Set<string>> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return new Set();

  const { data, error } = await supabase
    .from("saved_entries")
    .select("entry_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to load saved entry ids:", error.message);
    return new Set();
  }
  return new Set((data ?? []).map((row) => row.entry_id as string));
}

export async function getSavedEntries(userId: string): Promise<Entry[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("saved_entries")
    .select("created_at, entries!inner(*)")
    .eq("user_id", userId)
    .not("entries.published_at", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load saved entries:", error.message);
    return [];
  }
  return (data ?? []).map(
    (row) => row.entries as unknown as Entry,
  );
}
