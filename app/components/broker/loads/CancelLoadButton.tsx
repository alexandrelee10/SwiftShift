"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Ban } from "lucide-react";

export default function CancelLoadButton({
  loadId,
}: {
  loadId: string;
}) {
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] =
    useTransition();

  const router = useRouter();

  function cancelLoad() {
    startTransition(async () => {
      const res = await fetch(
        `/api/loads/${loadId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        toast.error("Failed to cancel load");
        return;
      }

      toast.success("Load cancelled");

      setOpen(false);

      router.refresh();
      router.push("/dashboard/broker/brokerLoads/load")
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          inline-flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-lg
          border
          border-red-200
          px-4
          py-3
          text-sm
          font-semibold
          text-red-600
          hover:bg-red-50
          dark:border-red-900
          dark:text-red-400
          dark:hover:bg-red-950/30
        "
      >
        <Ban size={16} />
        Cancel Load
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
              <Ban
                className="text-red-600"
                size={24}
              />
            </div>

            <h3 className="mt-5 text-center text-xl font-semibold">
              Cancel this load?
            </h3>

            <p className="mt-2 text-center text-sm text-slate-500">
              This will remove the load from
              active dispatch and mark it as
              cancelled.
            </p>

            <div className="mt-6 flex gap-3">

              <button
                onClick={() => setOpen(false)}
                className="
                  flex-1
                  rounded-xl
                  border
                  py-3
                "
              >
                Keep Load
              </button>

              <button
                disabled={isPending}
                onClick={cancelLoad}
                className="
                  flex-1
                  rounded-xl
                  bg-red-600
                  py-3
                  text-white
                  hover:bg-red-700
                "
              >
                {isPending
                  ? "Cancelling..."
                  : "Cancel Load"}
              </button>

            </div>
          </div>

        </div>
      )}
    </>
  );
}