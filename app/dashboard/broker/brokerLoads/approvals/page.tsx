import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { approveLoadRequest, rejectLoadRequest } from "./action";

export default async function BrokerApprovalsPage({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
}) {
  const session = await requireUser();
  const params = await searchParams;

  if (!session.user?.email) {
    throw new Error("Unauthorized");
  }

  const broker = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!broker || broker.role !== "BROKER") {
    throw new Error("Unauthorized");
  }

  const requests = await prisma.booking.findMany({
    where: {
      status: "PENDING",
      load: {
        brokerId: broker.id,
      },
    },
    include: {
      driver: true,
      load: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-[#0b1120] dark:text-slate-100 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {params.success && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 dark:border-green-900/60 dark:bg-green-950/30">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-500" />

              <div>
                <p className="font-semibold text-green-800 dark:text-green-300">
                  Success
                </p>
                <p className="text-sm text-green-700 dark:text-green-400">
                  {params.success}
                </p>
              </div>
            </div>
          </div>
        )}

        {params.error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-900/60 dark:bg-red-950/30">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-red-500" />

              <div>
                <p className="font-semibold text-red-800 dark:text-red-300">
                  Error
                </p>
                <p className="text-sm text-red-700 dark:text-red-400">
                  {params.error}
                </p>
              </div>
            </div>
          </div>
        )}

        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Load Approvals
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review driver requests and approve or reject load bookings.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request.id}
                className="grid gap-4 border-b border-slate-100 px-4 py-5 last:border-0 md:grid-cols-[1fr_auto] md:items-center md:px-5 dark:border-slate-800"
              >
                <div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <h2 className="font-semibold text-slate-900 dark:text-white">
                      {request.load.originCity}, {request.load.originState} →{" "}
                      {request.load.destinationCity},{" "}
                      {request.load.destinationState}
                    </h2>

                    <span className="w-fit rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700 ring-1 ring-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300 dark:ring-yellow-900/60">
                      Pending
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {request.load.equipmentType} •{" "}
                    {request.load.weight
                      ? request.load.weight.toLocaleString()
                      : "—"}{" "}
                    lbs • {request.load.commodity || "General Freight"}
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Rate: ${Number(request.load.rate).toLocaleString()}
                  </p>

                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    Requested by{" "}
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {request.driver.firstName} {request.driver.lastName}
                    </span>{" "}
                    • {request.driver.email}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row md:justify-end">
                  <form action={approveLoadRequest.bind(null, request.id)}>
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </form>

                  <form action={rejectLoadRequest.bind(null, request.id)}>
                    <button
                      type="submit"
                      className="w-full rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center">
              <p className="font-medium text-slate-900 dark:text-white">
                No pending load requests
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Driver requests will appear here when they request your posted
                loads.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}