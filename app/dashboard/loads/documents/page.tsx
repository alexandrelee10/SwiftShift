import { requireUser } from "@/lib/requireUser";
import Link from "next/link";
import {
  FileText,
  Download,
  Eye,
  Search,
  Upload,
  Trash2,
  FileCheck2,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { deleteDocument } from "./action";

export default async function DocumentsPage() {
  const session = await requireUser();

  if (!session.user?.email) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!dbUser) throw new Error("User not found");

  const documents = await prisma.document.findMany({
    where: { userId: dbUser.id },
    include: { load: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 dark:bg-[#0b1120] dark:text-slate-100">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Load paperwork
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Documents
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              View and manage BOLs, rate confirmations, PODs, and invoices.
            </p>
          </div>

          <button className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
            <Upload size={16} />
            Upload Document
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total documents" value={documents.length} />

          <StatCard
            label="Completed"
            value={documents.filter((doc) => doc.status === "COMPLETED").length}
          />

          <StatCard
            label="Drafts"
            value={documents.filter((doc) => doc.status === "DRAFT").length}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {["All", "BOL", "Rate Confirmations", "PODs", "Invoices"].map(
                (tab) => (
                  <button
                    key={tab}
                    className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            <div className="relative w-full lg:w-80">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />

              <input
                placeholder="Search documents..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {documents.length > 0 ? (
            documents.map((doc) => <DocumentRow key={doc.id} doc={doc} />)
          ) : (
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
          )}
        </div>
      </div>
    </main>
  );
}

function DocumentRow({ doc }: { doc: any }) {
  const load = doc.load;
  const hasFile = Boolean(doc.fileUrl && doc.fileUrl !== "#");

  return (
    <div className="grid gap-4 border-b border-slate-100 px-5 py-5 transition last:border-0 hover:bg-slate-50 xl:grid-cols-[1fr_auto] xl:items-center dark:border-slate-800 dark:hover:bg-slate-800/60">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
          <FileText size={18} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-slate-950 dark:text-white">
              {formatDocType(doc.type)}
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
        <div className="mr-2">
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            {formatDate(doc.createdAt)}
          </p>
        </div>

        {hasFile && (
          <>
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              title="View document"
            >
              <Eye size={16} />
            </a>

            <a
              href={doc.fileUrl}
              download
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              title="Download document"
            >
              <Download size={16} />
            </a>
          </>
        )}

        {load && doc.type === "BILL_OF_LADING" && (
          <Link
            href={`/dashboard/loads/search/${load.id}/bol`}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:bg-blue-950/50"
          >
            <FileCheck2 size={15} />
            Fill BOL
          </Link>
        )}

        {load && (
          <Link
            href={`/dashboard/loads/search/${load.id}`}
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            Open Load
          </Link>
        )}

        <form action={deleteDocument.bind(null, doc.id)}>
          <button
            type="submit"
            className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
            title="Delete document"
          >
            <Trash2 size={16} />
          </button>
        </form>
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
    COMPLETED:
      "bg-green-50 text-green-700 ring-green-200 dark:bg-green-950/40 dark:text-green-300 dark:ring-green-900/50",
    DRAFT:
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/50",
    REQUIRED:
      "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900/50",
    PENDING:
      "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900/50",
    NOT_STARTED:
      "bg-slate-50 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
        styles[status] ||
        "bg-slate-50 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
      }`}
    >
      {formatDocType(status)}
    </span>
  );
}

function formatDocType(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}