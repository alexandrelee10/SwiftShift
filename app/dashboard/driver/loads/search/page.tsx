import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import LoadSearchFilters from "@/app/components/driver/loads/LoadSearchFilters";
import LoadMap from "@/app/components/driver/loads/LoadMap";
import RequestButton from "@/app/components/driver/loads/RequestLoadButton"
import Link from "next/link";
import {
  Bookmark,
  Bell,
  Box,
  ChevronDown,
  ChevronRight,
  Grid2X2,
  List,
  Maximize2,
  RefreshCw,
  Truck,
  Weight,
} from "lucide-react";

type SearchParams = {
  origin?: string;
  destination?: string;
  equipment?: string;
  minRate?: string;
  view?: "list" | "grid";
  sort?: "newest" | "rate-high" | "rate-low" | "distance-low";
};

export default async function LoadSearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await requireUser();
  const params = await searchParams;

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

  const origin = params.origin?.trim() || "";
  const destination = params.destination?.trim() || "";
  const equipment = params.equipment?.trim() || "";
  const minRate = params.minRate ? Number(params.minRate) : undefined;
  const view = params.view === "grid" ? "grid" : "list";

  const baseParams = new URLSearchParams();

  if (origin) baseParams.set("origin", origin);
  if (destination) baseParams.set("destination", destination);
  if (equipment) baseParams.set("equipment", equipment);
  if (params.minRate) baseParams.set("minRate", params.minRate);

  const listParams = new URLSearchParams(baseParams);
  listParams.set("view", "list");

  const gridParams = new URLSearchParams(baseParams);
  gridParams.set("view", "grid");

  const loads = await prisma.load.findMany({
    where: {
      AND: [
        {
          status: "POSTED",
          bookings: {
            none: {
              driverId: dbUser.id,
            },
          },
        },

        origin
          ? {
              OR: [
                { originCity: { contains: origin, mode: "insensitive" } },
                { originState: { contains: origin, mode: "insensitive" } },
              ],
            }
          : {},

        destination
          ? {
              OR: [
                {
                  destinationCity: {
                    contains: destination,
                    mode: "insensitive",
                  },
                },
                {
                  destinationState: {
                    contains: destination,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},

        equipment
          ? {
              equipmentType: {
                contains: equipment,
                mode: "insensitive",
              },
            }
          : {},

        minRate
          ? {
              rate: {
                gte: minRate,
              },
            }
          : {},
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 25,
  });

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-7 text-slate-900 dark:bg-[#0b1120] dark:text-slate-100">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Find Loads
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Search and book the best loads for your route.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              <Bookmark size={17} />
              Save Search
            </button>

            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              <RefreshCw size={17} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <section className="space-y-5">
            <LoadSearchFilters />

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {loads.length} Loads Found
                </p>

                <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

                <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
                  Sort by:{" "}
                  <span className="font-medium text-slate-900 dark:text-white">
                    Newest
                  </span>
                  <ChevronDown size={16} />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                View
                <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <Link
                    href={`?${listParams.toString()}`}
                    className={`p-2 transition ${
                      view === "list"
                        ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-white"
                        : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    <List size={17} />
                  </Link>

                  <Link
                    href={`?${gridParams.toString()}`}
                    className={`p-2 transition ${
                      view === "grid"
                        ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-white"
                        : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Grid2X2 size={17} />
                  </Link>
                </div>
              </div>
            </div>

            {loads.length > 0 ? (
              view === "grid" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {loads.map((load) => (
                    <LoadGridCard key={load.id} load={load} />
                  ))}
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  {loads.map((load) => (
                    <LoadRow key={load.id} load={load} />
                  ))}
                </div>
              )
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  No loads found
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Try changing your search filters.
                </p>
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Search Area
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Live route preview
                  </p>
                </div>

                <button className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                  <Maximize2 size={16} />
                </button>
              </div>

              <div className="h-[350px] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                <LoadMap className="h-full w-full" loadId={loads[0]?.id} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-5 text-base font-semibold text-slate-900 dark:text-white">
                Market Insights
              </h2>

              <InsightRow label="Average Rate" value="$2.28 / mi" trend="↑ 5.6%" />
              <InsightRow label="Load Volume" trend="+12.4%" />
              <InsightRow label="Best Time to Book" trend="Now" />
              <InsightRow label="Fuel Average" value="$3.72 / gal" />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="rounded-xl bg-blue-50 p-5 dark:bg-blue-950/30">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Bell size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Get Notified
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      Save this search and get notified when new matching loads
                      are posted.
                    </p>

                    <button className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-400 dark:hover:bg-slate-800">
                      Save Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function LoadRow({ load }: { load: any }) {
  const rate = Number(load.rate);
  const ratePerMile =
    rate && load.distanceMiles ? (rate / load.distanceMiles).toFixed(2) : null;

  return (
    <div className="grid items-center gap-4 border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50 last:border-0 lg:grid-cols-[90px_1fr_140px_120px_auto] dark:border-slate-800 dark:hover:bg-slate-800/60">
      <div className="min-w-0">
        <p className="text-xs text-slate-400 dark:text-slate-500">Load</p>
        <p className="truncate font-semibold text-slate-900 dark:text-white">
          #{load.referenceNumber || load.id.slice(0, 6)}
        </p>
      </div>

      <div className="min-w-0">
        <div className="grid items-center gap-3 md:grid-cols-[1fr_30px_1fr]">
          <LocationBlock
            label="Origin"
            city={load.originCity || "N/A"}
            state={load.originState || ""}
            time={formatDate(load.pickupDate)}
            color="bg-green-500"
          />

          <div className="hidden text-center text-slate-400 dark:text-slate-500 md:block">
            →
          </div>

          <LocationBlock
            label="Dest"
            city={load.destinationCity || "N/A"}
            state={load.destinationState || ""}
            time={formatDate(load.deliveryDate)}
            color="bg-red-500"
          />
        </div>

        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Truck size={14} /> {load.equipmentType || "Dry Van"}
          </span>

          <span className="flex items-center gap-1">
            <Weight size={14} />{" "}
            {load.weight ? load.weight.toLocaleString() : "—"} lbs
          </span>

          <span className="flex items-center gap-1">
            <Box size={14} /> {load.commodity || "General Freight"}
          </span>
        </div>
      </div>

      <div className="text-right">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">
          ${rate ? rate.toLocaleString() : "—"}
        </p>
        {ratePerMile && (
          <p className="text-xs text-green-600 dark:text-green-400">
            ${ratePerMile}/mi
          </p>
        )}
      </div>

      <div className="text-right text-sm text-slate-600 dark:text-slate-400">
        {load.distanceMiles ? load.distanceMiles.toLocaleString() : "—"} mi
      </div>

<div className="flex items-center justify-end gap-2">
  <Link
    href={`/dashboard/driver/loads/search/${load.id}`}
    className="
      inline-flex
      items-center
      justify-center
      rounded-md
      border
      border-slate-200
      px-3
      py-2
      text-xs
      font-medium
      text-slate-700
      transition
      hover:bg-slate-50
      dark:border-slate-700
      dark:text-slate-300
      dark:hover:bg-slate-800
    "
  >
    View
  </Link>
  <div className="
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
      text-white
      transition
      hover:bg-blue-500
      dark:border-slate-700
      dark:text-slate-300
      dark:hover:bg-blue-600
      ">
    <RequestButton loadId={load.id} />
  </div>
  
</div>
    </div>
  );
}

function LoadGridCard({ load }: { load: any }) {
  const rate = Number(load.rate);
  const ratePerMile =
    rate && load.distanceMiles ? (rate / load.distanceMiles).toFixed(2) : null;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Load</p>
          <h3 className="font-semibold text-slate-950 dark:text-white">
            #{load.referenceNumber || load.id.slice(0, 6)}
          </h3>
        </div>

        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/50 dark:text-green-300">
          Available
        </span>
      </div>

      <div className="space-y-3">
        <LocationBlock
          label="Origin"
          city={load.originCity || "N/A"}
          state={load.originState || ""}
          time={formatDate(load.pickupDate)}
          color="bg-green-500"
        />

        <div className="pl-1 text-slate-300 dark:text-slate-600">↓</div>

        <LocationBlock
          label="Dest"
          city={load.destinationCity || "N/A"}
          state={load.destinationState || ""}
          time={formatDate(load.deliveryDate)}
          color="bg-red-500"
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Rate</p>
          <p className="font-semibold text-slate-950 dark:text-white">
            ${rate ? rate.toLocaleString() : "—"}
          </p>
          {ratePerMile && (
            <p className="text-xs font-medium text-green-600 dark:text-green-400">
              ${ratePerMile}/mi
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Distance</p>
          <p className="font-semibold text-slate-950 dark:text-white">
            {load.distanceMiles ? load.distanceMiles.toLocaleString() : "—"} mi
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800 dark:text-slate-300">
          <Truck size={13} /> {load.equipmentType || "Dry Van"}
        </span>

        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800 dark:text-slate-300">
          <Weight size={13} />{" "}
          {load.weight ? load.weight.toLocaleString() : "—"} lbs
        </span>

        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800 dark:text-slate-300">
          <Box size={13} /> {load.commodity || "General Freight"}
        </span>
      </div>

      <div className="mt-5 flex gap-2">
        <button className="rounded-lg border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
          <Bookmark size={16} />
        </button>

        <Link
          href={`/dashboard/loads/search/${load.id}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          View Details
          <ChevronRight size={16} />
        </Link>
      </div>
    </article>
  );
}

function LocationBlock({
  label,
  city,
  state,
  time,
  color,
}: {
  label: string;
  city: string;
  state: string;
  time: string;
  color: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <p className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
          {label}
        </p>
      </div>

      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
        {city}
        {state && (
          <span className="text-slate-500 dark:text-slate-400">, {state}</span>
        )}
      </p>

      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
        {time}
      </p>
    </div>
  );
}

function InsightRow({
  label,
  value,
  trend,
}: {
  label: string;
  value?: string;
  trend?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between text-sm last:mb-0">
      <p className="text-slate-500 dark:text-slate-400">{label}</p>

      <div className="flex items-center gap-2">
        {value && (
          <p className="font-semibold text-slate-900 dark:text-white">
            {value}
          </p>
        )}
        {trend && (
          <p className="font-semibold text-green-600 dark:text-green-400">
            {trend}
          </p>
        )}
      </div>
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