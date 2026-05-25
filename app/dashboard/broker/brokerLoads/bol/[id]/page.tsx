import { requireUser } from "@/lib/requireUser";
import prisma from "@/lib/prisma";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { saveBolFields } from "../actions";

export default async function BolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireUser();

  // id = Document.id
  const doc = await prisma.document.findUnique({
    where: { id },
    include: { billOfLading: true, load: true },
  });

  if (!doc || doc.type !== "BILL_OF_LADING") notFound();

  const bol  = doc.billOfLading;
  const load = doc.load;
  const isComplete = doc.status === "COMPLETE";

  // Show which fields are still missing
  const missingFields: string[] = [];
  if (!bol?.carrierName)    missingFields.push("Carrier Name");
  if (!bol?.trailerNumber)  missingFields.push("Trailer Number");
  if (!bol?.sealNumber)     missingFields.push("Seal Number");
  if (!bol?.commodity)      missingFields.push("Commodity");
  if (!bol?.weight)         missingFields.push("Weight");
  if (!bol?.pieces)         missingFields.push("Pieces");

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900 dark:bg-[#0b1120] dark:text-slate-100">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Back */}
        <Link
          href="/dashboard/broker/brokerLoads/bol"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft size={14} /> Back to Bills of Lading
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {doc.fileName ?? "Bill of Lading"}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Ref #{load.referenceNumber} &middot;{" "}
              {load.originCity}, {load.originState} →{" "}
              {load.destinationCity}, {load.destinationState}
            </p>
          </div>

          {isComplete ? (
            <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 dark:bg-green-950/50 dark:text-green-400">
              <CheckCircle2 size={15} /> Complete
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
              <AlertCircle size={15} /> {missingFields.length} field{missingFields.length !== 1 ? "s" : ""} remaining
            </span>
          )}
        </div>

        {/* Missing fields banner */}
        {!isComplete && missingFields.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/40 dark:bg-red-950/20">
            <AlertCircle size={14} className="shrink-0 text-red-500" />
            <p className="text-xs font-medium text-red-600 dark:text-red-400">
              Fill in to complete:
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

        {/* Form */}
        <form action={saveBolFields} className="space-y-6">
          <input type="hidden" name="documentId" value={doc.id} />

          {/* Ship From */}
          <Card title="Ship From (Shipper)">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                name="shipperName"
                label="Shipper Name"
                defaultValue={bol?.shipperName ?? load.originAddress}
                required
              />
              <Input
                name="shipperAddress"
                label="Shipper Address"
                defaultValue={
                  bol?.shipperAddress ??
                  `${load.originAddress}, ${load.originCity}, ${load.originState}`
                }
                required
              />
            </div>
          </Card>

          {/* Ship To */}
          <Card title="Ship To (Consignee)">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                name="consigneeName"
                label="Consignee Name"
                defaultValue={bol?.consigneeName ?? load.destinationAddress}
                required
              />
              <Input
                name="consigneeAddress"
                label="Consignee Address"
                defaultValue={
                  bol?.consigneeAddress ??
                  `${load.destinationAddress}, ${load.destinationCity}, ${load.destinationState}`
                }
                required
              />
            </div>
          </Card>

          {/* Carrier */}
          <Card title="Carrier Information">
            <div className="grid gap-4 md:grid-cols-3">
              <Input
                name="carrierName"
                label="Carrier Name"
                defaultValue={bol?.carrierName ?? ""}
                highlight={!bol?.carrierName}
                required
              />
              <Input
                name="trailerNumber"
                label="Trailer Number"
                defaultValue={bol?.trailerNumber ?? ""}
                highlight={!bol?.trailerNumber}
                required
              />
              <Input
                name="sealNumber"
                label="Seal Number(s)"
                defaultValue={bol?.sealNumber ?? ""}
                highlight={!bol?.sealNumber}
                required
              />
            </div>
          </Card>

          {/* Freight Details */}
          <Card title="Freight Details">
            <div className="grid gap-4 md:grid-cols-3">
              <Input
                name="weight"
                label="Weight (lbs)"
                defaultValue={bol?.weight?.toString() ?? load.weight?.toString() ?? ""}
                type="number"
                highlight={!bol?.weight}
                required
              />
              <Input
                name="pieces"
                label="Pieces / Packages"
                defaultValue={bol?.pieces?.toString() ?? ""}
                type="number"
                highlight={!bol?.pieces}
                required
              />
              <Input
                name="commodity"
                label="Commodity"
                defaultValue={bol?.commodity ?? load.commodity ?? ""}
                highlight={!bol?.commodity}
                required
              />
            </div>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {missingFields.length === 0
                ? "All fields complete — saving will mark this BOL as complete."
                : `${missingFields.length} field${missingFields.length !== 1 ? "s" : ""} left before this BOL is marked complete.`}
            </p>
            <div className="flex gap-3">
              <Link
                href="/dashboard/broker/brokerLoads/bol"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                {missingFields.length === 0 ? "Save & Complete" : "Save Progress"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Input({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
  highlight = false,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
  highlight?: boolean;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
        {required && <span className="text-red-500">*</span>}
        {highlight && (
          <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
            Missing
          </span>
        )}
      </span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none transition focus:ring-2 dark:text-white dark:bg-slate-950 ${
          highlight
            ? "border-amber-300 bg-amber-50 focus:border-amber-400 focus:ring-amber-500/20 dark:border-amber-700 dark:bg-amber-950/20"
            : "border-slate-200 bg-white focus:border-blue-400 focus:ring-blue-500/20 dark:border-slate-700"
        }`}
      />
    </label>
  );
}