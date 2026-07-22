"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseClient } from "./supabase";

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
  const name = String(formData.get("name") ?? "").trim();
  const comment = String(formData.get("comment") ?? "").trim();

  if (!entryId || !name || !comment) {
    return { status: "error", message: "Name and comment are required." };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      status: "error",
      message: "Comments aren't available right now.",
    };
  }

  const { error } = await supabase
    .from("comments")
    .insert({ entry_id: entryId, name, comment });

  if (error) {
    console.error("Failed to submit comment:", error.message);
    return { status: "error", message: "Something went wrong. Try again." };
  }

  if (slug) revalidatePath(`/${slug}`);
  return { status: "success", message: "Comment posted." };
}
