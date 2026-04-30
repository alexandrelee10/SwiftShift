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
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">Load paperwork</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
              Documents
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              View and manage BOLs, rate confirmations, PODs, and invoices.
            </p>
          </div>

          <button className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
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

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {["All", "BOL", "Rate Confirmations", "PODs", "Invoices"].map(
                (tab) => (
                  <button
                    key={tab}
                    className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                placeholder="Search documents..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white md:w-80"
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {documents.length > 0 ? (
            documents.map((doc) => <DocumentRow key={doc.id} doc={doc} />)
          ) : (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FileText size={22} />
              </div>
              <p className="mt-4 font-medium text-slate-900">
                No documents yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
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
    <div className="grid gap-4 border-b border-slate-100 px-5 py-5 last:border-0 md:grid-cols-[1.2fr_220px_150px_auto] md:items-center">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <FileText size={20} />
        </div>

        <div className="min-w-0">
          <p className="truncate font-medium text-slate-950">
            {formatDocType(doc.type)}
          </p>
          <p className="mt-1 truncate text-sm text-slate-500">
            Load #{load?.referenceNumber || "Unknown"}{" "}
            {load &&
              `• ${load.originCity}, ${load.originState} → ${load.destinationCity}, ${load.destinationState}`}
          </p>
        </div>
      </div>

      <div>
        <p className="truncate text-sm font-medium text-slate-900">
          {doc.fileName || "No file generated yet"}
        </p>
        <p className="mt-1 text-xs text-slate-500">File name</p>
      </div>

      <div>
        <StatusBadge status={doc.status} />
        <p className="mt-1 text-xs text-slate-500">
          {formatDate(doc.createdAt)}
        </p>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        {hasFile && (
          <>
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
              title="View document"
            >
              <Eye size={16} />
            </a>

            <a
              href={doc.fileUrl}
              download
              className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
              title="Download document"
            >
              <Download size={16} />
            </a>
          </>
        )}

        {load && doc.type === "BILL_OF_LADING" && (
          <Link
            href={`/dashboard/loads/search/${load.id}/bol`}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            <FileCheck2 size={15} />
            Fill BOL
          </Link>
        )}

        {load && (
          <Link
            href={`/dashboard/loads/search/${load.id}`}
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Open Load
          </Link>
        )}

        <form action={deleteDocument.bind(null, doc.id)}>
          <button
            type="submit"
            className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    COMPLETED: "bg-green-50 text-green-700 ring-green-200",
    DRAFT: "bg-amber-50 text-amber-700 ring-amber-200",
    REQUIRED: "bg-red-50 text-red-700 ring-red-200",
    PENDING: "bg-blue-50 text-blue-700 ring-blue-200",
    NOT_STARTED: "bg-slate-50 text-slate-600 ring-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
        styles[status] || "bg-slate-50 text-slate-600 ring-slate-200"
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


// Make sure you update the badges based on the status 
// Also make sure that documents dont save duplicates on the page