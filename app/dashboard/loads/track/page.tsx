import { requireUser } from "@/lib/requireUser";
import prisma from "@/lib/prisma";
import LoadMap from "@/app/components/LoadMap";
import Link from "next/link";
import { ArrowLeft, Box, MapPin, Truck, Weight } from "lucide-react";
import { markDelivered } from "../myloads/action";

export default async function TrackLoadPage() {
  const session = await requireUser();

  if (!session.user?.email) {
    throw new Error("Unauthorized");
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  const activeLoad = await prisma.load.findFirst({
    where: {
      status: "IN_TRANSIT",
      bookings: {
        some: {
          driverId: dbUser.id,
        },
      },
    },
    include: {
      broker: true,
    },
    orderBy: {
      pickupDate: "asc",
    },
  });

  if (!activeLoad) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">
              No active load right now
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Start a booked trip to track it here.
            </p>

            <Link
              href="/dashboard/loads/myloads?status=BOOKED"
              className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Go to My Loads
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const rate = Number(activeLoad.rate);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* HEADER */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs text-slate-400">
              Load #{activeLoad.referenceNumber}
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              {activeLoad.originCity}, {activeLoad.originState} →{" "}
              {activeLoad.destinationCity}, {activeLoad.destinationState}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Currently in transit
            </p>
          </div>

          <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            IN TRANSIT
          </span>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          {/* LEFT */}
          <section className="space-y-6">
            {/* MAP */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="h-[520px]">
                <LoadMap loadId={activeLoad.id} className="h-full w-full" />
              </div>
            </div>

            {/* TIMELINE */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                Trip Progress
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <StepCard
                  label="Pickup"
                  title={`${activeLoad.originCity}, ${activeLoad.originState}`}
                  desc={formatDate(activeLoad.pickupDate)}
                  active
                />

                <StepCard
                  label="Current"
                  title="In Transit"
                  desc="Route is active"
                  active
                />

                <StepCard
                  label="Delivery"
                  title={`${activeLoad.destinationCity}, ${activeLoad.destinationState}`}
                  desc={formatDate(activeLoad.deliveryDate)}
                />
              </div>
            </div>
          </section>

          {/* RIGHT */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                Load Details
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <InfoRow
                  icon={<Truck size={16} />}
                  label="Equipment"
                  value={activeLoad.equipmentType}
                />

                <InfoRow
                  icon={<Weight size={16} />}
                  label="Weight"
                  value={
                    activeLoad.weight
                      ? `${activeLoad.weight.toLocaleString()} lbs`
                      : "—"
                  }
                />

                <InfoRow
                  icon={<Box size={16} />}
                  label="Commodity"
                  value={activeLoad.commodity || "General Freight"}
                />

                <InfoRow
                  icon={<MapPin size={16} />}
                  label="Distance"
                  value={
                    activeLoad.distanceMiles
                      ? `${activeLoad.distanceMiles.toLocaleString()} mi`
                      : "—"
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs text-slate-400">Rate</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                ${rate.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs text-slate-400">Broker</p>
              <p className="mt-1 font-medium text-slate-900">
                {activeLoad.broker?.name || "Broker"}
              </p>
              <p className="text-sm text-slate-500">
                {activeLoad.broker?.email}
              </p>
            </div>

            <div className="space-y-3">
              <form action={markDelivered.bind(null, activeLoad.id)}>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
                >
                  Mark Delivered
                </button>
              </form>

              <Link
                href={`/dashboard/loads/search/${activeLoad.id}`}
                className="block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                View Details
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function StepCard({
  label,
  title,
  desc,
  active,
}: {
  label: string;
  title: string;
  desc: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        active
          ? "border-blue-200 bg-blue-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span>{label}</span>
      </div>

      <p className="font-medium text-slate-900">{value}</p>
    </div>
  );
}

function formatDate(date: Date | string | null) {
  if (!date) return "No date";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}