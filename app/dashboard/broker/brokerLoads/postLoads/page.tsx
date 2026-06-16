import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { LoadStatus, UserRole } from "@prisma/client";
import BackButton from "@/app/components/shared/BackButton";

async function postLoad(formData: FormData) {
  "use server";

  const session = await requireUser();

  if (!session.user?.email) {
    throw new Error("Unauthorized");
  }

  const broker = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!broker) {
    throw new Error("User not found");
  }

  if (broker.role !== UserRole.BROKER) {
    redirect("/unauthorized");
  }

  await prisma.load.create({
    data: {
      brokerId: broker.id,
      referenceNumber: `SS-${Date.now()}`,

      originCity: formData.get("originCity")?.toString() || "",
      originState: formData.get("originState")?.toString() || "",
      originAddress: formData.get("originAddress")?.toString() || "",

      destinationCity: formData.get("destinationCity")?.toString() || "",
      destinationState: formData.get("destinationState")?.toString() || "",
      destinationAddress:
        formData.get("destinationAddress")?.toString() || "",

      pickupDate: new Date(formData.get("pickupDate")?.toString() || ""),
      deliveryDate: formData.get("deliveryDate")
        ? new Date(formData.get("deliveryDate")?.toString() || "")
        : null,

      equipmentType: formData.get("equipmentType")?.toString() || "",
      weight: formData.get("weight") ? Number(formData.get("weight")) : null,
      commodity: formData.get("commodity")?.toString() || null,
      rate: Number(formData.get("rate") || 0),
      distanceMiles: formData.get("distanceMiles")
        ? Number(formData.get("distanceMiles"))
        : null,
      notes: formData.get("notes")?.toString() || null,

      status: LoadStatus.POSTED,
    },
  });

  revalidatePath("/dashboard/broker");
  revalidatePath("/dashboard/broker/brokerLoads");
  revalidatePath("/dashboard/broker/brokerLoads/assign");

  redirect("/dashboard/broker/brokerLoads/load");
}

export default async function PostLoadPage() {
  const session = await requireUser();

  if (!session.user?.email) {
    throw new Error("Unauthorized");
  }

  const broker = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!broker) {
    throw new Error("User not found");
  }

  if (broker.role !== UserRole.BROKER) {
    redirect("/unauthorized");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 dark:bg-[#0b1120] dark:text-slate-100">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <Link
            href="/dashboard/broker"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft size={16} />
            <BackButton />
          </Link>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Post a Load
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create a new load for drivers to request or for your brokerage to
            assign.
          </p>
        </div>

        <form
          action={postLoad}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="grid gap-8">
            <section>
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                Pickup Information
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input name="originCity" label="Origin city" required />
                <Input name="originState" label="Origin state" required />

                <Input
                  name="originAddress"
                  label="Origin address"
                  required
                  className="sm:col-span-2"
                />

                <Input
                  name="pickupDate"
                  label="Pickup date"
                  type="datetime-local"
                  required
                />
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                Delivery Information
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input
                  name="destinationCity"
                  label="Destination city"
                  required
                />

                <Input
                  name="destinationState"
                  label="Destination state"
                  required
                />

                <Input
                  name="destinationAddress"
                  label="Destination address"
                  required
                  className="sm:col-span-2"
                />

                <Input
                  name="deliveryDate"
                  label="Delivery date"
                  type="datetime-local"
                />
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                Load Details
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input name="equipmentType" label="Equipment type" required />
                <Input name="commodity" label="Commodity" />
                <Input name="weight" label="Weight" type="number" />
                <Input
                  name="distanceMiles"
                  label="Distance miles"
                  type="number"
                />
                <Input name="rate" label="Rate" type="number" required />

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    rows={4}
                    placeholder="Pickup instructions, delivery notes, appointment details, etc."
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard/broker"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <PlusCircle size={16} />
              Post Load
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Input({
  name,
  label,
  type = "text",
  required = false,
  className = "",
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
    </div>
  );
}