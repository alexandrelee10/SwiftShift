import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LoadStatus, UserRole } from "@prisma/client";
import {
  Banknote,
  BarChart3,
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  Route,
  Truck,
} from "lucide-react";

export default async function BrokerRevenuePage() {
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

  const loads = await prisma.load.findMany({
    where: {
      brokerId: broker.id,
      status: {
        in: [
          LoadStatus.POSTED,
          LoadStatus.BOOKED,
          LoadStatus.IN_TRANSIT,
          LoadStatus.DELIVERED,
        ],
      },
    },
    include: {
      trips: {
        include: {
          driver: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const activeLoads = loads.filter(
    (load) =>
      load.status === LoadStatus.BOOKED ||
      load.status === LoadStatus.IN_TRANSIT
  );

  const deliveredLoads = loads.filter(
    (load) => load.status === LoadStatus.DELIVERED
  );

  const postedLoads = loads.filter((load) => load.status === LoadStatus.POSTED);

  const totalRevenue = loads.reduce((sum, load) => {
    return sum + Number(load.rate);
  }, 0);

  const activeRevenue = activeLoads.reduce((sum, load) => {
    return sum + Number(load.rate);
  }, 0);

  const deliveredRevenue = deliveredLoads.reduce((sum, load) => {
    return sum + Number(load.rate);
  }, 0);

  const postedRevenue = postedLoads.reduce((sum, load) => {
    return sum + Number(load.rate);
  }, 0);

  const averageRate =
    loads.length > 0 ? Math.round(totalRevenue / loads.length) : 0;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8 dark:bg-[#0b1120] dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Broker dashboard
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Revenue
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Track estimated revenue across posted, booked, in-transit, and
              delivered loads.
            </p>
          </div>

          <Link
            href="/dashboard/broker/brokerLoads/add"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <Plus size={16} />
            Add Load
          </Link>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={<DollarSign size={18} />}
          />

          <StatCard
            label="Delivered Revenue"
            value={formatCurrency(deliveredRevenue)}
            icon={<CheckCircle2 size={18} />}
          />

          <StatCard
            label="Active Revenue"
            value={formatCurrency(activeRevenue)}
            icon={<Truck size={18} />}
          />

          <StatCard
            label="Average Rate"
            value={formatCurrency(averageRate)}
            icon={<BarChart3 size={18} />}
          />
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <MiniCard
            label="Posted"
            value={formatCurrency(postedRevenue)}
            subtext={`${postedLoads.length} loads`}
            icon={<Clock size={16} />}
          />

          <MiniCard
            label="Booked / In Transit"
            value={formatCurrency(activeRevenue)}
            subtext={`${activeLoads.length} loads`}
            icon={<Route size={16} />}
          />

          <MiniCard
            label="Delivered"
            value={formatCurrency(deliveredRevenue)}
            subtext={`${deliveredLoads.length} loads`}
            icon={<Banknote size={16} />}
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center dark:border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                Revenue by Load
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Review each load’s rate and current status.
              </p>
            </div>
          </div>

          {loads.length === 0 ? (
            <div className="py-16 text-center">
              <DollarSign
                size={38}
                className="mx-auto mb-3 text-slate-300 dark:text-slate-600"
              />

              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                No revenue data yet.
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Loads with rates will appear here once created.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {loads.map((load) => {
                const trip = load.trips[0];

                return (
                  <div
                    key={load.id}
                    className="grid gap-4 p-5 transition hover:bg-slate-50 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-center dark:hover:bg-slate-800/60"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-950 dark:text-white">
                          Load #{load.referenceNumber}
                        </p>

                        <StatusBadge status={load.status} />
                      </div>

                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {load.originCity}, {load.originState} →{" "}
                        {load.destinationCity}, {load.destinationState}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Equipment: {load.equipmentType}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Driver
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-800 dark:text-white">
                        {trip
                          ? `${trip.driver.firstName} ${trip.driver.lastName}`
                          : "Not assigned"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Rate
                      </p>

                      <p className="mt-1 text-lg font-semibold text-green-700 dark:text-green-300">
                        {formatCurrency(Number(load.rate))}
                      </p>
                    </div>

                    <div className="flex justify-start lg:justify-end">
                      <Link
                        href={`/dashboard/broker/brokerLoads/${load.id}`}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        View Load
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>

        <div className="rounded-lg bg-slate-100 p-2 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function MiniCard({
  label,
  value,
  subtext,
  icon,
}: {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        {icon}
        <p className="text-sm font-medium">{label}</p>
      </div>

      <p className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {subtext}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    POSTED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    BOOKED: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    IN_TRANSIT:
      "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
    DELIVERED:
      "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] ||
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
      }`}
    >
      {formatStatus(status)}
    </span>
  );
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}