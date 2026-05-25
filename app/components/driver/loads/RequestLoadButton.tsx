"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { requestLoad } from "@/app/dashboard/driver/loads/search/[id]/action";

interface RequestLoadButtonProps {
  loadId: string;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  pendingLabel?: string;
  label?: string;
}

export default function RequestLoadButton({
  loadId,
  loadingMessage = "Submitting request...",
  successMessage = "Load request submitted",
  errorMessage = "Could not request load",
  pendingLabel = "Requesting...",
  label = "Request",
}: RequestLoadButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRequest() {
    startTransition(async () => {
      const loadingToast = toast.loading(loadingMessage);
      try {
        await requestLoad(loadId);
        toast.success(successMessage, { id: loadingToast });
        router.refresh();
      } catch {
        toast.error(errorMessage, { id: loadingToast });
      }
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleRequest}
    >
      {isPending ? pendingLabel : label}
    </button>
  );
}