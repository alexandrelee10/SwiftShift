import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";
import { LoadStatus, UserRole } from "@prisma/client";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPinned,
  Route,
  Truck,
} from "lucide-react";

export default async function BrokerAnalyticsPage() {
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

  const totalLoads = loads.length;
  const postedLoads = loads.filter((load) => load.status === LoadStatus.POSTED);
  const bookedLoads = loads.filter((load) => load.status === LoadStatus.BOOKED);
  const inTransitLoads = loads.filter(
    (load) => load.status === LoadStatus.IN_TRANSIT
  );
  const deliveredLoads = loads.filter(
    (load) => load.status === LoadStatus.DELIVERED
  );
  const cancelledLoads = loads.filter(
    (load) => load.status === LoadStatus.CANCELLED
  );

  const assignedLoads = loads.filter((load) => load.trips.length > 0);

  const totalRevenue = loads.reduce(
    (sum, load) => sum + Number(load.rate),
    0
  );

  const deliveredRevenue = deliveredLoads.reduce(
    (sum, load) => sum + Number(load.rate),
    0
  );

  const activeRevenue = [...bookedLoads, ...inTransitLoads].reduce(
    (sum, load) => sum + Number(load.rate),
    0
  );

  const postedRevenue = postedLoads.reduce(
    (sum, load) => sum + Number(load.rate),
    0
  );

  const totalMiles = loads.reduce(
    (sum, load) => sum + (load.distanceMiles || 0),
    0
  );

  const averageRate = totalLoads > 0 ? totalRevenue / totalLoads : 0;
  const averageRatePerMile = totalMiles > 0 ? totalRevenue / totalMiles : 0;

  const assignmentRate =
    totalLoads > 0 ? Math.round((assignedLoads.length / totalLoads) * 100) : 0;

  const deliveryRate =
    totalLoads > 0
      ? Math.round((deliveredLoads.length / totalLoads) * 100)
      : 0;

  const cancellationRate =
    totalLoads > 0
      ? Math.round((cancelledLoads.length / totalLoads) * 100)
      : 0;

  const topLanes = Object.values(
    loads.reduce<
      Record<
        string,
        {
          lane: string;
          loads: number;
          revenue: number;
        }
      >
    >((acc, load) => {
      const lane = `${load.originCity}, ${load.originState} → ${load.destinationCity}, ${load.destinationState}`;

      if (!acc[lane]) {
        acc[lane] = {
          lane,
          loads: 0,
          revenue: 0,
        };
      }

      acc[lane].loads += 1;
      acc[lane].revenue += Number(load.rate);

      return acc;
    }, {})
  )
    .sort((a, b) => b.loads - a.loads)
    .slice(0, 5);

  const topDrivers = Object.values(
    loads.reduce<
      Record<
        string,
        {
          driver: string;
          loads: number;
          revenue: number;
        }
      >
    >((acc, load) => {
      const trip = load.trips[0];

      if (!trip?.driver) {
        return acc;
      }

      const driverName = `${trip.driver.firstName} ${trip.driver.lastName}`;

      if (!acc[trip.driverId]) {
        acc[trip.driverId] = {
          driver: driverName,
          loads: 0,
          revenue: 0,
        };
      }

      acc[trip.driverId].loads += 1;
      acc[trip.driverId].revenue += Number(load.rate);

      return acc;
    }, {})
  )
    .sort((a, b) => b.loads - a.loads)
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8 dark:bg-[#0b1120] dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Broker dashboard
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Analytics
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            View load performance, revenue, lane activity, and dispatch
            efficiency.
          </p>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid lg:grid-cols-[1.15fr_1fr]">
            <div className="border-b border-slate-100 p-6 dark:border-slate-800 lg:border-b-0 lg:border-r">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Total Brokerage Activity
                  </p>

                  <h2 className="mt-3 text-5xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    {totalLoads}
                  </h2>

                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    Loads tracked with{" "}
                    <span className="font-medium text-slate-900 dark:text-white">
                      {assignedLoads.length}
                    </span>{" "}
                    assigned and{" "}
                    <span className="font-medium text-slate-900 dark:text-white">
                      {deliveredLoads.length}
                    </span>{" "}
                    delivered.
                  </p>
                </div>

                <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                  <BarChart3 size={24} />
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <HealthBox label="Assignment" value={`${assignmentRate}%`} />
                <HealthBox label="Delivery" value={`${deliveryRate}%`} />
                <HealthBox label="Cancel Rate" value={`${cancellationRate}%`} />
              </div>

              <div className="mt-8 space-y-4">
                <ProgressRow
                  label="Assignment Rate"
                  value={`${assignmentRate}%`}
                  width={`${assignmentRate}%`}
                  tone="blue"
                />

                <ProgressRow
                  label="Delivery Rate"
                  value={`${deliveryRate}%`}
                  width={`${deliveryRate}%`}
                  tone="green"
                />

                <ProgressRow
                  label="Cancellation Rate"
                  value={`${cancellationRate}%`}
                  width={`${cancellationRate}%`}
                  tone="red"
                />
              </div>
            </div>

            <div className="grid divide-y divide-slate-100 dark:divide-slate-800">
              <SummaryRow
                icon={<DollarSign size={18} />}
                label="Total Revenue"
                value={formatCurrency(totalRevenue)}
                subtext={`${formatCurrency(deliveredRevenue)} delivered`}
              />

              <SummaryRow
                icon={<BarChart3 size={18} />}
                label="Average Rate"
                value={formatCurrency(averageRate)}
                subtext={`${formatCurrency(averageRatePerMile)} per mile`}
              />

              <SummaryRow
                icon={<Truck size={18} />}
                label="Active Revenue"
                value={formatCurrency(activeRevenue)}
                subtext={`${bookedLoads.length + inTransitLoads.length} active loads`}
              />

              <SummaryRow
                icon={<Clock size={18} />}
                label="Posted Revenue"
                value={formatCurrency(postedRevenue)}
                subtext={`${postedLoads.length} posted loads`}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-950 dark:text-white">
                Load Status Breakdown
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Current load movement across your brokerage pipeline.
              </p>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {totalLoads} total loads
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-5">
            <PipelineSegment
              label="Posted"
              value={postedLoads.length}
              icon={<Clock size={16} />}
              tone="slate"
            />
            <PipelineSegment
              label="Booked"
              value={bookedLoads.length}
              icon={<Truck size={16} />}
              tone="blue"
            />
            <PipelineSegment
              label="In Transit"
              value={inTransitLoads.length}
              icon={<Route size={16} />}
              tone="purple"
            />
            <PipelineSegment
              label="Delivered"
              value={deliveredLoads.length}
              icon={<CheckCircle2 size={16} />}
              tone="green"
            />
            <PipelineSegment
              label="Cancelled"
              value={cancelledLoads.length}
              icon={<Activity size={16} />}
              tone="red"
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-blue-600 dark:text-blue-400" />
              <h2 className="font-semibold text-slate-950 dark:text-white">
                Operational Health
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              <MetricRow label="Assignment Rate" value={`${assignmentRate}%`} />
              <MetricRow label="Delivery Rate" value={`${deliveryRate}%`} />
              <MetricRow
                label="Cancellation Rate"
                value={`${cancellationRate}%`}
              />
              <MetricRow
                label="Active Revenue"
                value={formatCurrency(activeRevenue)}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <MapPinned
                size={18}
                className="text-blue-600 dark:text-blue-400"
              />
              <h2 className="font-semibold text-slate-950 dark:text-white">
                Top Lanes
              </h2>
            </div>

            {topLanes.length === 0 ? (
              <EmptySmall text="No lane data available yet." />
            ) : (
              <div className="mt-5 space-y-3">
                {topLanes.map((lane) => (
                  <div
                    key={lane.lane}
                    className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-[1fr_auto] sm:items-center dark:bg-slate-950"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {lane.lane}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {lane.loads} loads
                      </p>
                    </div>

                    <p className="font-semibold text-green-700 dark:text-green-300">
                      {formatCurrency(lane.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-semibold text-slate-950 dark:text-white">
              Top Drivers
            </h2>

            {topDrivers.length === 0 ? (
              <EmptySmall text="No assigned driver data yet." />
            ) : (
              <div className="mt-5 space-y-3">
                {topDrivers.map((driver) => (
                  <div
                    key={driver.driver}
                    className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-[1fr_auto] sm:items-center dark:bg-slate-950"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {driver.driver}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {driver.loads} loads
                      </p>
                    </div>

                    <p className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(driver.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-semibold text-slate-950 dark:text-white">
              Revenue Summary
            </h2>

            <div className="mt-5 space-y-4">
              <MetricRow
                label="Posted Revenue"
                value={formatCurrency(postedRevenue)}
              />

              <MetricRow
                label="Active Revenue"
                value={formatCurrency(activeRevenue)}
              />

              <MetricRow
                label="Delivered Revenue"
                value={formatCurrency(deliveredRevenue)}
              />

              <MetricRow
                label="Total Potential Revenue"
                value={formatCurrency(totalRevenue)}
              />
            </div>
          </div>
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

function HealthBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function PipelineSegment({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "slate" | "blue" | "purple" | "green" | "red";
}) {
  const styles = {
    slate:
      "bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300",
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    purple:
      "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
    green:
      "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300",
    red: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  }[tone];

  return (
    <div className={`rounded-2xl p-4 ${styles}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{label}</p>
        {icon}
      </div>

      <p className="mt-4 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  width,
  tone,
}: {
  label: string;
  value: string;
  width: string;
  tone: "blue" | "green" | "red";
}) {
  const color = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
  }[tone];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {label}
        </p>

        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className={`h-full rounded-full ${color}`} style={{ width }} />
      </div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function EmptySmall({ text }: { text: string }) {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
      {text}
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}