"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "./supabase";

export async function toggleSavedEntry(
  entryId: string,
  slug: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { ok: false, error: "Sign-in isn't available right now." };

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { ok: false, error: "You need to be signed in to save entries." };
  }

  const userId = userData.user.id;

  const { data: existing, error: selectError } = await supabase
    .from("saved_entries")
    .select("id")
    .eq("user_id", userId)
    .eq("entry_id", entryId)
    .maybeSingle();

  if (selectError) {
    console.error("Failed to check saved state:", selectError.message);
    return { ok: false, error: selectError.message };
  }

  if (existing) {
    const { error } = await supabase
      .from("saved_entries")
      .delete()
      .eq("id", existing.id);
    if (error) {
      console.error("Failed to unsave entry:", error.message);
      return { ok: false, error: error.message };
    }
  } else {
    const { error } = await supabase
      .from("saved_entries")
      .insert({ user_id: userId, entry_id: entryId });
    if (error) {
      console.error("Failed to save entry:", error.message);
      return { ok: false, error: error.message };
    }
  }

  revalidatePath(`/${slug}`);
  revalidatePath("/saved");
  return { ok: true };
}
