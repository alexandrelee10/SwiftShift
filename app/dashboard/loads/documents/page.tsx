import { requireUser } from "@/lib/requireUser";
import Link from "next/link";
import { FileText, Download, Eye, Search, Upload } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function DocumentsPage() {
  const session = await requireUser();

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

  const documents = await prisma.document.findMany({
    where: {
      userId: dbUser.id,
    },
    include: {
      load: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Documents
            </h1>
            <p className="text-sm text-slate-500">
              Manage rate confirmations, PODs, invoices, and load paperwork.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <Upload size={16} />
            Upload Document
          </button>
        </div>

        {/* FILTER BAR */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {["All", "Rate Confirmations", "PODs", "Invoices"].map((tab) => (
                <button
                  key={tab}
                  className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200"
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                placeholder="Search documents..."
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 md:w-72"
              />
            </div>
          </div>
        </div>

        {/* DOCUMENT LIST */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {documents.length > 0 ? (
            documents.map((doc) => <DocumentRow key={doc.id} doc={doc} />)
          ) : (
            <div className="p-10 text-center">
              <p className="font-medium text-slate-900">No documents yet</p>
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

  return (
    <div className="grid gap-4 border-b border-slate-100 px-5 py-4 last:border-0 md:grid-cols-[1fr_180px_140px_auto] md:items-center">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <FileText size={19} />
        </div>

        <div>
          <p className="font-medium text-slate-900">
            Load #{load?.referenceNumber || "Unknown"}
          </p>
          <p className="text-sm text-slate-500">
            {load
              ? `${load.originCity}, ${load.originState} → ${load.destinationCity}, ${load.destinationState}`
              : "No load attached"}
          </p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-900">{doc.type}</p>
        <p className="text-xs text-slate-500">{doc.fileName}</p>
      </div>

      <div>
        <p className="text-sm text-slate-900">{formatDate(doc.createdAt)}</p>
        <p className="text-xs text-slate-500">{doc.status}</p>
      </div>

      <div className="flex justify-end gap-2">
        <a
          href={doc.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
        >
          <Eye size={16} />
        </a>

        <a
          href={doc.fileUrl}
          download
          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
        >
          <Download size={16} />
        </a>

        {load && (
          <Link
            href={`/dashboard/loads/search/${load.id}`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Open Load
          </Link>
        )}
      </div>
    </div>
  );
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}