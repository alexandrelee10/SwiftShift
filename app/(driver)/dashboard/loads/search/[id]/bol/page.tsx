import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { saveBol } from "./action";

export default async function BolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireUser();
  const { id } = await params;

  if (!session.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const load = await prisma.load.findUnique({
    where: {
      id,
    },
    include: {
      broker: true,
      documents: {
        where: {
          type: "BILL_OF_LADING",
          userId: user.id,
        },
        include: {
          billOfLading: true,
        },
      },
    },
  });

  if (!load) {
    throw new Error("Load not found");
  }

  const document = load.documents[0];
  const bol = document?.billOfLading;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          href={`/dashboard/loads/search/${load.id}`}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Load
        </Link>

        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Bill of Lading
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Auto-filled from Load #{load.referenceNumber}. Fill in the missing
            shipment details.
          </p>
        </div>

        <form
          action={saveBol.bind(null, load.id)}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label="Shipper Name"
              name="shipperName"
              defaultValue={bol?.shipperName || ""}
              placeholder="Ex: ABC Warehouse"
            />

            <Field
              label="Shipper Address"
              name="shipperAddress"
              defaultValue={
                bol?.shipperAddress ||
                `${load.originAddress}, ${load.originCity}, ${load.originState}`
              }
            />

            <Field
              label="Consignee Name"
              name="consigneeName"
              defaultValue={bol?.consigneeName || ""}
              placeholder="Ex: Miami Distribution Center"
            />

            <Field
              label="Consignee Address"
              name="consigneeAddress"
              defaultValue={
                bol?.consigneeAddress ||
                `${load.destinationAddress}, ${load.destinationCity}, ${load.destinationState}`
              }
            />

            <Field
              label="Carrier Name"
              name="carrierName"
              defaultValue={bol?.carrierName || `${user.firstName} ${user.lastName}`}
            />

            <Field
              label="Trailer Number"
              name="trailerNumber"
              defaultValue={bol?.trailerNumber || ""}
              placeholder="Ex: TRL-1029"
            />

            <Field
              label="Seal Number"
              name="sealNumber"
              defaultValue={bol?.sealNumber || ""}
              placeholder="Ex: SL-88291"
            />

            <Field
              label="Commodity"
              name="commodity"
              defaultValue={bol?.commodity || load.commodity || "General Freight"}
            />

            <Field
              label="Weight"
              name="weight"
              type="number"
              defaultValue={String(bol?.weight || load.weight || "")}
            />

            <Field
              label="Pieces"
              name="pieces"
              type="number"
              defaultValue={String(bol?.pieces || "")}
              placeholder="Ex: 20"
            />
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <Link
              href={`/dashboard/loads/search/${load.id}`}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save BOL
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
      />
    </label>
  );
}