import { requireUser } from "@/lib/requireUser";
import prisma from "@/lib/prisma";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import Link from "next/link";

export default async function BillOfLadingPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const activeTab = params.tab === "complete" ? "complete" : "notcomplete";

  const session = await requireUser();
  if (!session.user?.email) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!dbUser) throw new Error("User not found");

  // Only loads that are IN_TRANSIT or have an APPROVED booking
  const eligibleLoads = await prisma.load.findMany({
    where: {
      brokerId: dbUser.id,
      OR: [
        { status: "IN_TRANSIT" },
        { bookings: { some: { status: "APPROVED" } } },
      ],
    },
  });

  const eligibleLoadIds = eligibleLoads.map((l) => l.id);

  // Fetch existing BOL documents for those loads
  let documents = await prisma.document.findMany({
    where: {
      type: "BILL_OF_LADING",
      loadId: { in: eligibleLoadIds },
    },
    include: { billOfLading: true, load: true },
    orderBy: { updatedAt: "desc" },
  });

  // Auto-create a DRAFT BOL document for any eligible load that doesn't have one yet
  const loadIdsWithDocs = new Set(documents.map((d) => d.loadId));
  const loadsNeedingDocs = eligibleLoads.filter(
    (l) => !loadIdsWithDocs.has(l.id)
  );

  if (loadsNeedingDocs.length > 0) {
    await prisma.document.createMany({
      data: loadsNeedingDocs.map((load) => ({
        loadId: load.id,
        userId: dbUser.id,
        type: "BILL_OF_LADING" as const,
        fileName: `BOL - ${load.referenceNumber}`,
        status: "DRAFT",
      })),
    });

    // Re-fetch with the newly created docs
    documents = await prisma.document.findMany({
      where: {
        type: "BILL_OF_LADING",
        loadId: { in: eligibleLoadIds },
      },
      include: { billOfLading: true, load: true },
      orderBy: { updatedAt: "desc" },
    });
  }

  const notComplete = documents.filter((d) => d.status === "DRAFT");
  const complete = documents.filter((d) => d.status === "COMPLETE");
  const displayed = activeTab === "complete" ? complete : notComplete;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900 dark:bg-[#0b1120] dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Bills of Lading
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Showing loads that are approved or in transit.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-6 text-sm font-medium">
            <Link
              href="/dashboard/broker/brokerLoads/bol?tab=notcomplete"
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 pb-3 transition ${
                activeTab === "notcomplete"
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <AlertCircle size={15} />
              Not Complete
              {notComplete.length > 0 && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-950/60 dark:text-red-400">
                  {notComplete.length}
                </span>
              )}
            </Link>

            <Link
              href="/dashboard/broker/brokerLoads/bol?tab=complete"
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 pb-3 transition ${
                activeTab === "complete"
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <CheckCircle2 size={15} />
              Complete
              {complete.length > 0 && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-950/60 dark:text-green-400">
                  {complete.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Empty state */}
        {displayed.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <FileText
              size={36}
              className="mx-auto mb-3 text-slate-300 dark:text-slate-600"
            />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {activeTab === "complete"
                ? "No completed BOLs yet."
                : eligibleLoadIds.length === 0
                ? "No approved or in-transit loads found."
                : "All BOLs are complete — nice work!"}
            </p>
          </div>
        )}

        {/* BOL cards */}
        <div className="space-y-4">
          {displayed.map((doc) => {
            const bol = doc.billOfLading;
            const load = doc.load;
            const isComplete = doc.status === "COMPLETE";

            const missingFields: string[] = [];
            if (!bol) {
              missingFields.push("BOL not started");
            } else {
              if (!bol.carrierName)   missingFields.push("Carrier Name");
              if (!bol.trailerNumber) missingFields.push("Trailer Number");
              if (!bol.sealNumber)    missingFields.push("Seal Number");
              if (!bol.commodity)     missingFields.push("Commodity");
              if (!bol.weight)        missingFields.push("Weight");
              if (!bol.pieces)        missingFields.push("Pieces");
            }

            return (
              <div
                key={doc.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                {/* Card header */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-5 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-xl p-2 ${
                        isComplete
                          ? "bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400"
                          : "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                      }`}
                    >
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {doc.fileName ?? `BOL — ${load.referenceNumber}`}
                      </p>
                      <p className="text-xs text-slate-400">
                        Ref #{load.referenceNumber} &middot; Pickup{" "}
                        {formatDate(load.pickupDate)} &middot; Updated{" "}
                        {formatDate(doc.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Load status badge */}
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        load.status === "IN_TRANSIT"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                          : "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400"
                      }`}
                    >
                      {load.status === "IN_TRANSIT" ? "In Transit" : "Approved"}
                    </span>

                    {isComplete ? (
                      <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950/50 dark:text-green-400">
                        <CheckCircle2 size={12} /> Complete
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                        <Clock size={12} /> Needs Attention
                      </span>
                    )}

                    <Link
                      href={`/dashboard/broker/brokerLoads/bol/${doc.id}`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      {isComplete ? "View" : "Fill In"}
                    </Link>
                  </div>
                </div>

                {/* Card body */}
                <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoBlock
                    icon={<Truck size={14} />}
                    label="Carrier"
                    value={bol?.carrierName ?? "—"}
                  />
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
                    icon={<Package size={14} />}
                    label="Weight / Pieces"
                    value={
                      bol?.weight
                        ? `${bol.weight.toLocaleString()} lbs · ${bol.pieces ?? "?"} pcs`
                        : "Not entered"
                    }
                  />
                </div>

                {/* Missing fields banner */}
                {!isComplete && missingFields.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 rounded-b-2xl border-t border-slate-100 bg-red-50 px-5 py-3 dark:border-slate-800 dark:bg-red-950/20">
                    <AlertCircle
                      size={13}
                      className="shrink-0 text-red-500 dark:text-red-400"
                    />
                    <p className="text-xs font-medium text-red-600 dark:text-red-400">
                      Missing:
                    </p>
                    {missingFields.map((f) => (
                      <span
                        key={f}
                        className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900/40 dark:text-red-300"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 text-sm font-medium text-slate-800 dark:text-white">{value}</p>
    </div>
  );
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}