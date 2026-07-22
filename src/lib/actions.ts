"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "./supabase";
import { displayNameFor } from "./auth";

export type CommentFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitComment(
  _prev: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const entryId = String(formData.get("entry_id") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const comment = String(formData.get("comment") ?? "").trim();

  if (!entryId || !comment) {
    return { status: "error", message: "Comment text is required." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      status: "error",
      message: "Comments aren't available right now.",
    };
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { status: "error", message: "Sign in to comment." };
  }

  const { error } = await supabase.from("comments").insert({
    entry_id: entryId,
    user_id: userData.user.id,
    name: displayNameFor(userData.user),
    comment,
  });

  if (error) {
    console.error("Failed to submit comment:", error.message);
    return { status: "error", message: "Something went wrong. Try again." };
  }

  if (slug) revalidatePath(`/${slug}`);
  return { status: "success", message: "Comment posted." };
}
