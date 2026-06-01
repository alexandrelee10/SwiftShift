import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserRole, LoadStatus } from "@prisma/client";
import {
  ClipboardList,
  Mail,
  Phone,
  Plus,
  Route,
  Truck,
  UserRound,
  UsersRound,
} from "lucide-react";

export default async function BrokerDispatchPage() {
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

  const dispatchers = await prisma.user.findMany({
    where: {
      role: UserRole.DISPATCH,
    },
    orderBy: {
      firstName: "asc",
    },
  });

  const activeLoads = await prisma.load.findMany({
    where: {
      brokerId: broker.id,
      status: {
        in: [LoadStatus.BOOKED, LoadStatus.IN_TRANSIT],
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
      pickupDate: "asc",
    },
  });

  const deliveredLoads = await prisma.load.count({
    where: {
      brokerId: broker.id,
      status: LoadStatus.DELIVERED,
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8 dark:bg-[#0b1120] dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Broker dashboard
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Dispatch
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Manage dispatchers, monitor active loads, and move freight through
              your operation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/broker/brokerLoads/assign?tab=available"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <Truck size={16} />
              Assign Loads
            </Link>

            <Link
              href="/dashboard/broker/brokerLoads/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Plus size={16} />
              Add Load
            </Link>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 p-5 dark:border-slate-800">
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                Dispatch Team
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                All users with the dispatch role.
              </p>
            </div>

            {dispatchers.length === 0 ? (
              <div className="py-14 text-center">
                <UsersRound
                  size={38}
                  className="mx-auto mb-3 text-slate-300 dark:text-slate-600"
                />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  No dispatchers found.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {dispatchers.map((dispatcher) => (
                  <div
                    key={dispatcher.id}
                    className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-slate-800/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                        <UserRound size={20} />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-950 dark:text-white">
                          {dispatcher.firstName} {dispatcher.lastName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Dispatcher ID: {dispatcher.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 text-sm text-slate-500 dark:text-slate-400">
                      <p className="flex items-center gap-2">
                        <Mail size={14} />
                        {dispatcher.email}
                      </p>

                      <p className="flex items-center gap-2">
                        <Phone size={14} />
                        {dispatcher.phoneNum || "No phone number"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 p-5 dark:border-slate-800">
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                Active Dispatch Board
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Booked and in-transit loads dispatch should monitor.
              </p>
            </div>

            {activeLoads.length === 0 ? (
              <div className="py-14 text-center">
                <Truck
                  size={38}
                  className="mx-auto mb-3 text-slate-300 dark:text-slate-600"
                />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  No active loads.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeLoads.map((load) => {
                  const activeTrip = load.trips[0];

                  return (
                    <div
                      key={load.id}
                      className="p-5 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div>
                          <p className="font-semibold text-slate-950 dark:text-white">
                            Load #{load.referenceNumber}
                          </p>

                          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {load.originCity}, {load.originState} →{" "}
                            {load.destinationCity}, {load.destinationState}
                          </p>

                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Equipment: {load.equipmentType} • Rate: $
                            {load.rate.toString()}
                          </p>
                        </div>

                        <Link
                          href={`/dashboard/broker/brokerLoads/${load.id}`}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-center text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          View Load
                        </Link>
                      </div>

                      <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Driver
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-800 dark:text-white">
                          {activeTrip
                            ? `${activeTrip.driver.firstName} ${activeTrip.driver.lastName}`
                            : "No driver assigned"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionCard
            title="Assign Loads"
            description="Send available freight to a driver."
            href="/dashboard/broker/brokerLoads/assign?tab=available"
            icon={<Truck size={18} />}
          />

          <ActionCard
            title="Monitor Assigned"
            description="View booked loads and driver assignments."
            href="/dashboard/broker/brokerLoads/assign?tab=assigned"
            icon={<ClipboardList size={18} />}
          />

          <ActionCard
            title="View Drivers"
            description="Check driver availability and contact info."
            href="/dashboard/broker/drivers"
            icon={<UsersRound size={18} />}
          />

          <ActionCard
            title="Delivered Loads"
            description={`Track completed freight. Delivered: ${deliveredLoads}`}
            href="/dashboard/broker/brokerLoads"
            icon={<Route size={18} />}
          />
        </section>
      </div>
    </main>
  );
}

function ActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/70"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
        {icon}
      </div>

      <p className="font-semibold text-slate-950 dark:text-white">{title}</p>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </Link>
  );
}