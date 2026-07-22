"use client";

import { useActionState } from "react";
import {
  requestMagicLink,
  signInWithGoogle,
  type MagicLinkState,
} from "@/lib/auth-actions";

const initialState: MagicLinkState = { status: "idle" };

export default function LoginForm({ next }: { next: string | null }) {
  const [state, formAction, pending] = useActionState(
    requestMagicLink,
    initialState,
  );

  return (
    <div className="login-form">
      <form action={formAction} className="comment-form">
        {next && <input type="hidden" name="next" value={next} />}

        <label>
          Email
          <input type="email" name="email" required autoComplete="email" />
        </label>

        <button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send magic link"}
        </button>

        {state.status !== "idle" && state.message && (
          <p
            className={`form-note ${state.status === "success" ? "success" : "error"}`}
          >
            {state.message}
          </p>
        )}
      </form>

      <div className="login-divider mono">or</div>

      <form action={signInWithGoogle}>
        {next && <input type="hidden" name="next" value={next} />}
        <button type="submit" className="login-google-button">
          Continue with Google
        </button>
      </form>
    </div>
  );
}
