"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitComment, type CommentFormState } from "@/lib/actions";

const initialState: CommentFormState = { status: "idle" };

export default function CommentForm({
  entryId,
  slug,
}: {
  entryId: string;
  slug: string;
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

  return (
    <form ref={formRef} action={formAction} className="comment-form">
      <input type="hidden" name="entry_id" value={entryId} />
      <input type="hidden" name="slug" value={slug} />

      <label>
        Name
        <input type="text" name="name" required maxLength={80} />
      </label>

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
