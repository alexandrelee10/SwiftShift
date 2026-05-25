import { requireUser } from "@/lib/requireUser";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { startTrip, markDelivered } from "./action";

const tabs = [
  { label: "Requested", value: "REQUESTED" },
  { label: "In Transit", value: "IN_TRANSIT" },
  { label: "Delivered", value: "DELIVERED" },
];

export default async function MyLoadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await requireUser();
  const params = await searchParams;

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

  const status = params.status || "REQUESTED";

  const loads = await prisma.load.findMany({
    where: {
      bookings: {
        some: {
          driverId: dbUser.id,
          ...(status === "REQUESTED"
            ? {
                status: {
                  in: ["PENDING", "APPROVED", "REJECTED"],
                },
              }
            : {}),
        },
      },
      ...(status !== "REQUESTED"
        ? {
            status: status as any,
          }
        : {}),
    },
    include: {
      bookings: {
        where: {
          driverId: dbUser.id,
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

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-[#0b1120] dark:text-slate-100 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            My Loads
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track your requested, booked, active, and delivered loads.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-3 dark:border-slate-800">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={`?status=${tab.value}`}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm transition ${
                status === tab.value
                  ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                  : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {loads.length > 0 ? (
            loads.map((load) => <LoadRow key={load.id} load={load} />)
          ) : (
            <EmptyState status={status} />
          )}
        </div>
      </div>
    </div>
  );
}

function LoadRow({ load }: { load: any }) {
  const bookingStatus = load.bookings?.[0]?.status;
  const displayStatus = bookingStatus || load.status;

  return (
    <div className="grid gap-4 border-b border-slate-100 px-4 py-5 transition last:border-0 hover:bg-slate-50 md:grid-cols-[1fr_auto] md:items-center md:px-5 dark:border-slate-800 dark:hover:bg-slate-800/60">
      <div className="min-w-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <p className="font-semibold text-slate-900 dark:text-white">
            {load.originCity}, {load.originState} → {load.destinationCity},{" "}
            {load.destinationState}
          </p>

          <StatusBadge status={displayStatus} />
        </div>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {load.equipmentType} •{" "}
          {load.weight ? load.weight.toLocaleString() : "—"} lbs •{" "}
          {load.commodity || "General Freight"}
        </p>

        <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
          Rate: ${Number(load.rate).toLocaleString()}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap md:justify-end">
        <Link
          href={`/dashboard/loads/search/${load.id}`}
          className="rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          View
        </Link>

        {bookingStatus === "PENDING" && (
          <button
            disabled
            className="rounded-lg bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300"
          >
            Waiting Approval
          </button>
        )}

        {bookingStatus === "REJECTED" && (
          <button
            disabled
            className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            Rejected
          </button>
        )}

        {load.status === "BOOKED" && (
          <form action={startTrip.bind(null, load.id)}>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Start Trip
            </button>
          </form>
        )}

        {load.status === "IN_TRANSIT" && (
          <form action={markDelivered.bind(null, load.id)}>
            <button
              type="submit"
              className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
            >
              Mark Delivered
            </button>
          </form>
        )}

        {load.status === "DELIVERED" && (
          <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            View POD
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ status }: { status: string }) {
  return (
    <div className="p-8 text-center sm:p-10">
      <p className="font-medium text-slate-900 dark:text-white">
        No {formatStatus(status)} loads
      </p>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {status === "REQUESTED"
          ? "Loads you request will appear here while waiting for broker approval."
          : "Loads will appear here once their status changes."}
      </p>

      <Link
        href="/dashboard/driver/loads/search"
        className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Find Loads
      </Link>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING:
      "bg-yellow-50 text-yellow-700 ring-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300 dark:ring-yellow-900/60",
    APPROVED:
      "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900/60",
    REJECTED:
      "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900/60",
    BOOKED:
      "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900/60",
    IN_TRANSIT:
      "bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:ring-purple-900/60",
    DELIVERED:
      "bg-green-50 text-green-700 ring-green-200 dark:bg-green-950/40 dark:text-green-300 dark:ring-green-900/60",
  };

  return (
    <span
      className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
        styles[status] ||
        "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
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