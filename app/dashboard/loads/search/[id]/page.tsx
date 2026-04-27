import { requireUser } from "@/lib/requireUser";
import prisma from "@/lib/prisma";
import LoadMap from "@/app/components/LoadMap";
import Link from "next/link";
import {
  ArrowLeft,
  Box,
  CalendarDays,
  MapPin,
  Truck,
  Weight,
} from "lucide-react";

export default async function LoadDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireUser();
  const { id } = await params;

  if (!session.user?.email) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!dbUser) throw new Error("User not found");

  const load = await prisma.load.findUnique({
    where: { id },
    include: { broker: true },
  });

  if (!load) throw new Error("Load not found");

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-7 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Back */}
        <Link
          href="/dashboard/loads/search"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        {/* Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs text-slate-400">
            #{load.referenceNumber || load.id.slice(0, 6)}
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-slate-950">
            {load.originCity}, {load.originState} → {load.destinationCity},{" "}
            {load.destinationState}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {load.equipmentType} • {load.commodity || "General Freight"}
          </p>
        </div>

        {/* Layout SAME as search page */}
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">

          {/* LEFT */}
          <section className="space-y-5">

            {/* Map */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-slate-900">
                Route Tracking
              </h2>

              <div className="h-[350px] overflow-hidden rounded-xl border border-slate-200">
                <LoadMap className="h-full w-full" />
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-slate-900">
                Timeline
              </h2>

              <TimelineItem
                label="Pickup"
                value={`${load.originCity}, ${load.originState}`}
                date={formatDate(load.pickupDate)}
              />

              <TimelineItem
                label="In Transit"
                value="Current trip"
                date={load.status === "IN_TRANSIT" ? "Active now" : "Pending"}
              />

              <TimelineItem
                label="Delivery"
                value={`${load.destinationCity}, ${load.destinationState}`}
                date={formatDate(load.deliveryDate)}
              />
            </div>
          </section>

          {/* RIGHT (same style as your search sidebar) */}
          <aside className="space-y-4">

            {/* Load Info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-slate-900">
                Load Details
              </h2>

              <DetailRow icon={<Truck size={16} />} label="Equipment" value={load.equipmentType} />
              <DetailRow icon={<Weight size={16} />} label="Weight" value={`${load.weight || "—"} lbs`} />
              <DetailRow icon={<Box size={16} />} label="Commodity" value={load.commodity || "General Freight"} />
              <DetailRow icon={<MapPin size={16} />} label="Distance" value={`${load.distanceMiles || "—"} mi`} />
              <DetailRow icon={<CalendarDays size={16} />} label="Pickup" value={formatDate(load.pickupDate)} />
              <DetailRow icon={<CalendarDays size={16} />} label="Delivery" value={formatDate(load.deliveryDate)} />
            </div>

            {/* Rate */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs text-slate-400">Rate</p>
              <p className="text-2xl font-semibold text-slate-950">
                ${Number(load.rate).toLocaleString()}
              </p>
            </div>

            {/* Actions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-slate-900">
                Actions
              </h2>

              {load.status === "BOOKED" && (
                <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">
                  Start Trip
                </button>
              )}

              {load.status === "IN_TRANSIT" && (
                <button className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm text-white">
                  Mark Delivered
                </button>
              )}
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}

/* COMPONENTS */

function TimelineItem({
  label,
  value,
  date,
}: {
  label: string;
  value: string;
  date: string;
}) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold uppercase text-slate-400">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{date}</p>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        {label}
      </div>
      <p className="font-medium text-slate-900">{value}</p>
    </div>
  );
}

function formatDate(date: Date | string | null) {
  if (!date) return "No date set";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}