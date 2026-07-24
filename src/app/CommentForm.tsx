"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { submitComment, type CommentFormState } from "@/lib/actions";
import type { SessionUser } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

const initialState: CommentFormState = { status: "idle" };

export default function CommentForm({
  entryId,
  syllabusSectionId,
  path,
  user,
}: {
  entryId?: string;
  syllabusSectionId?: string;
  path: string;
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
        <Link href={`/login?next=${encodeURIComponent(path)}`}>
          Sign in
        </Link>{" "}
        to leave a comment.
      </p>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="comment-form">
      {entryId && <input type="hidden" name="entry_id" value={entryId} />}
      {syllabusSectionId && (
        <input
          type="hidden"
          name="syllabus_section_id"
          value={syllabusSectionId}
        />
      )}
      <input type="hidden" name="path" value={path} />

      <p className="comment-signed-in-as mono">
        Posting as {user.displayName} · <SignOutButton />
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
