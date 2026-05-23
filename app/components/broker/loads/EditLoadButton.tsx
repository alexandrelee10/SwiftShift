"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { bookLoad } from "@/app/dashboard/driver/loads/search/[id]/action";

export default function EditLoadButton({ loadId }: { loadId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();


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