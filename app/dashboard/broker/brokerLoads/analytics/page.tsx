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

  const totalMiles = loads.reduce(
    (sum, load) => sum + (load.distanceMiles || 0),
    0
  );

  const averageRate = totalLoads > 0 ? totalRevenue / totalLoads : 0;
  const averageRatePerMile =
    totalMiles > 0 ? totalRevenue / totalMiles : 0;

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

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Loads"
            value={totalLoads.toString()}
            subtext={`${assignedLoads.length} assigned`}
            icon={<Truck size={18} />}
          />

          <StatCard
            label="Total Revenue"
            value={formatCurrency(totalRevenue)}
            subtext={`${formatCurrency(deliveredRevenue)} delivered`}
            icon={<DollarSign size={18} />}
          />

          <StatCard
            label="Average Rate"
            value={formatCurrency(averageRate)}
            subtext={`${formatCurrency(averageRatePerMile)} / mile`}
            icon={<BarChart3 size={18} />}
          />

          <StatCard
            label="Delivery Rate"
            value={`${deliveryRate}%`}
            subtext={`${deliveredLoads.length} delivered`}
            icon={<CheckCircle2 size={18} />}
          />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatusCard
            label="Posted"
            value={postedLoads.length}
            icon={<Clock size={16} />}
          />

          <StatusCard
            label="Booked"
            value={bookedLoads.length}
            icon={<Truck size={16} />}
          />

          <StatusCard
            label="In Transit"
            value={inTransitLoads.length}
            icon={<Route size={16} />}
          />

          <StatusCard
            label="Delivered"
            value={deliveredLoads.length}
            icon={<CheckCircle2 size={16} />}
          />

          <StatusCard
            label="Cancelled"
            value={cancelledLoads.length}
            icon={<Activity size={16} />}
          />
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
                    className="flex flex-col justify-between gap-2 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center dark:bg-slate-950"
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
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-950"
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
                value={formatCurrency(
                  postedLoads.reduce((sum, load) => sum + Number(load.rate), 0)
                )}
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

function StatCard({
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
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>

        <div className="rounded-lg bg-slate-100 p-2 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {subtext}
      </p>
    </div>
  );
}

function StatusCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        {icon}
        <p className="text-sm font-medium">{label}</p>
      </div>

      <p className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
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