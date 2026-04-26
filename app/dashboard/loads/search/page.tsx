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
  return (
    <div className="grid gap-4 border-b border-slate-100 px-5 py-5 last:border-0 lg:grid-cols-[110px_1fr_110px_100px_auto]">
      <div>
        <span className="rounded-md bg-blue-100 px-2 py-1 text-[11px] font-medium text-blue-600">
          AVAILABLE
        </span>

        <h3 className="mt-3 text-xl font-semibold text-slate-950">
          #{load.id.slice(0, 6)}
        </h3>

        <p className="mt-2 text-sm text-slate-500">Recently posted</p>
      </div>

      <div>
        <div className="grid gap-4 md:grid-cols-[1fr_30px_1fr] md:items-start">
          <LocationBlock
            city={`${load.pickupCity}, ${load.pickupState}`}
            time={formatDate(load.pickupDate)}
            color="bg-green-500"
          />

          <div className="hidden justify-center pt-3 text-slate-900 md:flex">
            →
          </div>

          <LocationBlock
            city={`${load.deliveryCity}, ${load.deliveryState}`}
            time={formatDate(load.deliveryDate)}
            color="bg-red-500"
          />
        </div>

        <div className="mt-7 grid gap-3 text-sm text-slate-500 sm:grid-cols-3">
          <span className="inline-flex items-center gap-2">
            <Truck size={16} /> {load.equipment}
          </span>

          <span className="inline-flex items-center gap-2">
            <Weight size={16} /> {load.weight?.toLocaleString()} lbs
          </span>

          <span className="inline-flex items-center gap-2">
            <Box size={16} /> {load.loadType || "Full Truckload"}
          </span>
        </div>
      </div>

      <div>
        <p className="text-xl font-semibold text-slate-950">
          ${load.rate?.toLocaleString()}
        </p>
        <p className="mt-2 text-sm text-slate-500">Rate</p>
      </div>

      <div>
        <p className="font-semibold text-slate-950">
          {load.miles?.toLocaleString()} mi
        </p>
        <p className="mt-2 text-sm text-slate-500">Distance</p>
      </div>

      <div className="flex items-center gap-3 lg:justify-end">
        <button className="rounded-lg border border-slate-200 bg-white p-3 text-slate-500 hover:bg-slate-50">
          <Bookmark size={18} />
        </button>

        <Link
          href={`/loads/${load.id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          View Details
          <ChevronRight size={17} />
        </Link>
      </div>
    </div>
  );
}

function LocationBlock({
  city,
  time,
  color,
}: {
  city: string;
  time: string;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <p className="font-semibold text-slate-900">{city}</p>
      </div>

      <p className="mt-2 pl-5 text-sm text-slate-500">{time}</p>
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