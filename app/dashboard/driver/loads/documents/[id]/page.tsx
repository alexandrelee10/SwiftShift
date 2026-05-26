import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Download } from "lucide-react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DriverBolViewPage({ params }: PageProps) {
  const { id } = await params;

  const session = await requireUser();
  if (!session.user?.email) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!dbUser) throw new Error("User not found");
  if (dbUser.role !== "DRIVER") redirect("/unauthorized");

  const document = await prisma.document.findFirst({
    where: {
      id,
      userId: dbUser.id,
      type: "BILL_OF_LADING",
    },
    include: {
      load: true,
      billOfLading: true,
    },
  });

  if (!document || !document.billOfLading) notFound();

  const load = document.load;
  const bol = document.billOfLading;
  const pdfUrl = `/api/documents/${document.id}/bol`;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 dark:bg-[#0b1120] dark:text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Bill of Lading
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Load #{load.referenceNumber}
            </h1>
          </div>

          <div className="flex gap-2">
            <Link
              href="/dashboard/driver/loads/documents"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Back
            </Link>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <Download size={16} />
              View PDF
            </a>
          </div>
        </div>

        <section className="overflow-hidden rounded-xl border border-black bg-white text-black shadow-sm">
          <div className="grid grid-cols-[1fr_2fr_1fr] items-center border-b border-black">
            <div className="p-2 text-sm font-semibold">
              Date: {formatDate(bol.createdAt)}
            </div>
            <div className="p-2 text-center text-3xl font-black tracking-tight">
              BILL OF LADING
            </div>
            <div className="p-2 text-right text-xl font-bold">
              Page 1 of _____
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr]">
            <div className="border-black lg:border-r">
              <BlackBar>SHIP FROM</BlackBar>
              <InfoLines
                rows={[
                  ["Name:", bol.shipperName],
                  ["Address:", bol.shipperAddress],
                  ["City/State/Zip:", `${load.originCity}, ${load.originState}`],
                  ["SID#:", ""],
                ]}
                right="FOB: ☐"
              />

              <BlackBar>SHIP TO</BlackBar>
              <InfoLines
                rows={[
                  ["Name:", bol.consigneeName],
                  ["Address:", bol.consigneeAddress],
                  [
                    "City/State/Zip:",
                    `${load.destinationCity}, ${load.destinationState}`,
                  ],
                  ["CID#:", ""],
                ]}
                topRight="Location #: _________"
                right="FOB: ☐"
              />

              <BlackBar>THIRD PARTY FREIGHT CHARGES BILL TO:</BlackBar>
              <InfoLines
                rows={[
                  ["Name:", ""],
                  ["Address:", ""],
                  ["City/State/Zip:", ""],
                ]}
              />

              <div className="min-h-16 border-t border-black p-2 text-lg">
                <p>SPECIAL INSTRUCTIONS:</p>
                <p className="text-sm">{load.notes || ""}</p>
              </div>
            </div>

            <div>
              <div className="min-h-28 border-b border-black p-3">
                <p className="text-lg font-black">
                  Bill of Lading Number:{" "}
                  <span className="font-normal">{load.referenceNumber}</span>
                </p>
                <p className="mt-8 text-center text-2xl font-black tracking-[0.35em] text-slate-300">
                  BAR CODE SPACE
                </p>
              </div>

              <div className="border-b border-black p-3">
                <p className="text-lg font-black">
                  CARRIER NAME:{" "}
                  <span className="font-normal">{bol.carrierName || ""}</span>
                </p>
                <p>Trailer number: {bol.trailerNumber || ""}</p>
                <p>Seal number(s): {bol.sealNumber || ""}</p>
              </div>

              <div className="min-h-28 border-b border-black p-3">
                <p className="text-lg font-black">SCAC:</p>
                <p className="text-lg font-black">Pro number:</p>
                <p className="mt-6 text-center text-2xl font-black tracking-[0.35em] text-slate-300">
                  BAR CODE SPACE
                </p>
              </div>

              <div className="p-3">
                <p className="font-black">
                  Freight Charge Terms:{" "}
                  <span className="italic">
                    freight charges are prepaid unless marked otherwise
                  </span>
                </p>
                <div className="mt-2 flex justify-around font-semibold">
                  <span>Prepaid ______</span>
                  <span>Collect ______</span>
                  <span>3rd Party ______</span>
                </div>
                <p className="mt-2 text-center">
                  ☐ Master Bill of Lading: with attached underlying Bills of
                  Lading
                </p>
              </div>
            </div>
          </div>

          <BlackBar>CUSTOMER ORDER INFORMATION</BlackBar>

          <div className="grid grid-cols-[2fr_.7fr_.7fr_.8fr_3fr] border-b border-black text-center text-sm font-black">
            <div className="border-r border-black p-2">CUSTOMER ORDER NUMBER</div>
            <div className="border-r border-black p-2"># PKGS</div>
            <div className="border-r border-black p-2">WEIGHT</div>
            <div className="border-r border-black p-2">PALLET/SLIP</div>
            <div className="p-2">ADDITIONAL SHIPPER INFO</div>
          </div>

          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="grid min-h-8 grid-cols-[2fr_.7fr_.7fr_.8fr_3fr] border-b border-black text-center text-sm"
            >
              <div className="border-r border-black p-1">
                {i === 0 ? load.referenceNumber : ""}
              </div>
              <div className="border-r border-black p-1">
                {i === 0 ? bol.pieces || "" : ""}
              </div>
              <div className="border-r border-black p-1">
                {i === 0 ? bol.weight || load.weight || "" : ""}
              </div>
              <div className="border-r border-black p-1 font-bold">Y&nbsp;&nbsp;&nbsp;N</div>
              <div className="p-1">
                {i === 0 ? bol.commodity || load.commodity || "" : ""}
              </div>
            </div>
          ))}

          <div className="border-b border-black p-2 text-lg font-black">
            GRAND TOTAL
          </div>

          <BlackBar>CARRIER INFORMATION</BlackBar>

          <div className="grid grid-cols-[.8fr_.8fr_.8fr_.8fr_1fr_.7fr_4fr_1.2fr_1fr] border-b border-black text-center text-sm font-black">
            <HeaderCell>QTY</HeaderCell>
            <HeaderCell>TYPE</HeaderCell>
            <HeaderCell>QTY</HeaderCell>
            <HeaderCell>TYPE</HeaderCell>
            <HeaderCell>WEIGHT</HeaderCell>
            <HeaderCell>H.M. (X)</HeaderCell>
            <HeaderCell>COMMODITY DESCRIPTION</HeaderCell>
            <HeaderCell>NMFC #</HeaderCell>
            <div className="p-2">CLASS</div>
          </div>

          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="grid min-h-8 grid-cols-[.8fr_.8fr_.8fr_.8fr_1fr_.7fr_4fr_1.2fr_1fr] border-b border-black text-center text-sm"
            >
              <Cell>{i === 0 ? bol.pieces || "" : ""}</Cell>
              <Cell>{i === 0 ? "PCS" : ""}</Cell>
              <Cell>{i === 0 ? bol.pieces || "" : ""}</Cell>
              <Cell>{i === 0 ? "Package" : ""}</Cell>
              <Cell>{i === 0 ? bol.weight || load.weight || "" : ""}</Cell>
              <Cell></Cell>
              <Cell>{i === 0 ? bol.commodity || load.commodity || "" : ""}</Cell>
              <Cell></Cell>
              <div className="p-1"></div>
            </div>
          ))}

          <div className="border-b border-black p-2 text-center text-lg font-black">
            GRAND TOTAL
          </div>

          <div className="grid grid-cols-1 border-b border-black lg:grid-cols-[1.4fr_1fr]">
            <div className="border-black p-2 text-xs lg:border-r">
              Where the rate is dependent on value, shippers are required to
              state specifically in writing the agreed or declared value of the
              property as follows:
              <br />
              “The agreed or declared value of the property is specifically
              stated by the shipper to be not exceeding ______ per ______.”
            </div>
            <div className="p-2 text-center font-bold">
              <p>COD Amount: $ __________________</p>
              <p>Fee Terms: Collect: ☐ &nbsp;&nbsp; Prepaid: ☐</p>
              <p>Customer check acceptable: ☐</p>
            </div>
          </div>

          <div className="border-b border-black p-2 text-sm font-black">
            NOTE Liability Limitation for loss or damage in this shipment may be
            applicable.
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4">
            <Signature title="SHIPPER SIGNATURE / DATE" />
            <Signature title="Trailer Loaded:" lines={["☐ By Shipper", "☐ By Driver"]} />
            <Signature
              title="Freight Counted:"
              lines={[
                "☐ By Shipper",
                "☐ By Driver/pallets said to contain",
                "☐ By Driver/Pieces",
              ]}
            />
            <Signature title="CARRIER SIGNATURE / PICKUP DATE" last />
          </div>
        </section>
      </div>
    </main>
  );
}

function BlackBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black px-2 py-1 text-center text-sm font-black text-white">
      {children}
    </div>
  );
}

function InfoLines({
  rows,
  right,
  topRight,
}: {
  rows: [string, string | number | null | undefined][];
  right?: string;
  topRight?: string;
}) {
  return (
    <div className="relative min-h-28 p-3 text-lg">
      {topRight && <p className="absolute right-4 top-3 text-base">{topRight}</p>}
      {rows.map(([label, value]) => (
        <p key={label}>
          <span className="font-semibold">{label}</span> {value || ""}
        </p>
      ))}
      {right && <p className="absolute bottom-2 right-4 font-semibold">{right}</p>}
    </div>
  );
}

function HeaderCell({ children }: { children: React.ReactNode }) {
  return <div className="border-r border-black p-2">{children}</div>;
}

function Cell({ children }: { children?: React.ReactNode }) {
  return <div className="border-r border-black p-1">{children}</div>;
}

function Signature({
  title,
  lines = [],
  last = false,
}: {
  title: string;
  lines?: string[];
  last?: boolean;
}) {
  return (
    <div className={`${last ? "" : "border-r"} min-h-24 border-black p-2`}>
      <p className="font-black">{title}</p>
      {lines.length > 0 ? (
        <div className="mt-2 space-y-1 text-sm">
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs">
          This is to certify that the above named materials are properly
          classified, packaged, marked and labeled.
        </p>
      )}
    </div>
  );
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}