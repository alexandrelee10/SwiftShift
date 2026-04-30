import { requireUser } from "@/lib/requireUser";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { startTrip, markDelivered } from "./action";

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

  const status = params.status || "BOOKED";

  const loads = await prisma.load.findMany({
    where: {
      bookings: {
        some: {
          driverId: dbUser.id,
        },
      },
      status: status as any,
    },
    orderBy: {
      pickupDate: "asc",
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Loads</h1>
          <p className="text-sm text-slate-500">
            Track your booked and active loads
          </p>
        </div>

        {/* TABS */}
        <div className="flex gap-2 border-b border-slate-200 pb-3">
          {["BOOKED", "IN_TRANSIT", "DELIVERED"].map((tab) => (
            <Link
              key={tab}
              href={`?status=${tab}`}
              className={`rounded-lg px-4 py-2 text-sm ${
                status === tab
                  ? "bg-blue-50 font-medium text-blue-700"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {formatStatus(tab)}
            </Link>
          ))}
        </div>

        {/* LOAD LIST */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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

/* ================= ROW ================= */
function LoadRow({ load }: { load: any }) {
  return (
    <div className="grid gap-4 border-b border-slate-100 px-5 py-4 last:border-0 md:grid-cols-[1fr_auto] md:items-center">
      {/* LEFT SIDE */}
      <div>
        <p className="font-semibold text-slate-900">
          {load.originCity}, {load.originState} → {load.destinationCity},{" "}
          {load.destinationState}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {load.equipmentType} •{" "}
          {load.weight ? load.weight.toLocaleString() : "—"} lbs •{" "}
          {load.commodity || "General Freight"}
        </p>
      </div>

      {/* RIGHT SIDE ACTIONS */}
      <div className="flex flex-wrap gap-2 md:justify-end">
        <Link
          href={`/dashboard/loads/search/${load.id}`}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          View / Track
        </Link>
        <Link
          href={`/dashboard/loads/search/${load.id}/bol`}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Fill BOL
        </Link>

        {load.status === "BOOKED" && (
          <form action={startTrip.bind(null, load.id)}>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Start Trip
            </button>
          </form>
        )}

        {load.status === "IN_TRANSIT" && (
          <form action={markDelivered.bind(null, load.id)}>
            <button
              type="submit"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Mark Delivered
            </button>
          </form>
        )}

        {load.status === "DELIVERED" && (
          <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            View POD
          </button>
        )}
      </div>
    </div>
  );
}

/* ================= EMPTY ================= */
function EmptyState({ status }: { status: string }) {
  return (
    <div className="p-10 text-center">
      <p className="font-medium text-slate-900">
        No {formatStatus(status)} loads
      </p>

      <p className="mt-1 text-sm text-slate-500">
        Loads will appear here once you book them.
      </p>

      <Link
        href="/dashboard/loads/search"
        className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Find Loads
      </Link>
    </div>
  );
}

/* ================= FORMAT ================= */
function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
