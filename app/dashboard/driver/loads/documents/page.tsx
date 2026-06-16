
import { requireUser } from "@/lib/requireUser";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import {  getDriverDocuments } from "./action";
import Link from "next/link";
import { FileText, Download, Eye, Search } from "lucide-react";

export default async function DriverDocumentsPage() {
  const session = await requireUser();
  if (!session.user?.email) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!dbUser) throw new Error("User not found");
  if (dbUser.role !== "DRIVER") redirect("/unauthorized");

  const { bols, pods } = await getDriverDocuments();


  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 dark:bg-[#0b1120] dark:text-slate-100">
      <div className="space-y-6">

        {/* Header */}
        <div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Load paperwork
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Documents
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            View and download your bills of lading and proof of delivery documents.
          </p>
        </div>


        {/* Document list */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {bols.length === 0 && pods.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <FileText size={22} />
              </div>
              <p className="mt-4 font-medium text-slate-900 dark:text-white">
                No documents yet
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Documents attached to your loads will show up here.
              </p>
            </div>
          ) : (
            <>
              {bols.map((doc) => <BolRow key={doc.id} doc={doc} />)}
              {pods.map((doc) => <PodRow key={doc.id} doc={doc} />)}
            </>
          )}
        </div>

      </div>
    </main>
  );
}

function BolRow({ doc }: { doc: any }) {
  const load = doc.load;
  const bol = doc.billOfLading;
const pdfUrl = `/api/documents/${doc.id}/bol`;

  return (
    <div className="grid gap-4 border-b border-slate-100 px-5 py-5 transition last:border-0 hover:bg-slate-50 xl:grid-cols-[1fr_auto] xl:items-center dark:border-slate-800 dark:hover:bg-slate-800/60">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
          <FileText size={18} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-slate-950 dark:text-white">
              Bill of lading
            </p>
            <StatusBadge status={doc.status} />
          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Load #{load?.referenceNumber || "Unknown"}
          </p>

          {load && (
            <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
              {load.originCity}, {load.originState} →{" "}
              {load.destinationCity}, {load.destinationState}
            </p>
          )}

          {bol && (
            <p className="mt-1 truncate text-xs text-slate-400 dark:text-slate-500">
              {bol.shipperName} → {bol.consigneeName}
              {bol.weight
                ? ` · ${Number(bol.weight).toLocaleString()} lbs`
                : ""}
              {bol.pieces ? ` · ${bol.pieces} pcs` : ""}
            </p>
          )}

          <p className="mt-1 truncate text-xs text-slate-400 dark:text-slate-500">
            {load?.referenceNumber}-bol.pdf
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 xl:justify-end">
        <p className="mr-2 text-xs text-slate-400 dark:text-slate-500">
          {formatDate(doc.createdAt)}
        </p>

        {bol && (
          <>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              title="View BOL"
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Eye size={16} />
            </a>
            <a
              href={pdfUrl}
              download={`${load?.referenceNumber}-bol.pdf`}
              title="Download BOL"
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Download size={16} />
            </a>
          </>
        )}

        {load && (
          <Link
            href={`/dashboard/driver/loads/${load.id}`}
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            Open load
          </Link>
        )}
      </div>
    </div>
  );
}

function PodRow({ doc }: { doc: any }) {
  const load = doc.load;
  const hasFile = Boolean(doc.fileUrl && doc.fileUrl !== "#");

  return (
    <div className="grid gap-4 border-b border-slate-100 px-5 py-5 transition last:border-0 hover:bg-slate-50 xl:grid-cols-[1fr_auto] xl:items-center dark:border-slate-800 dark:hover:bg-slate-800/60">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400">
          <FileText size={18} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-slate-950 dark:text-white">
              Proof of delivery
            </p>
            <StatusBadge status={doc.status} />
          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Load #{load?.referenceNumber || "Unknown"}
          </p>

          {load && (
            <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
              {load.originCity}, {load.originState} →{" "}
              {load.destinationCity}, {load.destinationState}
            </p>
          )}

          <p className="mt-2 truncate text-xs text-slate-400 dark:text-slate-500">
            {doc.fileName || "No file generated yet"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 xl:justify-end">
        <p className="mr-2 text-xs text-slate-400 dark:text-slate-500">
          {formatDate(doc.createdAt)}
        </p>

        {hasFile && (
          <>
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noreferrer"
              title="View POD"
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Eye size={16} />
            </a>
            <a
              href={doc.fileUrl}
              download={doc.fileName}
              title="Download POD"
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Download size={16} />
            </a>
          </>
        )}

        {load && (
          <Link
            href={`/dashboard/driver/loads/${load.id}`}
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            Open load
          </Link>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    COMPLETED:   "bg-green-50 text-green-700 ring-green-200 dark:bg-green-950/40 dark:text-green-300 dark:ring-green-900/50",
    DRAFT:       "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/50",
    REQUIRED:    "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900/50",
    PENDING:     "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900/50",
    NOT_STARTED: "bg-slate-50 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
        styles[status] || styles.NOT_STARTED
      }`}
    >
      {status.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
    </span>
  );
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}