import { requireUser } from "@/lib/requireUser";
import prisma from "@/lib/prisma";
import { Truck, CircleCheckBig, Landmark, FuelIcon } from "lucide-react";
import LoadMap from "../components/LoadMap";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await requireUser();

  if (!session.user?.email) {
    throw new Error("Unauthorized");
  }

  // USER
  const dbUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  // Loads
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

  const bookedLoads = await prisma.load.findMany({
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
      pickupDate: "asc",
    },
  });

  const upperIcons = [
    {
      name: "Active Loads",
      content: activeLoad ? 1 : 0,
      status: activeLoad ? "In Transit" : "No active load",
      icon: Truck,
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Delivered (30d)",
      content: deliveredLoads ? 1 : 0,
      status: deliveredLoads ? "Deliveries Completed" : "None Delivered",
      icon: CircleCheckBig,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Earnings",
      content: "$10,956",
      status: "+8% vs last 30d",
      icon: Landmark,
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "Fuel Spending (30d)",
      content: "$3,123",
      status: "-10% vs last 30d",
      icon: FuelIcon,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-100">
      <main className="min-w-0 p-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-lg font-semibold text-zinc-800">
              Welcome, {session.user?.name || "Driver"}!
            </h2>
            <p className="text-sm text-zinc-500">
              Here&apos;s what&apos;s happening with your loads today.
            </p>
          </div>

          {/* Top Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {upperIcons.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}
                  >
                    <Icon size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-zinc-500">
                      {item.name}
                    </p>
                    <p className="text-lg font-semibold text-zinc-900">
                      {item.content}
                    </p>
                    <p className="text-xs text-zinc-400">{item.status}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
            {/* Left Column */}
            <section className="space-y-5">
              {/* Active Load Card */}
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-semibold text-zinc-900">
                      Active Load
                    </h2>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-medium text-green-700">
                      {activeLoad ? "IN TRANSIT" : "NONE"}
                    </span>
                  </div>

                  <Link
                    href="/dashboard/myloads?status=IN_TRANSIT"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View All Loads
                  </Link>
                </div>

                {activeLoad ? (
                  <div className="grid lg:grid-cols-[310px_1fr]">
                    {/* Load Info */}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-zinc-900">
                        Load #{activeLoad.referenceNumber}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600">
                        <span>
                          {activeLoad.originCity}, {activeLoad.originState}
                        </span>
                        <span>→</span>
                        <span>
                          {activeLoad.destinationCity},{" "}
                          {activeLoad.destinationState}
                        </span>
                      </div>

                      {/* Timeline */}
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

                      <div className="my-5 border-t border-zinc-200" />

                      {/* Details */}
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

                      {/* Buttons */}
                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <Link
                          href={`/dashboard/loads/track`}
                          className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Track Load
                        </Link>

                        <Link
                          href={`/dashboard/loads/myloads`}
                          className="rounded-lg border border-zinc-200 px-4 py-2.5 text-center text-sm font-medium text-blue-600 hover:bg-zinc-50"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>

                    {/* Map */}
                    <div className="h-[420px] border-t border-zinc-200 bg-white lg:border-l lg:border-t-0">
                      <LoadMap
                        loadId={activeLoad.id}
                        className="h-full w-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm font-medium text-zinc-900">
                      No active load right now
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      Book a load and start the trip to see it here.
                    </p>

                    <Link
                      href="/dashboard/loads/search"
                      className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Find Loads
                    </Link>
                  </div>
                )}
              </div>

              {/* Lower Cards */}
              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-xl border border-zinc-200 bg-white p-5">
                  <CardHeader title="Recent Searches" />

                  <div className="space-y-4 text-sm">
                    <SearchRow from="Miami, FL" to="Atlanta, GA" count="128" />
                    <SearchRow
                      from="Orlando, FL"
                      to="Charlotte, NC"
                      count="96"
                    />
                    <SearchRow
                      from="Tampa, FL"
                      to="Nashville, TN"
                      count="105"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-5">
                  <CardHeader title="Booked Loads" />

                  <div className="space-y-4 text-sm">
                    {bookedLoads.length > 0 ? (
                      bookedLoads.map((load) => (
                        <BookmarkedRow
                          key={load.id}
                          route={`${load.originCity}, ${load.originState} → ${load.destinationCity}, ${load.destinationState}`}
                          rate={`$${Number(load.rate).toLocaleString()}`}
                        />
                      ))
                    ) : (
                      <p className="text-sm text-zinc-500">
                        No bookmarked loads yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Right Column */}
            <aside className="space-y-5">
              <div className="rounded-xl border border-zinc-200 bg-white p-5">
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
                    <p className="text-sm text-zinc-500">No upcoming loads</p>
                  )}
                </div>
              </div>
                {/* Convert to earnings card */}
              <div className="rounded-xl border border-zinc-200 bg-white p-5">
                <CardHeader title="Notifications" />

                <div className="space-y-4 text-sm">
                  <NotificationRow
                    title="Payment received"
                    desc="$2,450 has been paid for Load #48120"
                  />
                  <NotificationRow
                    title="New document"
                    desc="Rate confirmation uploaded for Load #48291"
                  />
                  <NotificationRow
                    title="Fuel discount"
                    desc="Save 15¢/gal at Pilot in Georgia"
                  />
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
        <p className={active ? "text-blue-600" : "text-zinc-600"}>{title}</p>
        <p className="text-zinc-500">{detail}</p>
      </div>
    </div>
  );
}

function SmallDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-zinc-800">{value}</p>
    </div>
  );
}

function CardHeader({ title }: { title: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
      <Link
        href={"/dashboard/loads/myloads"}
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        View All
      </Link>
    </div>
  );
}

function SearchRow({
  from,
  to,
  count,
}: {
  from: string;
  to: string;
  count: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-100 pb-3 last:border-0">
      <p className="text-zinc-600">
        {from} <span className="mx-2 text-zinc-400">→</span> {to}
      </p>

      <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-500">
        {count}
      </span>
    </div>
  );
}

function BookmarkedRow({ route, rate }: { route: string; rate: string }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-100 pb-3 last:border-0">
      <p className="text-zinc-600">⭐ {route}</p>
      <p className="font-medium text-zinc-800">{rate}</p>
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
    <div className="grid grid-cols-[44px_64px_1fr] items-center gap-3 border-b border-zinc-100 pb-4 last:border-0">
      <div>
        <p className="text-[11px] font-medium text-blue-600">{month}</p>
        <p className="text-xl font-semibold text-zinc-900">{day}</p>
      </div>

      <p className="text-sm text-zinc-500">{time}</p>

      <div>
        <p className="text-sm font-medium text-zinc-900">Load {load}</p>
        <p className="text-sm text-zinc-500">{city}</p>
      </div>
    </div>
  );
}

function NotificationRow({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-zinc-900">{title}</p>
      <p className="mt-1 text-sm text-zinc-500">{desc}</p>
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

// Add document section tha cater to this load.
