// app/components/broker/loads/PostLoadModal.tsx

"use client";

import { useState } from "react";
import PostLoadPage from "./PostLoads";

export default function PostLoadModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        + Post New Load
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-slate-900">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-semibold text-zinc-900 dark:text-white">
                Post New Load
              </h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <PostLoadPage />
          </div>
        </div>
      )}
    </>
  );
}