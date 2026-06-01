import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LoadStatus, UserRole } from "@prisma/client";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
  Route,
  Truck,
} from "lucide-react";

export default async function BrokerTrackingPage() {
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
        in: [LoadStatus.BOOKED, LoadStatus.IN_TRANSIT, LoadStatus.DELIVERED],
      },
    },
    include: {
      trips: {
        include: {
          driver: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      pickupDate: "asc",
    },
  });

  const booked = loads.filter((load) => load.status === LoadStatus.BOOKED);
  const inTransit = loads.filter(
    (load) => load.status === LoadStatus.IN_TRANSIT
  );
  const delivered = loads.filter(
    (load) => load.status === LoadStatus.DELIVERED
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8 dark:bg-[#0b1120] dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Broker dashboard
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Load Tracking
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Track booked, in-transit, and delivered loads in one place.
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Booked"
            value={booked.length.toString()}
            icon={<Clock size={18} />}
          />

          <StatCard
            label="In Transit"
            value={inTransit.length.toString()}
            icon={<Navigation size={18} />}
          />

          <StatCard
            label="Delivered"
            value={delivered.length.toString()}
            icon={<CheckCircle2 size={18} />}
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 p-5 dark:border-slate-800">
            <h2 className="text-base font-semibold text-slate-950 dark:text-white">
              Tracking Board
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Monitor driver assignments and load progress.
            </p>
          </div>

          {loads.length === 0 ? (
            <div className="py-16 text-center">
              <Truck
                size={38}
                className="mx-auto mb-3 text-slate-300 dark:text-slate-600"
              />

              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                No tracked loads yet.
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Booked and active loads will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {loads.map((load) => {
                const trip = load.trips[0];

                return (
                  <div
                    key={load.id}
                    className="p-5 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-slate-950 dark:text-white">
                            Load #{load.referenceNumber}
                          </p>

                          <StatusBadge status={load.status} />
                        </div>

                        <div className="grid gap-3 text-sm text-slate-500 sm:grid-cols-2 dark:text-slate-400">
                          <p className="flex items-center gap-2">
                            <MapPin size={15} />
                            {load.originCity}, {load.originState}
                          </p>

                          <p className="flex items-center gap-2">
                            <MapPin size={15} />
                            {load.destinationCity}, {load.destinationState}
                          </p>

                          <p className="flex items-center gap-2">
                            <Truck size={15} />
                            {load.equipmentType}
                          </p>

                          <p className="flex items-center gap-2">
                            <Route size={15} />
                            {load.distanceMiles
                              ? `${load.distanceMiles.toLocaleString()} miles`
                              : "Distance unavailable"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Driver
                          </p>

                          <p className="mt-1 text-sm font-medium text-slate-800 dark:text-white">
                            {trip
                              ? `${trip.driver.firstName} ${trip.driver.lastName}`
                              : "No driver assigned"}
                          </p>

                          {trip?.driver?.phoneNum && (
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {trip.driver.phoneNum}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                        <Link
                          href={`/dashboard/broker/brokerLoads/${load.id}`}
                          className="rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          View Load
                        </Link>

                        <Link
                          href={`/dashboard/broker/brokerLoads/assign/${load.id}`}
                          className="rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
                        >
                          Manage Assignment
                        </Link>
                      </div>
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    BOOKED:
      "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
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