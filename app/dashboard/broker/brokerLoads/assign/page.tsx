import { requireUser } from "@/lib/requireUser";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock, MapPin, Truck } from "lucide-react";

export default async function AssignLoadsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const activeTab = params.tab === "assigned" ? "assigned" : "available";

  const session = await requireUser();
  if (!session.user?.email) throw new Error("Unauthorized");

  const broker = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!broker) throw new Error("User not found");
  if (broker.role !== "BROKER") redirect("/unauthorized");

  const loads = await prisma.load.findMany({
    where: {
      brokerId: broker.id,
      status: {
        in: ["POSTED", "BOOKED", "IN_TRANSIT"],
      },
      trips: activeTab === "assigned" ? { some: {} } : { none: {} },
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

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900 dark:bg-[#0b1120] dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Assign Loads
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Assign available loads to drivers and view assigned loads.
          </p>
        </div>

        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-6 text-sm font-medium">
            <Link
              href="/dashboard/broker/loads/assign?tab=available"
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 pb-3 transition ${
                activeTab === "available"
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Clock size={15} />
              Available
            </Link>

            <Link
              href="/dashboard/broker/loads/assign?tab=assigned"
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 pb-3 transition ${
                activeTab === "assigned"
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <CheckCircle2 size={15} />
              Assigned
            </Link>
          </div>
        </div>

        {loads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <Truck
              size={36}
              className="mx-auto mb-3 text-slate-300 dark:text-slate-600"
            />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {activeTab === "assigned"
                ? "No assigned loads yet."
                : "No available loads found."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {loads.map((load) => {
              const assignedTrip = load.trips[0];

              return (
                <div
                  key={load.id}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-5 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-xl p-2 ${
                          assignedTrip
                            ? "bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400"
                            : "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                        }`}
                      >
                        <Truck size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Load #{load.referenceNumber}
                        </p>
                        <p className="text-xs text-slate-400">
                          Equipment: {load.equipmentType} &middot; Rate: $
                          {load.rate.toString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          assignedTrip
                            ? "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                        }`}
                      >
                        {assignedTrip ? "Assigned" : "Available"}
                      </span>

                      <Link
                        href={`/dashboard/broker/loads/assign/${load.id}`}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        {assignedTrip ? "Reassign" : "Assign"}
                      </Link>
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
                    <InfoBlock
                      icon={<MapPin size={14} />}
                      label="Origin"
                      value={`${load.originCity}, ${load.originState}`}
                    />

                    <InfoBlock
                      icon={<MapPin size={14} />}
                      label="Destination"
                      value={`${load.destinationCity}, ${load.destinationState}`}
                    />

                    <InfoBlock
                      icon={<Truck size={14} />}
                      label="Driver"
                      value={
                        assignedTrip
                          ? `${assignedTrip.driver.firstName} ${assignedTrip.driver.lastName}`
                          : "Not assigned"
                      }
                    />

                    <InfoBlock
                      icon={<CheckCircle2 size={14} />}
                      label="Status"
                      value={load.status}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function InfoBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-1 text-sm font-medium text-slate-800 dark:text-white">
        {value}
      </p>
    </div>
  );
}