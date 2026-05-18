import prisma from "@/lib/prisma";
import LoadMap from "@/app/components/loads/LoadMap";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  Box,
  CalendarDays,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Play,
  ShieldAlert,
  Truck,
  Weight,
  EyeIcon,
  FileText,
} from "lucide-react";

import { bookLoad } from "./action";
import BackButton from "@/app/components/shared/BackButton";

export default async function LoadDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const load = await prisma.load.findUnique({
    where: { id },
    include: {
      broker: true,
    },
  });

  if (!load) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 dark:bg-[#0b1120]">
        <p className="text-slate-700 dark:text-slate-300">Load not found.</p>
      </div>
    );
  }

  const rate = Number(load.rate);
  const ratePerMile =
    rate && load.distanceMiles ? (rate / load.distanceMiles).toFixed(2) : null;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-7 text-slate-900 dark:bg-[#0b1120] dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-5">
        <Link
          href="/dashboard/loads/search"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-950 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          <BackButton />
        </Link>

        <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    LOAD #{load.referenceNumber || load.id.slice(0, 6)}
                  </span>

                  <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                    {load.originCity}, {load.originState} →{" "}
                    {load.destinationCity}, {load.destinationState}
                  </h1>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <span className="inline-flex items-center gap-2">
                      <Truck size={16} />
                      {load.equipmentType}
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <Box size={16} />
                      {load.commodity || "General Freight"}
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <MapPin size={16} />
                      {load.distanceMiles || "—"} mi
                    </span>
                  </div>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-950/50 dark:text-green-300">
                  {formatStatus(load.status)}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Route Overview
                </h2>
              </div>

              <div className="h-[380px] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                <LoadMap loadId={id} className="h-full w-full" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Load Timeline
              </h2>

              <div className="mt-6 space-y-6">
                <TimelineItem
                  icon={<Package size={18} />}
                  color="bg-blue-600"
                  title="Pickup"
                  location={`${load.originCity}, ${load.originState}`}
                  address={load.originAddress}
                  date={formatDate(load.pickupDate)}
                />

                <TimelineItem
                  icon={<Truck size={18} />}
                  color="bg-green-600"
                  title="In Transit"
                  location="Current Location"
                  address={
                    load.status === "IN_TRANSIT"
                      ? "Live tracking active"
                      : "Trip has not started"
                  }
                  date={load.status === "IN_TRANSIT" ? "Live" : "Pending"}
                />

                <TimelineItem
                  icon={<Package size={18} />}
                  color="bg-purple-600"
                  title="Delivery"
                  location={`${load.destinationCity}, ${load.destinationState}`}
                  address={load.destinationAddress}
                  date={formatDate(load.deliveryDate)}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Load Details
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <DetailBox
                  icon={<Truck />}
                  label="Equipment"
                  value={load.equipmentType}
                />
                <DetailBox
                  icon={<Box />}
                  label="Commodity"
                  value={load.commodity || "General Freight"}
                />
                <DetailBox
                  icon={<Weight />}
                  label="Weight"
                  value={
                    load.weight ? `${load.weight.toLocaleString()} lbs` : "—"
                  }
                />
                <DetailBox
                  icon={<MapPin />}
                  label="Distance"
                  value={
                    load.distanceMiles
                      ? `${load.distanceMiles.toLocaleString()} mi`
                      : "—"
                  }
                />
                <DetailBox
                  icon={<CalendarDays />}
                  label="Pickup Date"
                  value={formatDate(load.pickupDate)}
                />
                <DetailBox
                  icon={<CalendarDays />}
                  label="Delivery Date"
                  value={formatDate(load.deliveryDate)}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Notes
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {load.notes || "No additional notes provided for this load."}
              </p>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Rate & Payment
              </h2>

              <p className="mt-6 text-3xl font-bold text-green-600 dark:text-green-400">
                ${rate.toLocaleString()}
              </p>

              {ratePerMile && (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  ${ratePerMile} / mi
                </p>
              )}

              <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm dark:border-slate-800">
                <SideRow
                  label="Base Rate"
                  value={`$${rate.toLocaleString()}`}
                />
                <SideRow label="Payment Terms" value="Net 30" />
                <SideRow label="Status" value={formatStatus(load.status)} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Broker Information
              </h2>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  {load.broker?.name?.[0] || "B"}
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {load.broker?.name || "Broker"}
                  </p>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    {load.broker?.email}
                  </p>
                </div>
              </div>

              <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800">
                <MessageSquare size={16} />
                Send Message
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Actions
              </h2>

              <div className="mt-5 space-y-3">
                <form action={bookLoad.bind(null, load.id)}>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                  >
                    <Play size={16} />
                    Book Now
                  </button>
                </form>

                <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800">
                  <Phone size={16} />
                  Call Broker
                </button>

                <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800">
                  <Bookmark size={16} />
                  Save Load
                </button>

                <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800">
                  <ShieldAlert size={16} />
                  Report Issue
                </button>

                <Link
                  href={`/dashboard/loads/search/${load.id}/bol`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800"
                >
                  <FileText size={16} />
                  Fill BOL
                </Link>

                <Link
                  href={`/dashboard/loads/search/${load.id}/bol/pdf`}
                  target="_blank"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800"
                >
                  <EyeIcon size={16} />
                  View BOL
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function TimelineItem({
  icon,
  color,
  title,
  location,
  address,
  date,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  location: string;
  address: string | null;
  date: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-[52px_1fr_auto] sm:items-center">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full text-white ${color}`}
      >
        {icon}
      </div>

      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {location}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {address || "No address provided"}
        </p>
      </div>

      <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 dark:bg-slate-950 dark:text-slate-300">
        {date}
      </div>
    </div>
  );
}

function DetailBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
      <div className="mb-2 text-blue-600 dark:text-blue-400">{icon}</div>
      <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
      <p className="font-medium text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function SideRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-slate-500 dark:text-slate-400">{label}</p>
      <p className="font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function formatDate(date: Date | string | null) {
  if (!date) return "No date set";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

