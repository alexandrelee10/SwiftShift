import  prisma  from "@/lib/prisma";
import LoadSearchFilters from "@/app/components/LoadSearchFilters";
import Link from "next/link";
import {
  Bookmark,
  Bell,
  Box,
  ChevronDown,
  ChevronRight,
  Grid2X2,
  List,
  MapPin,
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
};

export default async function LoadSearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const origin = params.origin?.trim() || "";
  const destination = params.destination?.trim() || "";
  const equipment = params.equipment?.trim() || "";
  const minRate = params.minRate ? Number(params.minRate) : undefined;

  const loads = await prisma.load.findMany({
    where: {
      AND: [
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
    <main className="min-h-screen bg-slate-50 px-5 py-7 text-slate-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Find Loads
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Search and book the best loads for your route.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
              <Bookmark size={17} />
              Save Search
            </button>

            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
              <RefreshCw size={17} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          {/* LEFT SIDE */}
          <section className="space-y-5">
            <LoadSearchFilters />

            {/* Results Header */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium text-slate-900">
                  {loads.length} Loads Found
                </p>

                <div className="h-5 w-px bg-slate-200" />

                <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                  Sort by:{" "}
                  <span className="font-medium text-slate-900">
                    Newest
                  </span>
                  <ChevronDown size={16} />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                View
                <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <button className="bg-slate-100 p-2 text-slate-700">
                    <List size={17} />
                  </button>
                  <button className="p-2 text-slate-500">
                    <Grid2X2 size={17} />
                  </button>
                </div>
              </div>
            </div>

            {/* Load List */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {loads.length > 0 ? (
                loads.map((load) => <LoadRow key={load.id} load={load} />)
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm font-medium text-slate-900">
                    No loads found
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Try changing your search filters.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* RIGHT SIDE */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  Search Area
                </h2>
                <Maximize2 size={16} className="text-slate-500" />
              </div>

              <div className="relative h-[350px] overflow-hidden rounded-xl bg-[linear-gradient(120deg,#dbeafe,#ecfeff,#bfdbfe)]">
                <div className="absolute left-[48%] top-16 h-56 w-1 rotate-[-18deg] rounded-full bg-blue-600" />

                <div className="absolute left-[42%] top-14 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-md">
                  <MapPin size={19} fill="currentColor" />
                </div>

                <div className="absolute left-[50%] top-[38%] flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-md">
                  <Truck size={18} />
                </div>

                <div className="absolute bottom-16 right-24 flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white shadow-md">
                  <MapPin size={19} fill="currentColor" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-base font-semibold text-slate-900">
                Market Insights
              </h2>

              <InsightRow label="Average Rate" value="$2.28 / mi" trend="↑ 5.6%" />
              <InsightRow label="Load Volume" trend="+12.4%" />
              <InsightRow label="Best Time to Book" trend="Now" />
              <InsightRow label="Fuel Average" value="$3.72 / gal" />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="rounded-xl bg-blue-50 p-5">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-blue-600">
                    <Bell size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Get Notified
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Save this search and get notified when new matching loads
                      are posted.
                    </p>

                    <button className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-slate-50">
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
  const ratePerMile =
    load.rate && load.miles ? (load.rate / load.miles).toFixed(2) : null;

  return (
    <div className="grid items-center gap-4 border-b border-slate-100 px-5 py-4 hover:bg-slate-50 transition last:border-0 lg:grid-cols-[90px_1fr_140px_120px_auto]">
      
      {/* LEFT ID */}
      <div className="min-w-0">
        <p className="text-xs text-slate-400">Load</p>
        <p className="font-semibold text-slate-900 truncate">
          #{load.id.slice(0, 6)}
        </p>
      </div>

      {/* ROUTE */}
      <div className="min-w-0">
        <div className="grid items-center gap-3 md:grid-cols-[1fr_30px_1fr]">
          
          <LocationBlock
            label="Origin"
            city={load.originCity || "N/A"}
            state={load.originState || ""}
            time={formatDate(load.pickupDate)}
            color="bg-green-500"
          />

          <div className="hidden text-center text-slate-400 md:block">
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

        {/* DETAILS */}
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Truck size={14} /> {load.equipmentType || "Dry Van"}
          </span>

          <span className="flex items-center gap-1">
            <Weight size={14} />{" "}
            {load.weight ? load.weight.toLocaleString() : "—"} lbs
          </span>

          <span className="flex items-center gap-1">
            <Box size={14} /> {load.loadType || "FTL"}
          </span>
        </div>
      </div>

      {/* RATE */}
      <div className="text-right">
        <p className="text-lg font-semibold text-slate-900">
          ${load.rate ? load.rate.toLocaleString() : "—"}
        </p>
        {ratePerMile && (
          <p className="text-xs text-green-600">${ratePerMile}/mi</p>
        )}
      </div>

      {/* MILES */}
      <div className="text-right text-sm text-slate-600">
        {load.miles ? load.miles.toLocaleString() : "—"} mi
      </div>

      {/* ACTION */}
      <div className="flex justify-end gap-2">
        <button className="rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-100">
          <Bookmark size={16} />
        </button>

        <Link
          href={`/loads/${load.id}`}
          className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
        >
          View
        </Link>
      </div>
    </div>
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
        <p className="text-xs font-semibold uppercase text-slate-400">
          {label}
        </p>
      </div>

      {/* ✅ ONE LINE CITY */}
      <p className="truncate text-sm font-semibold text-slate-900">
        {city}
        {state && <span className="text-slate-500">, {state}</span>}
      </p>

      {/* ✅ ONE LINE DATE */}
      <p className="truncate text-xs text-slate-500">
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
      <p className="text-slate-500">{label}</p>

      <div className="flex items-center gap-2">
        {value && <p className="font-semibold text-slate-900">{value}</p>}
        {trend && <p className="font-semibold text-green-600">{trend}</p>}
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