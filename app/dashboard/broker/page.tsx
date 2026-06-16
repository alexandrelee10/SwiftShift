import StatusPage from "@/app/components/shared/StatusPage";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Truck,
  Calendar,
  Landmark,
  Users,
  ClockCheck,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export default async function BrokerDashboardPage() {
  const session = await requireUser();

  if (!session.user.email) {
    return (
      <StatusPage
        title="Unauthorized"
        message="User is not authorized"
        ctaLabel="Sign in"
        ctaHref="/sign-in"
      />
    );
  }

  if (session.user.role !== "BROKER") {
    redirect("/unauthorized");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!dbUser) {
    return (
      <StatusPage
        title="User not found"
        message="This user was not found"
        ctaLabel="Sign in"
        ctaHref="/sign-in"
      />
    );
  }

  const activeLoads = await prisma.load.findMany({
    where: {
      brokerId: dbUser.id,
      status: "IN_TRANSIT",
    },
    orderBy: {
      pickupDate: "asc",
    },
  });

  const pendingLoads = await prisma.load.findMany({
    where: {
      brokerId: dbUser.id,
      status: "POSTED",
    },
    orderBy: {
      pickupDate: "asc",
    },
  });

  const deliveredLoads = await prisma.load.findMany({
    where: {
      brokerId: dbUser.id,
      status: "DELIVERED",
    },
    orderBy: {
      pickupDate: "desc",
    },
  });

  const availableDrivers = await prisma.user.findMany({
    where: {
      role: "DRIVER",
    },
    take: 5,
  });

  const totalEarnings = deliveredLoads.reduce((total, load) => {
    return total + Number(load.rate);
  }, 0);

  const urgentLoads = pendingLoads
    .filter((load) => {
      if (!load.pickupDate) return false;

      const pickupDate = new Date(load.pickupDate);
      const now = new Date();
      const diffInHours =
        (pickupDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      return diffInHours <= 48;
    })
    .slice(0, 4);

  const upcomingLoads = [...pendingLoads, ...activeLoads]
    .sort(
      (a, b) =>
        new Date(a.pickupDate).getTime() - new Date(b.pickupDate).getTime()
    )
    .slice(0, 5);

  const upperIcons = [
    {
      name: "Active Loads",
      content: activeLoads.length,
      status: activeLoads.length > 0 ? "In Transit" : "No active loads",
      icon: Truck,
      color:
        "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
    },
    {
      name: "Pending Bookings",
      content: pendingLoads.length,
      status: pendingLoads.length > 0 ? "Pending Loads" : "No loads pending",
      icon: Calendar,
      color:
        "bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-300",
    },
    {
      name: "Revenue",
      content: `$${totalEarnings.toLocaleString()}`,
      status:
        deliveredLoads.length > 0
          ? `${deliveredLoads.length} delivered loads`
          : "No earnings yet",
      icon: Landmark,
      color:
        "bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-300",
    },
    {
      name: "Available Drivers",
      content: availableDrivers.length,
      status:
        availableDrivers.length > 0
          ? "Drivers on platform"
          : "No drivers available",
      icon: Users,
      color:
        "bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-300",
    },
    {
      name: "On-Time Delivery",
      content: "90%",
      status: "Based on last 30 deliveries",
      icon: ClockCheck,
      color:
        "bg-cyan-100 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-300",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="min-w-0 p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Good morning, {session.user?.name || "Broker"}
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">
                Here&apos;s what&apos;s happening with your brokerage today.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/broker/brokerLoads/postLoads"
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                + Post New Load
              </Link>
            </div>
          </div>

          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Operations Summary
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">
                  Quick snapshot of your brokerage performance.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {upperIcons.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.name}
                      className="rounded-xl bg-zinc-50 p-4 dark:bg-slate-950"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-slate-400">
                          {item.name}
                        </p>

                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.color}`}
                        >
                          <Icon size={16} />
                        </div>
                      </div>

                      <p className="mt-3 text-xl font-semibold text-zinc-950 dark:text-white">
                        {item.content}
                      </p>

                      <p className="mt-1 line-clamp-1 text-xs text-zinc-400 dark:text-slate-500">
                        {item.status}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
            <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-slate-800">
                <h3 className="font-semibold">Dispatch Board</h3>
                <Link
                  href="/dashboard/broker/loads"
                  className="text-sm text-blue-600 dark:text-blue-400"
                >
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
                <LoadColumn
                  title="Posted"
                  count={pendingLoads.length}
                  loads={pendingLoads.slice(0, 3)}
                  status="posted"
                />
                <LoadColumn title="Booked" count={0} loads={[]} status="booked" />
                <LoadColumn
                  title="In Transit"
                  count={activeLoads.length}
                  loads={activeLoads.slice(0, 3)}
                  status="transit"
                />
                <LoadColumn
                  title="Delivered"
                  count={deliveredLoads.length}
                  loads={deliveredLoads.slice(0, 3)}
                  status="delivered"
                />
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-slate-800">
                <div>
                  <h3 className="font-semibold">Broker Priorities</h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-slate-400">
                    Loads needing attention, coverage, or follow-up.
                  </p>
                </div>

                <Link
                  href="/dashboard/broker/brokerLoads"
                  className="text-sm text-blue-600 dark:text-blue-400"
                >
                  Manage
                </Link>
              </div>

              <div className="space-y-5 p-5">
                <div className="grid gap-3 sm:grid-cols-3">
                  <PriorityStat
                    label="Needs Coverage"
                    value={pendingLoads.length.toString()}
                  />
                  <PriorityStat
                    label="Urgent Pickups"
                    value={urgentLoads.length.toString()}
                  />
                  <PriorityStat
                    label="Active Today"
                    value={activeLoads.length.toString()}
                  />
                </div>

                <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/50 dark:bg-orange-950/20">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-300">
                      <AlertTriangle size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                        Coverage Reminder
                      </p>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-slate-400">
                        Prioritize posted loads with pickup dates within the
                        next 48 hours.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold">
                      Upcoming Broker Actions
                    </h4>
                    <span className="text-xs text-zinc-400 dark:text-slate-500">
                      Next {upcomingLoads.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {upcomingLoads.length > 0 ? (
                      upcomingLoads.map((load) => (
                        <Link
                          key={load.id}
                          href={`/dashboard/broker/brokerLoads/load/${load.id}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 p-3 transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-800 dark:hover:border-blue-900/60 dark:hover:bg-blue-950/20"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {load.originCity}, {load.originState} →{" "}
                              {load.destinationCity}, {load.destinationState}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500 dark:text-slate-400">
                              #{load.referenceNumber || load.id.slice(0, 6)} •{" "}
                              {formatDate(load.pickupDate)}
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-slate-800 dark:text-slate-300">
                              {formatStatus(load.status)}
                            </span>
                            <ArrowRight
                              size={15}
                              className="text-zinc-400 dark:text-slate-500"
                            />
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-zinc-200 p-6 text-center text-sm text-zinc-500 dark:border-slate-800 dark:text-slate-400">
                        No upcoming broker actions right now.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <CardTitle
                title="Recent Bookings"
                href="/dashboard/broker/bookings"
              />

              <div className="space-y-3">
                {[...activeLoads, ...pendingLoads, ...deliveredLoads]
                  .slice(0, 5)
                  .map((load) => (
                    <div
                      key={load.id}
                      className="flex items-center justify-between border-b border-zinc-100 pb-3 last:border-0 dark:border-slate-800"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {load.originCity}, {load.originState} →{" "}
                          {load.destinationCity}, {load.destinationState}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-slate-400">
                          Load #{load.referenceNumber}
                        </p>
                      </div>

                      <p className="text-sm font-semibold">
                        ${Number(load.rate).toLocaleString()}
                      </p>
                    </div>
                  ))}
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <CardTitle
                title="Driver Availability"
                href="/dashboard/broker/drivers"
              />

              <div className="space-y-3">
                {availableDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="flex items-center justify-between border-b border-zinc-100 pb-3 last:border-0 dark:border-slate-800"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {driver.firstName} {driver.lastName}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-slate-400">
                        {driver.email}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950/50 dark:text-green-300">
                      Available
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <CardTitle title="Load Performance" />

              <div className="space-y-4">
                <StatRow
                  label="Total Loads"
                  value={(
                    activeLoads.length +
                    pendingLoads.length +
                    deliveredLoads.length
                  ).toString()}
                />
                <StatRow
                  label="Delivered"
                  value={deliveredLoads.length.toString()}
                />
                <StatRow label="On-Time" value="90%" />
                <StatRow
                  label="Revenue"
                  value={`$${totalEarnings.toLocaleString()}`}
                />

                <div className="mt-4 rounded-xl bg-zinc-100 p-4 dark:bg-slate-800">
                  <p className="text-xs text-zinc-500 dark:text-slate-400">
                    Delivery rate
                  </p>
                  <div className="mt-3 h-2 rounded-full bg-zinc-200 dark:bg-slate-700">
                    <div className="h-2 w-[90%] rounded-full bg-green-500" />
                  </div>
                  <p className="mt-2 text-xs text-zinc-500 dark:text-slate-400">
                    90% on-time performance
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function PriorityStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs text-zinc-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function CardTitle({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-semibold">{title}</h3>
      {href && (
        <Link href={href} className="text-sm text-blue-600 dark:text-blue-400">
          View All
        </Link>
      )}
    </div>
  );
}

function LoadColumn({
  title,
  count,
  loads,
  status,
}: {
  title: string;
  count: number;
  loads: any[];
  status: "posted" | "booked" | "transit" | "delivered";
}) {
  const topBorder = {
    posted: "border-t-2 border-t-zinc-400",
    booked: "border-t-2 border-t-blue-500",
    transit: "border-t-2 border-t-amber-500",
    delivered: "border-t-2 border-t-green-600",
  }[status];

  const labelColor = {
    posted: "text-zinc-500 dark:text-zinc-400",
    booked: "text-blue-600 dark:text-blue-400",
    transit: "text-amber-600 dark:text-amber-400",
    delivered: "text-green-700 dark:text-green-400",
  }[status];

  const dotColor = {
    posted: "bg-zinc-400",
    booked: "bg-blue-500",
    transit: "bg-amber-500",
    delivered: "bg-green-600",
  }[status];

  const statusLabel = {
    posted: null,
    booked: null,
    transit: "Pending",
    delivered: "Delivered",
  }[status];

  const statusTextColor = {
    transit: "text-amber-600 dark:text-amber-400",
    delivered: "text-green-700 dark:text-green-400",
  }[status as "transit" | "delivered"];

  return (
    <div
      className={`flex flex-col gap-2 rounded-xl bg-zinc-50 p-3 dark:bg-slate-950 ${topBorder}`}
    >
      <div className="mb-1 flex items-center justify-between">
        <p
          className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ${labelColor}`}
        >
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotColor}`} />
          {title}
        </p>
        <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {count}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {loads.length > 0 ? (
          loads.map((load) => (
            <div
              key={load.id}
              className="cursor-pointer rounded-lg border border-zinc-200 bg-white p-3 transition-colors hover:border-zinc-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <p className="mb-1 text-xs text-zinc-400 dark:text-slate-500">
                #{load.referenceNumber}
              </p>
              <p className="text-xs font-semibold leading-snug">
                {load.originCity}, {load.originState} →{" "}
                {load.destinationCity}, {load.destinationState}
              </p>
              <p className="mt-1 truncate text-xs text-zinc-400 dark:text-slate-500">
                {load.commodity || "General freight"}
              </p>
              <div className="mt-2">
                <p className="text-sm font-semibold">
                  ${Number(load.rate).toLocaleString()}
                </p>

                <p
                  className={`mt-1 text-xs ${statusLabel
                      ? statusTextColor
                      : "text-zinc-400 dark:text-slate-500"
                    }`}
                >
                  {statusLabel || formatDate(load.pickupDate)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="py-5 text-center text-xs text-zinc-400 dark:text-slate-600">
            No loads
          </p>
        )}
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-zinc-500 dark:text-slate-400">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function formatDate(date: Date | string | null) {
  if (!date) return "No date";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}