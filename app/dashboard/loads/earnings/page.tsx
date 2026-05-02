import { requireUser } from "@/lib/requireUser";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ChevronDown, Download, FileText } from "lucide-react";

export default async function EarningsPage({
  searchParams,
}: {
  searchParams: Promise<{ loadId?: string }>;
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
      deliveryDate: "desc",
    },
  });

  // Selected load
  const selectedLoad =
    deliveredLoads.find((load) => load.id === params.loadId) ||
    deliveredLoads[0];

// Income
  const grossPay = selectedLoad ? Number(selectedLoad.rate) : 0;

  const platformFee = grossPay * 0.05;
  const taxEstimate = grossPay * 0.15;
  const fuelAdvance = grossPay * 0.08;
  const totalDeductions = platformFee + taxEstimate + fuelAdvance;

  const netPay = grossPay - totalDeductions;
  // Chart display deductions
  const greenPercent = grossPay ? (netPay / grossPay) * 100 : 0;
  const redPercent = grossPay ? (totalDeductions / grossPay) * 100 : 0;

  const totalGross = deliveredLoads.reduce(
    (sum, load) => sum + Number(load.rate),
    0
  );

  const totalFees = totalGross * 0.05;
  const totalTaxEstimate = totalGross * 0.15;
  const totalAdvances = totalGross * 0.08;
  const totalNet = totalGross - totalFees - totalTaxEstimate - totalAdvances;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-6 text-slate-900">
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              Earnings
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track your pay, deductions, and delivered load statements.
            </p>
          </div>

          <button className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
            <Download size={16} />
            Export CSV
          </button>
        </div>

        <div className="grid gap-5 xl:grid-cols-[300px_1fr_300px]">
          {/* LEFT: Pay Statements */}
          <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Pay Statements
              </h2>

              <button className="mt-3 flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                2026
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="max-h-[650px] overflow-y-auto">
              {deliveredLoads.length > 0 ? (
                deliveredLoads.map((load) => {
                  const gross = Number(load.rate);
                  const net = gross - gross * 0.28;

                  return (
                    <Link
                      key={load.id}
                      href={`/dashboard/loads/earnings?loadId=${load.id}`}
                      className={`block border-b border-slate-100 p-4 hover:bg-slate-50 ${
                        selectedLoad?.id === load.id
                          ? "border-l-4 border-l-blue-600 bg-blue-50"
                          : ""
                      }`}
                    >
                      <p className="text-sm font-medium text-slate-900">
                        {formatDate(load.deliveryDate || load.updatedAt)}
                      </p>

                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <MiniPay label="Gross" value={`$${gross.toFixed(2)}`} />
                        <MiniPay label="Take Home" value={`$${net.toFixed(2)}`} />
                        <MiniPay label="Load" value={load.referenceNumber} />
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="p-6 text-sm text-slate-500">
                  No delivered loads yet.
                </div>
              )}
            </div>
          </aside>

          {/* Center: Chart + Earning History */}
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Statement Details
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-950">
                    {selectedLoad
                      ? `Load #${selectedLoad.referenceNumber}`
                      : "No statement selected"}
                  </h2>
                </div>

                {selectedLoad && (
                  <Link
                    href={`/dashboard/loads/search/${selectedLoad.id}`}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-slate-50"
                  >
                    View Load
                  </Link>
                )}
              </div>

              {selectedLoad ? (
                <>
                  <div className="grid gap-8 py-7 lg:grid-cols-[240px_1fr] lg:items-center">
                    <div>
                      <div
                        className="mx-auto flex h-52 w-52 items-center justify-center rounded-full"
                        style={{
                          background: `conic-gradient(
                            #22c55e 0% ${greenPercent}%,
                            #ef4444 ${greenPercent}% ${
                            greenPercent + redPercent
                          }%,
                            #e5e7eb ${greenPercent + redPercent}% 100%
                          )`,
                        }}
                      >
                        <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white">
                          <p className="text-xs text-slate-500">Take Home</p>
                          <p className="text-2xl font-semibold text-green-700">
                            ${netPay.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-center gap-5 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          Take Home
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          Costs
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Route</p>
                      <h3 className="mt-1 text-xl font-semibold text-slate-950">
                        {selectedLoad.originCity}, {selectedLoad.originState} →{" "}
                        {selectedLoad.destinationCity},{" "}
                        {selectedLoad.destinationState}
                      </h3>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <InfoCard
                          label="Equipment"
                          value={selectedLoad.equipmentType}
                        />
                        <InfoCard
                          label="Distance"
                          value={
                            selectedLoad.distanceMiles
                              ? `${selectedLoad.distanceMiles.toLocaleString()} mi`
                              : "—"
                          }
                        />
                        <InfoCard
                          label="Broker"
                          value={
                            selectedLoad.broker
                              ? selectedLoad.broker.firstName
                              : "Broker"
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <PayBreakdownRow
                      label="Gross Pay"
                      value={`$${grossPay.toFixed(2)}`}
                    />
                    <PayBreakdownRow
                      label="Platform Fee"
                      value={`-$${platformFee.toFixed(2)}`}
                      negative
                    />
                    <PayBreakdownRow
                      label="Potential Tax Deduction"
                      value={`-$${taxEstimate.toFixed(2)}`}
                      negative
                    />
                    <PayBreakdownRow
                      label="Fuel / Advances"
                      value={`-$${fuelAdvance.toFixed(2)}`}
                      negative
                    />
                    <PayBreakdownRow
                      label="Take Home"
                      value={`$${netPay.toFixed(2)}`}
                      strong
                    />
                  </div>
                </>
              ) : (
                <div className="p-10 text-center text-sm text-slate-500">
                  Delivered loads will appear here once completed.
                </div>
              )}
            </div>

            {/* HISTORY */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Earnings History
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Completed load payouts and payment status.
                  </p>
                </div>

                <input
                  placeholder="Search loads..."
                  className="w-full rounded-lg border border-slate-200 py-2 pl-3 pr-3 text-sm outline-none focus:border-blue-400 md:w-72"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">Load #</th>
                      <th className="px-5 py-3 font-medium">Route</th>
                      <th className="px-5 py-3 font-medium">Pickup</th>
                      <th className="px-5 py-3 font-medium">Delivery</th>
                      <th className="px-5 py-3 font-medium">Rate</th>
                      <th className="px-5 py-3 font-medium">Net</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {deliveredLoads.length > 0 ? (
                      deliveredLoads.map((load) => {
                        const gross = Number(load.rate);
                        const net = gross - gross * 0.28;

                        return (
                          <tr
                            key={load.id}
                            className="border-t border-slate-100 hover:bg-slate-50"
                          >
                            <td className="px-5 py-4 font-medium text-slate-900">
                              {load.referenceNumber}
                            </td>
                            <td className="px-5 py-4 text-slate-600">
                              {load.originCity}, {load.originState}
                              <br />
                              <span className="text-xs text-slate-400">
                                → {load.destinationCity},{" "}
                                {load.destinationState}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-slate-600">
                              {formatDate(load.pickupDate)}
                            </td>
                            <td className="px-5 py-4 text-slate-600">
                              {formatDate(load.deliveryDate)}
                            </td>
                            <td className="px-5 py-4 font-medium">
                              ${gross.toFixed(2)}
                            </td>
                            <td className="px-5 py-4 font-medium">
                              ${net.toFixed(2)}
                            </td>
                            <td className="px-5 py-4">
                              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                                PAID
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-5 py-10 text-center text-slate-500"
                        >
                          No earnings history yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Right: Earning Summary + Tax Docs */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                Earnings Summary
              </h2>

              <div className="mt-5 space-y-4">
                <SummaryRow
                  label="Total Gross"
                  value={`$${totalGross.toFixed(2)}`}
                />
                <SummaryRow
                  label="Platform Fees"
                  value={`-$${totalFees.toFixed(2)}`}
                  negative
                />
                <SummaryRow
                  label="Potential Taxes"
                  value={`-$${totalTaxEstimate.toFixed(2)}`}
                  negative
                />
                <SummaryRow
                  label="Fuel / Advances"
                  value={`-$${totalAdvances.toFixed(2)}`}
                  negative
                />
                <SummaryRow
                  label="Estimated Net"
                  value={`$${totalNet.toFixed(2)}`}
                  strong
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                Tax Documents
              </h2>

              <div className="mt-4 space-y-3">
                <TaxRow title="2026 1099 Statement" />
                <TaxRow title="2025 Annual Summary" />
                <TaxRow title="Settlement Report" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

// Dynamic Helper Functions
function MiniPay({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 truncate font-medium text-slate-900">{value}</p>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-medium text-slate-900">
        {value}
      </p>
    </div>
  );
}

function PayBreakdownRow({
  label,
  value,
  negative,
  strong,
}: {
  label: string;
  value: string;
  negative?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
      <p className="text-sm text-slate-600">{label}</p>
      <p
        className={`text-sm ${
          strong
            ? "font-semibold text-green-700"
            : negative
              ? "font-medium text-red-600"
              : "font-medium text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  negative,
  strong,
}: {
  label: string;
  value: string;
  negative?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
      <p className="text-sm text-slate-500">{label}</p>
      <p
        className={`text-sm ${
          strong
            ? "font-semibold text-green-700"
            : negative
              ? "font-medium text-red-600"
              : "font-medium text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function TaxRow({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-3">
      <div className="flex items-center gap-2">
        <FileText size={16} className="text-blue-600" />
        <p className="text-sm font-medium text-slate-700">{title}</p>
      </div>

      <Download size={15} className="text-slate-400" />
    </div>
  );
}

function formatDate(date: Date | string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}