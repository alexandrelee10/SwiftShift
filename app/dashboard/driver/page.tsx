import { requireUser } from "@/lib/requireUser";
import prisma from "@/lib/prisma";
import { Truck, CircleCheckBig, Landmark, FuelIcon } from "lucide-react";
import LoadMap from "../../components/driver/loads/LoadMap";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DriverDashboardPage() {
  const session = await requireUser();

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

  if (session.user.role !== "DRIVER") {
    redirect("/unauthorized");
  }

  const upcomingLoads = await prisma.load.findMany({
    where: {
      status: "IN_TRANSIT",
      bookings: {
        some: {
          driverId: dbUser.id,
        },
      },
    },
    orderBy: {
      pickupDate: "asc",
    },
  });

  const approvedLoads = await prisma.load.findMany({
    where: {
      status: "BOOKED",
      bookings: {
        some: {
          driverId: dbUser.id,
        },
      },
    },
    include: {
      broker: true,
    },
    orderBy: {
      pickupDate: "asc",
    },
    take: 2,
  });

  const activeLoad = await prisma.load.findFirst({
    where: {
      status: "IN_TRANSIT",
      bookings: {
        some: {
          driverId: dbUser.id,
        },
      },
    },
    include: {
      broker: true,
    },
    orderBy: {
      pickupDate: "asc",
    },
  });

  const deliveredLoads = await prisma.load.findMany({
    where: {
      status: "DELIVERED",
      bookings: {
        some: {
          driverId: dbUser.id,
        },
      },
    },
    include: {
      broker: true,
    },
    orderBy: {
      pickupDate: "desc",
    },
  });

  const totalEarnings = deliveredLoads.reduce((total, load) => {
    return total + Number(load.rate);
  }, 0);

  const averageRate =
    deliveredLoads.length > 0 ? totalEarnings / deliveredLoads.length : 0;

  const latestDeliveredLoad = deliveredLoads[0];

  const upperIcons = [
    {
      name: "Active Loads",
      content: activeLoad ? 1 : 0,
      status: activeLoad ? "In Transit" : "No active load",
      icon: Truck,
      color:
        "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
    },
    {
      name: "Delivered",
      content: deliveredLoads.length,
      status:
        deliveredLoads.length > 0 ? "Deliveries Completed" : "None Delivered",
      icon: CircleCheckBig,
      color:
        "bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-300",
    },
    {
      name: "Earnings",
      content: `$${totalEarnings.toLocaleString()}`,
      status:
        deliveredLoads.length > 0
          ? `${deliveredLoads.length} delivered loads`
          : "No Earnings Yet",
      icon: Landmark,
      color:
        "bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-300",
    },
    {
      name: "Fuel Spending",
      content: "$3,123",
      status: "-10% vs last 30d",
      icon: FuelIcon,
      color:
        "bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-300",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="min-w-0 p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-slate-100">
              Welcome, {session.user?.name || "Driver"}!
            </h2>
            <p className="text-sm text-zinc-500 dark:text-slate-400">
              Here&apos;s what&apos;s happening with your loads today.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {upperIcons.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}
                  >
                    <Icon size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-zinc-500 dark:text-slate-400">
                      {item.name}
                    </p>
                    <p className="text-lg font-semibold text-zinc-900 dark:text-slate-100">
                      {item.content}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-slate-500">
                      {item.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <section className="space-y-5">
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-slate-100">
                      Active Load
                    </h2>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-medium text-green-700 dark:bg-green-950/50 dark:text-green-300">
                      {activeLoad ? "IN TRANSIT" : "NONE"}
                    </span>
                  </div>

                  <Link
                    href="/dashboard/myloads?status=IN_TRANSIT"
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View All Loads
                  </Link>
                </div>

                {activeLoad ? (
                  <div className="grid lg:grid-cols-[310px_1fr]">
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-slate-100">
                        Load #{activeLoad.referenceNumber}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-slate-300">
                        <span>
                          {activeLoad.originCity}, {activeLoad.originState}
                        </span>
                        <span className="text-zinc-400 dark:text-slate-600">
                          →
                        </span>
                        <span>
                          {activeLoad.destinationCity},{" "}
                          {activeLoad.destinationState}
                        </span>
                      </div>

                      <div className="mt-6 space-y-5">
                        <TimelineItem
                          dotColor="bg-green-500"
                          title="Picked up"
                          detail={
                            <>
                              {formatDate(activeLoad.pickupDate)} <br />
                              {activeLoad.originCity}, {activeLoad.originState}
                            </>
                          }
                        />

                        <TimelineItem
                          dotColor="bg-blue-500"
                          title="In transit"
                          active
                          detail={
                            <>
                              Current route <br />
                              Updated recently
                            </>
                          }
                        />

                        <TimelineItem
                          dotColor="bg-red-500"
                          title="Delivery"
                          detail={
                            <>
                              {formatDate(activeLoad.deliveryDate)} <br />
                              {activeLoad.destinationCity},{" "}
                              {activeLoad.destinationState}
                            </>
                          }
                        />
                      </div>

                      <div className="my-5 border-t border-zinc-200 dark:border-slate-800" />

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <SmallDetail
                          label="Equipment"
                          value={activeLoad.equipmentType}
                        />
                        <SmallDetail
                          label="Weight"
                          value={
                            activeLoad.weight
                              ? `${activeLoad.weight.toLocaleString()} lbs`
                              : "—"
                          }
                        />
                        <SmallDetail
                          label="Rate"
                          value={`$${Number(activeLoad.rate).toLocaleString()}`}
                        />
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <Link
                          href="/dashboard/driver/loads/track"
                          className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                          Track Load
                        </Link>

                        <Link
                          href={`/dashboard/driver/loads/search/${activeLoad.id}`}
                          className="rounded-lg border border-zinc-200 px-4 py-2.5 text-center text-sm font-medium text-blue-600 hover:bg-zinc-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>

                    <div className="h-[420px] border-t border-zinc-200 bg-white lg:border-l lg:border-t-0 dark:border-slate-800 dark:bg-slate-950">
                      <LoadMap
                        loadId={activeLoad.id}
                        className="h-full w-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm font-medium text-zinc-900 dark:text-slate-100">
                      No active load right now
                    </p>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">
                      Approved loads will appear below until you start the trip.
                    </p>

                    <Link
                      href="/dashboard/driver/loads/search"
                      className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      Find Loads
                    </Link>
                  </div>
                )}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <CardHeader title="On-Time Delivery" />

                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-semibold text-zinc-900 dark:text-slate-100">
                        94%
                      </p>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">
                        Delivery performance over the last 6 weeks
                      </p>
                    </div>

                    <div className="space-y-3">
                      <OnTimeBar label="Week 1" value={88} />
                      <OnTimeBar label="Week 2" value={92} />
                      <OnTimeBar label="Week 3" value={90} />
                      <OnTimeBar label="Week 4" value={96} />
                      <OnTimeBar label="Week 5" value={94} />
                      <OnTimeBar label="Week 6" value={98} />
                    </div>

                    <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950/40">
                      <p className="text-xs font-medium text-green-700 dark:text-green-300">
                        ↑ 6% improvement from last month
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <CardHeader
                    title="Approved Loads"
                    href="/dashboard/myloads?status=BOOKED"
                  />

                  <div className="space-y-4">
                    {approvedLoads.length > 0 ? (
                      approvedLoads.map((load) => (
                        <div
                          key={load.id}
                          className="rounded-xl border border-zinc-200 p-4 transition hover:border-green-200 hover:bg-zinc-50 dark:border-slate-800 dark:hover:border-green-900 dark:hover:bg-slate-800/70"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-zinc-900 dark:text-slate-100">
                                {load.originCity}, {load.originState}
                                <span className="mx-2 text-zinc-400 dark:text-slate-600">
                                  →
                                </span>
                                {load.destinationCity}, {load.destinationState}
                              </p>

                              <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">
                                Pickup{" "}
                                {new Date(load.pickupDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            </div>

                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-medium text-green-700 dark:bg-green-950/50 dark:text-green-300">
                              APPROVED
                            </span>
                          </div>

                          <div className="mt-5 grid grid-cols-3 gap-4">
                            <SmallDetail
                              label="Rate"
                              value={`$${Number(load.rate).toLocaleString()}`}
                            />

                            <SmallDetail
                              label="Equipment"
                              value={load.equipmentType}
                            />

                            <SmallDetail
                              label="Weight"
                              value={
                                load.weight
                                  ? `${load.weight.toLocaleString()} lbs`
                                  : "—"
                              }
                            />
                          </div>

                          <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-slate-800">
                            <div>
                              <p className="text-xs text-zinc-500 dark:text-slate-400">
                                Broker
                              </p>
                              <p className="text-sm font-medium text-zinc-800 dark:text-slate-200">
                                {load.broker?.firstName || "Unknown Broker"}
                              </p>
                            </div>

                            <Link
                              href={`/dashboard/loads/search/${load.id}`}
                              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-zinc-100 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800"
                            >
                              View Load
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center dark:border-slate-700">
                        <p className="text-sm font-medium text-zinc-900 dark:text-slate-100">
                          No approved loads yet
                        </p>

                        <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">
                          Once a broker approves your request, it will show here.
                        </p>

                        <Link
                          href="/dashboard/driver/loads/search"
                          className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                          Find Loads
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <aside className="space-y-5">
              <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <CardHeader title="Upcoming Loads" />

                <div className="space-y-4">
                  {upcomingLoads.length > 0 ? (
                    upcomingLoads.map((load) => {
                      const date = new Date(load.pickupDate);

                      return (
                        <PickupRow
                          key={load.id}
                          day={date.toLocaleDateString("en-US", {
                            day: "2-digit",
                          })}
                          month={date
                            .toLocaleDateString("en-US", { month: "short" })
                            .toUpperCase()}
                          time={date.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                          load={`#${load.referenceNumber}`}
                          city={`${load.originCity}, ${load.originState}`}
                        />
                      );
                    })
                  ) : (
                    <p className="text-sm text-zinc-500 dark:text-slate-400">
                      No upcoming loads
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <CardHeader title="Earning Summary" />

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-slate-400">
                      Total Earnings
                    </p>
                    <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-slate-100">
                      ${totalEarnings.toLocaleString()}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">
                      Based on delivered loads only
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <EarningSection
                      label="Delivered Loads"
                      value={deliveredLoads.length.toString()}
                      description="Completed"
                    />
                    <EarningSection
                      label="Average Rate"
                      value={`$${Math.round(averageRate).toLocaleString()}`}
                      description="Per delivered load"
                    />
                  </div>

                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-slate-400">
                      Latest Payout
                    </p>

                    {latestDeliveredLoad ? (
                      <>
                        <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-slate-100">
                          ${Number(latestDeliveredLoad.rate).toLocaleString()}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">
                          Load #{latestDeliveredLoad.referenceNumber}
                        </p>
                        <p className="mt-1 text-xs text-zinc-400 dark:text-slate-500">
                          {latestDeliveredLoad.originCity},{" "}
                          {latestDeliveredLoad.originState} →{" "}
                          {latestDeliveredLoad.destinationCity},{" "}
                          {latestDeliveredLoad.destinationState}
                        </p>
                      </>
                    ) : (
                      <p className="mt-2 text-sm text-zinc-500 dark:text-slate-400">
                        No delivered loads yet.
                      </p>
                    )}
                  </div>

                  <Link
                    href="/dashboard/myloads?status=DELIVERED"
                    className="block rounded-lg border border-zinc-200 px-4 py-2.5 text-center text-sm font-medium text-blue-600 hover:bg-zinc-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800"
                  >
                    View Delivered Loads
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function TimelineItem({
  dotColor,
  title,
  detail,
  active,
}: {
  dotColor: string;
  title: string;
  detail: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${dotColor}`} />

      <div className="grid flex-1 grid-cols-2 gap-3 text-sm">
        <p
          className={
            active
              ? "text-blue-600 dark:text-blue-400"
              : "text-zinc-600 dark:text-slate-300"
          }
        >
          {title}
        </p>
        <p className="text-zinc-500 dark:text-slate-400">{detail}</p>
      </div>
    </div>
  );
}

function SmallDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-zinc-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

function CardHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-slate-100">
        {title}
      </h3>

      {href && (
        <Link
          href={href}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View All
        </Link>
      )}
    </div>
  );
}

function PickupRow({
  day,
  month,
  time,
  load,
  city,
}: {
  day: string;
  month: string;
  time: string;
  load: string;
  city: string;
}) {
  return (
    <div className="grid grid-cols-[44px_64px_1fr] items-center gap-3 border-b border-zinc-100 pb-4 last:border-0 dark:border-slate-800">
      <div>
        <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
          {month}
        </p>
        <p className="text-xl font-semibold text-zinc-900 dark:text-slate-100">
          {day}
        </p>
      </div>

      <p className="text-sm text-zinc-500 dark:text-slate-400">{time}</p>

      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-slate-100">
          Load {load}
        </p>
        <p className="text-sm text-zinc-500 dark:text-slate-400">{city}</p>
      </div>
    </div>
  );
}

function EarningSection({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs text-zinc-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-slate-100">
        {value}
      </p>
      <p className="mt-1 text-xs text-zinc-400 dark:text-slate-500">
        {description}
      </p>
    </div>
  );
}

function OnTimeBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-zinc-500 dark:text-slate-400">
          {label}
        </span>
        <span className="font-semibold text-zinc-700 dark:text-slate-300">
          {value}%
        </span>
      </div>

      <div className="h-2 rounded-full bg-zinc-100 dark:bg-slate-800">
        <div
          className="h-2 rounded-full bg-blue-600 dark:bg-blue-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function formatDate(date: Date | string | null) {
  if (!date) return "No date";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}