import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Phone,
  UserRound,
  Truck,
  Search,
  BadgeCheck,
} from "lucide-react";

export default async function BrokerDriversPage() {
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

  if (broker.role !== "BROKER") {
    redirect("/unauthorized");
  }

  const drivers = await prisma.user.findMany({
    where: {
      role: "DRIVER",
    },
    orderBy: {
      firstName: "asc",
    },
    include: {
      driverTrips: {
        where: {
          status: {
            in: ["ASSIGNED", "IN_TRANSIT"],
          },
        },
        include: {
          load: true,
        },
      },
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
              Drivers
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              View all drivers currently registered in SwiftShift.
            </p>
          </div>

          <Link
            href="/dashboard/broker/brokerLoads/assign?tab=available"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <Truck size={16} />
            Assign Loads
          </Link>
        </div>


        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                All Drivers
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                This is a basic driver directory. You can add filters later.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-950">
              <Search size={15} />
              Search coming soon
            </div>
          </div>

          {drivers.length === 0 ? (
            <div className="py-16 text-center">
              <UserRound
                size={38}
                className="mx-auto mb-3 text-slate-300 dark:text-slate-600"
              />

              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                No drivers found.
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Drivers will appear here once they sign up.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {drivers.map((driver) => {
                const activeTrip = driver.driverTrips[0];

                return (
                  <div
                    key={driver.id}
                    className="grid gap-4 p-5 transition hover:bg-slate-50 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-center dark:hover:bg-slate-800/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                        <UserRound size={20} />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-950 dark:text-white">
                          {driver.firstName} {driver.lastName}
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Driver ID: {driver.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 text-sm text-slate-500 dark:text-slate-400">
                      <p className="flex items-center gap-2">
                        <Mail size={14} />
                        {driver.email}
                      </p>

                      <p className="flex items-center gap-2">
                        <Phone size={14} />
                        {driver.phoneNum || "No phone number"}
                      </p>
                    </div>

                    <div>
                      {activeTrip ? (
                        <div>
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                            Assigned
                          </span>

                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            Load #{activeTrip.load.referenceNumber}
                          </p>
                        </div>
                      ) : (
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950/50 dark:text-green-300">
                          Available
                        </span>
                      )}
                    </div>

                    <div className="flex justify-start lg:justify-end">
                      <Link
                        href="/dashboard/broker/brokerLoads/assign?tab=available"
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Assign Load
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