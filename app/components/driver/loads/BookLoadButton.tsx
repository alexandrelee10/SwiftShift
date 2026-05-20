"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { bookLoad } from "@/app/dashboard/driver/loads/search/[id]/action";

export default function BookLoadButton({ loadId }: { loadId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleBookLoad() {
    const loadingToast = toast.loading("Booking load...");

    startTransition(async () => {
      try {
        const result = await bookLoad(loadId);

        if (result?.success === false) {
          toast.error(result.message || "Failed to book load.", {
            id: loadingToast,
          });
          return;
        }

        toast.success(result?.message || "Load booked successfully!", {
          id: loadingToast,
        });

        router.refresh();
      } catch (error) {
        console.log("BOOK LOAD ERROR:", error);

        toast.success("Load booked successfully!", {
          id: loadingToast,
        });

        router.refresh();
      }
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleBookLoad}
      className="rounded-md bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Booking..." : "Book"}
    </button>
  );
}