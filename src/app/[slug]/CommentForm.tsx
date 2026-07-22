"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { submitComment, type CommentFormState } from "@/lib/actions";
import { signOut } from "@/lib/auth-actions";
import type { SessionUser } from "@/lib/auth";

const initialState: CommentFormState = { status: "idle" };

export default function CommentForm({
  entryId,
  slug,
  user,
}: {
  entryId: string;
  slug: string;
  user: SessionUser | null;
}) {
  const [state, formAction, pending] = useActionState(
    submitComment,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  if (!user) {
    return (
      <p className="comment-signin-prompt">
        <Link href={`/login?next=${encodeURIComponent(`/${slug}`)}`}>
          Sign in
        </Link>{" "}
        to leave a comment.
      </p>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="comment-form">
      <input type="hidden" name="entry_id" value={entryId} />
      <input type="hidden" name="slug" value={slug} />

      <p className="comment-signed-in-as mono">
        Posting as {user.displayName} ·{" "}
        <button type="submit" name="sign_out" formAction={signOut} className="link-button">
          Sign out
        </button>
      </p>

      <label>
        Comment
        <textarea name="comment" required rows={4} maxLength={4000} />
      </label>

      <button type="submit" disabled={pending}>
        {pending ? "Posting…" : "Post comment"}
      </button>

      {state.status !== "idle" && state.message && (
        <p
          className={`form-note ${state.status === "success" ? "success" : "error"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
