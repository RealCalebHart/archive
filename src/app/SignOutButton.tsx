"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { signOut } from "@/lib/auth-actions";

export default function SignOutButton() {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // A <form> can't be nested inside the comment form, so the confirm
  // dialog and its own sign-out form are portaled to document.body.
  useEffect(() => setMounted(true), []);

  return (
    <>
      <button
        type="button"
        className="link-button"
        onClick={() => dialogRef.current?.showModal()}
      >
        Sign out
      </button>

      {mounted &&
        createPortal(
          <dialog ref={dialogRef} className="confirm-dialog">
            <p>Are you sure you want to sign out?</p>
            <div className="confirm-dialog-actions">
              <button
                type="button"
                className="confirm-dialog-cancel"
                onClick={() => dialogRef.current?.close()}
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirm-dialog-confirm"
                onClick={() => formRef.current?.requestSubmit()}
              >
                Sign out
              </button>
            </div>
          </dialog>,
          document.body,
        )}

      {mounted &&
        createPortal(
          <form ref={formRef} action={signOut} hidden />,
          document.body,
        )}
    </>
  );
}
