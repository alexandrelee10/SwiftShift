import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";
import EditLoadForm from "./EditLoadForm";

import BackButton from "@/app/components/shared/BackButton"
import { ArrowLeft } from "lucide-react";
export default async function EditLoadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireUser();

  if (session.user.role !== "BROKER") {
    redirect("/unauthorized");
  }

  const { id } = await params;

  const load = await prisma.load.findUnique({
    where: { id },
  });

  if (!load) {
    redirect("/dashboard/broker/brokerLoads");
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-6 text-zinc-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-5xl">

        <div className="inline-flex items-center mb-5 gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-950 dark:text-slate-400 dark:hover:text-white">
          <ArrowLeft size={16} />
          <BackButton />
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold">
            Edit Load
          </h1>

          <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">
            Update load #{load.referenceNumber}.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <EditLoadForm
            loadId={load.id}
            initialData={{
              referenceNumber: load.referenceNumber,
              originCity: load.originCity,
              originState: load.originState,
              destinationCity: load.destinationCity,
              destinationState: load.destinationState,
              equipmentType: load.equipmentType,
              weight: load.weight?.toString() ?? "",
              commodity: load.commodity ?? "",
              rate: Number(load.rate).toString(),
              distanceMiles: load.distanceMiles?.toString() ?? "",
              pickupDate: formatDateForInput(load.pickupDate),
              deliveryDate: load.deliveryDate
                ? formatDateForInput(load.deliveryDate)
                : "",
              notes: load.notes ?? "",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function formatDateForInput(date: Date) {
  return new Date(date).toISOString().slice(0, 16);
}