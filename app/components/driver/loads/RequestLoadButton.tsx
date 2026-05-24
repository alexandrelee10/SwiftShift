"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { requestLoad } from "@/app/dashboard/driver/loads/search/[id]/action";

export default function RequestLoadButton({
  loadId,
}: {
  loadId: string;
}) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  function handleRequest() {
    startTransition(async () => {
      try {
        await requestLoad(loadId);

        toast.success(
          "Load request submitted"
        );

        router.refresh();
      } catch {
        toast.error(
          "Could not request load"
        );
      }
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleRequest}
      className="
      inline-flex
      items-center
      justify-center
      rounded-md
      border
      border-slate-200
      bg-blue-700
      px-3
      py-2
      text-xs
      font-medium
      text-slate-700
      transition
      hover:bg-slate-50
      dark:border-slate-700
      dark:text-slate-300
      dark:hover:bg-blue-600
      "
    >
      {isPending
        ? "Requesting..."
        : "Request"}
    </button>
  );
}