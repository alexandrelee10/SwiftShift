import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LoadStatus, UserRole } from "@prisma/client";
import {
  ArrowUpRight,
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

  const totalRevenue = loads.reduce(
    (sum, load) => sum + Number(load.rate),
    0
  );

  const activeRevenue = activeLoads.reduce(
    (sum, load) => sum + Number(load.rate),
    0
  );

  const deliveredRevenue = deliveredLoads.reduce(
    (sum, load) => sum + Number(load.rate),
    0
  );

  const postedRevenue = postedLoads.reduce(
    (sum, load) => sum + Number(load.rate),
    0
  );

  const averageRate =
    loads.length > 0 ? Math.round(totalRevenue / loads.length) : 0;

  const deliveredPercent =
    totalRevenue > 0 ? Math.round((deliveredRevenue / totalRevenue) * 100) : 0;

  const activePercent =
    totalRevenue > 0 ? Math.round((activeRevenue / totalRevenue) * 100) : 0;

  const postedPercent =
    totalRevenue > 0 ? Math.round((postedRevenue / totalRevenue) * 100) : 0;

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
            href="/dashboard/broker/brokerLoads/postLoads"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <Plus size={16} />
            Add Load
          </Link>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
            <div className="border-b border-slate-100 p-6 dark:border-slate-800 lg:border-b-0 lg:border-r">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Total Estimated Revenue
                  </p>

                  <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                    {formatCurrency(totalRevenue)}
                  </h2>

                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    Across {loads.length} total loads with an average rate of{" "}
                    <span className="font-medium text-slate-900 dark:text-white">
                      {formatCurrency(averageRate)}
                    </span>
                    .
                  </p>
                </div>

                <div className="hidden rounded-2xl bg-green-50 p-3 text-green-700 dark:bg-green-950/40 dark:text-green-300 sm:block">
                  <DollarSign size={22} />
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <RevenueBar
                  label="Delivered"
                  value={formatCurrency(deliveredRevenue)}
                  percent={deliveredPercent}
                  width={`${deliveredPercent}%`}
                  tone="green"
                />

                <RevenueBar
                  label="Booked / In Transit"
                  value={formatCurrency(activeRevenue)}
                  percent={activePercent}
                  width={`${activePercent}%`}
                  tone="blue"
                />

                <RevenueBar
                  label="Posted"
                  value={formatCurrency(postedRevenue)}
                  percent={postedPercent}
                  width={`${postedPercent}%`}
                  tone="slate"
                />
              </div>
            </div>

            <div className="grid divide-y divide-slate-100 dark:divide-slate-800">
              <SummaryRow
                icon={<CheckCircle2 size={18} />}
                label="Delivered Revenue"
                value={formatCurrency(deliveredRevenue)}
                subtext={`${deliveredLoads.length} delivered loads`}
              />

              <SummaryRow
                icon={<Truck size={18} />}
                label="Active Revenue"
                value={formatCurrency(activeRevenue)}
                subtext={`${activeLoads.length} booked or in-transit loads`}
              />

              <SummaryRow
                icon={<Clock size={18} />}
                label="Posted Revenue"
                value={formatCurrency(postedRevenue)}
                subtext={`${postedLoads.length} loads awaiting coverage`}
              />

              <SummaryRow
                icon={<BarChart3 size={18} />}
                label="Average Rate"
                value={formatCurrency(averageRate)}
                subtext="Average revenue per load"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <PipelineCard
            title="Posted"
            value={formatCurrency(postedRevenue)}
            count={`${postedLoads.length} loads`}
            icon={<Clock size={17} />}
            href="/dashboard/broker/brokerLoads"
          />

          <PipelineCard
            title="Booked / In Transit"
            value={formatCurrency(activeRevenue)}
            count={`${activeLoads.length} loads`}
            icon={<Route size={17} />}
            href="/dashboard/broker/brokerLoads"
          />

          <PipelineCard
            title="Delivered"
            value={formatCurrency(deliveredRevenue)}
            count={`${deliveredLoads.length} loads`}
            icon={<Banknote size={17} />}
            href="/dashboard/broker/brokerLoads"
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center dark:border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                Revenue by Load
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Review each load’s rate, assigned driver, and current status.
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
                          Load #{load.referenceNumber || load.id.slice(0, 6)}
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

function SummaryRow({
  icon,
  label,
  value,
  subtext,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {label}
          </p>
          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
            {subtext}
          </p>
        </div>
      </div>

      <p className="shrink-0 text-sm font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function PipelineCard({
  title,
  value,
  count,
  icon,
  href,
}: {
  title: string;
  value: string;
  count: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900/60 dark:hover:bg-blue-950/20"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            {icon}
            <p className="text-sm font-medium">{title}</p>
          </div>

          <p className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white">
            {value}
          </p>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {count}
          </p>
        </div>

        <ArrowUpRight
          size={18}
          className="text-slate-400 transition group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400"
        />
      </div>
    </Link>
  );
}

function RevenueBar({
  label,
  value,
  percent,
  width,
  tone,
}: {
  label: string;
  value: string;
  percent: number;
  width: string;
  tone: "green" | "blue" | "slate";
}) {
  const barColor = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    slate: "bg-slate-400 dark:bg-slate-600",
  }[tone];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {label}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{value}</p>
        </div>

        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {percent}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className={`h-full rounded-full ${barColor}`} style={{ width }} />
      </div>
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