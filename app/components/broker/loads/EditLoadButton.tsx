"use client";

import { useRouter } from "next/navigation";

export default function EditLoadButton({ loadId }: { loadId: string }) {
  const router = useRouter();

  function editLoad() {
    router.push(`/dashboard/broker/brokerLoads/load/${loadId}/edit`);
  }

  return (
    <button
      type="button"
      onClick={editLoad}
      className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
    >
      Edit Load
    </button>
  );
}