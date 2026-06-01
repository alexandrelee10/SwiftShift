import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function assignDriver(formData: FormData) {
  "use server";

  const loadId = formData.get("loadId")?.toString();
  const driverId = formData.get("driverId")?.toString();

  if (!loadId || !driverId) {
    throw new Error("Missing load or driver");
  }

  const booking = await prisma.booking.create({
    data: {
      loadId,
      driverId,
      status: "CONFIRMED",
    },
  });

  await prisma.trip.create({
    data: {
      loadId,
      driverId,
      bookingId: booking.id,
      status: "ASSIGNED",
    },
  });

  await prisma.load.update({
    where: { id: loadId },
    data: {
      status: "BOOKED",
    },
  });

  revalidatePath("/dashboard/broker/brokerLoads/assign");
  redirect("/dashboard/broker/brokerLoads/assign");
}

export default async function AssignDriverPage({ params }: PageProps) {
  const { id } = await params;

  const session = await requireUser();
  if (!session.user?.email) throw new Error("Unauthorized");

  const broker = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!broker) throw new Error("User not found");
  if (broker.role !== "BROKER") redirect("/unauthorized");

  const load = await prisma.load.findFirst({
    where: {
      id,
      brokerId: broker.id,
    },
    include: {
      trips: true,
    },
  });

  if (!load) notFound();

  if (load.trips.length > 0) {
    redirect("/dashboard/broker/brokerLoads/assign");
  }

  const drivers = await prisma.user.findMany({
    where: {
      role: "DRIVER",
    },
    orderBy: {
      firstName: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 dark:bg-[#0b1120] dark:text-slate-100">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Broker loads
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Assign Driver
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Assign a driver to Load #{load.referenceNumber}.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <p className="font-semibold text-slate-950 dark:text-white">
              Load #{load.referenceNumber}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {load.originCity}, {load.originState} → {load.destinationCity},{" "}
              {load.destinationState}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Equipment: {load.equipmentType}
            </p>
          </div>

          <form action={assignDriver} className="mt-6 space-y-5">
            <input type="hidden" name="loadId" value={load.id} />

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Select driver
              </label>

              <select
                name="driverId"
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="">Choose a driver</option>

                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.firstName} {driver.lastName} — {driver.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <a
                href="/dashboard/broker/brokerLoads/assign"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </a>

              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                Assign load
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}