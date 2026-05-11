"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();
  const [saved, setSaved] = useState(false);

  const hasSubmitted = useRef(false);
  const wasPending = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (pending) {
      hasSubmitted.current = true;
      wasPending.current = true;
      setSaved(false);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      return;
    }

    if (hasSubmitted.current && wasPending.current && !pending) {
      setSaved(true);
      wasPending.current = false;

      timerRef.current = setTimeout(() => {
        setSaved(false);
        hasSubmitted.current = false;
      }, 2200);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [pending]);

  return (
    <>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Changes"}
      </button>

      {saved && (
        <div className="fixed top-6 z-50 rounded-xl border border-green-200 bg-white px-4 py-3 text-sm font-medium text-green-700 shadow-lg">
          ✓ Saved successfully
        </div>
      )}
    </>
  );
}