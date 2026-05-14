import StatusPage from "@/app/components/shared/StatusPage";
import { requireUser } from "@/lib/requireUser";
import {
  AlertTriangle,
  ChevronRight,
  Eye,
  MapPin,
  Shield,
} from "lucide-react";

import TA from "@/public/assets/fuel/TA.svg";
import loves from "@/public/assets/fuel/love's.png";
import p from "@/public/assets/fuel/p.png";

import Image, { type StaticImageData } from "next/image";

export default async function FuelCardPage() {
  const session = await requireUser();

  if (!session.user?.email) {
    return (
      <StatusPage
        title="User Unauthorized"
        message="User is not authorized"
        ctaLabel="Sign in"
        ctaHref="/sign-in"
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900 dark:bg-[#0b1120] dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Fuel Card
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your fuel card, transactions, limits, and spending.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Available Balance"
            value="$1,245.75"
            desc="of $2,500.00 limit"
          />
          <StatCard
            title="This Month Spent"
            value="$1,254.25"
            desc="32 transactions"
          />
          <StatCard
            title="Savings This Month"
            value="$87.30"
            desc="vs. avg. price/gal"
          />
          <StatCard
            title="Gallons Purchased"
            value="412.60"
            desc="This month"
          />
        </section>

        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <section className="space-y-5">
            <Card>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Fuel Card
              </h2>

              <div className="mx-auto mt-3 w-fit max-w-md rounded-2xl bg-slate-950 p-7 text-white shadow-lg dark:border dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">COMDATA</p>
                  <p className="text-xs uppercase text-slate-300">Fuel Card</p>
                </div>

                <p className="mt-10 font-mono text-2xl tracking-[0.25em]">
                  7083 9900 1234 5678
                </p>

                <div className="mt-8 flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase text-slate-400">Driver</p>
                    <p className="mt-1 text-sm font-medium">
                      {session.user.name || "Driver"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-slate-400">
                      Valid Thru
                    </p>
                    <p className="mt-1 text-sm font-medium">04/27</p>
                  </div>
                </div>
              </div>

              <div className="mx-auto mt-5 grid w-fit gap-4 sm:grid-cols-2">
                <InfoLine label="Card Status" value="Active" badge />
                <InfoLine label="Card Number" value="•••• 5678" />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-blue-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800">
                  <Eye size={16} />
                  View PIN
                </button>

                <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/30">
                  <AlertTriangle size={16} />
                  Report Lost/Stolen
                </button>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Spending Overview
                </h2>
                <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                  This Month
                </button>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
                <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-[conic-gradient(#2563eb_0_82%,#22c55e_82%_90%,#f97316_90%_96%,#a855f7_96%_100%)]">
                  <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white dark:bg-slate-950">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Total Spent
                    </p>
                    <p className="text-xl font-semibold text-slate-900 dark:text-white">
                      $1,254.25
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Breakdown
                    color="bg-blue-600"
                    label="Fuel"
                    value="$1,087.18"
                    percent="86.7%"
                  />
                  <Breakdown
                    color="bg-green-500"
                    label="DEF"
                    value="$98.42"
                    percent="7.8%"
                  />
                  <Breakdown
                    color="bg-orange-500"
                    label="Tires"
                    value="$35.75"
                    percent="2.8%"
                  />
                  <Breakdown
                    color="bg-purple-500"
                    label="Other"
                    value="$32.90"
                    percent="2.7%"
                  />
                </div>
              </div>
            </Card>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Recent Transactions
                </h2>
                <button className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  View all
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                    <tr>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Merchant</th>
                      <th className="px-5 py-3">Location</th>
                      <th className="px-5 py-3">Gallons</th>
                      <th className="px-5 py-3">Amount</th>
                      <th className="px-5 py-3">Type</th>
                    </tr>
                  </thead>

                  <tbody>
                    {transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="border-t border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
                      >
                        <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                          {tx.date}
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">
                          {tx.merchant}
                        </td>
                        <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                          {tx.location}
                        </td>
                        <td className="px-5 py-4 text-slate-900 dark:text-slate-200">
                          {tx.gallons}
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">
                          ${tx.amount}
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950/50 dark:text-green-300">
                            {tx.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <Card>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Card Controls
              </h2>

              <div className="mt-5 space-y-4">
                <ToggleRow label="Card is Active" active />
                <ToggleRow label="International Usage" />
                <ToggleRow label="ATM Withdrawals" />
              </div>
            </Card>

            <Card>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Spending Limit
              </h2>

              <Limit
                label="Monthly Limit"
                value="$2,500.00"
                spent="$1,254.25 spent (50%)"
                width="w-1/2"
              />
              <Limit
                label="Daily Limit"
                value="$750.00"
                spent="$214.50 spent (29%)"
                width="w-[29%]"
              />
            </Card>

            <Card>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Accepted At
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <LogoBox label="Pilot" src={p} />
                <LogoBox label="Love's" src={loves} />
                <LogoBox label="TA" src={TA} />
                <LogoBox label="Sapp Bros" />
              </div>
            </Card>

            <Card>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Recent Locations
              </h2>

              <div className="mt-4 space-y-4">
                {locations.map((location) => (
                  <div
                    key={location.name}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {location.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {location.city}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {location.date}
                        </p>
                      </div>
                    </div>

                    <ChevronRight
                      size={16}
                      className="text-slate-400 dark:text-slate-500"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </aside>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/50 dark:bg-blue-950/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Shield size={18} />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Fuel Card Security
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Keep your PIN secure and report suspicious activity
                  immediately.
                </p>
              </div>
            </div>

            <button className="w-fit rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-900/60 dark:bg-slate-900 dark:text-blue-400 dark:hover:bg-slate-800">
              Report an Issue
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {children}
    </div>
  );
}

function StatCard({
  title,
  value,
  desc,
}: {
  title: string;
  value: string;
  desc: string;
}) {
  return (
    <Card>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{desc}</p>
    </Card>
  );
}

function InfoLine({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      {badge ? (
        <span className="mt-2 inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950/50 dark:text-green-300">
          {value}
        </span>
      ) : (
        <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
          {value}
        </p>
      )}
    </div>
  );
}

function Breakdown({
  color,
  label,
  value,
  percent,
}: {
  color: string;
  label: string;
  value: string;
  percent: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-sm">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <p className="font-medium text-slate-900 dark:text-white">{label}</p>
      </div>
      <p className="text-slate-900 dark:text-slate-200">{value}</p>
      <p className="text-slate-500 dark:text-slate-400">{percent}</p>
    </div>
  );
}

function ToggleRow({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 dark:border-slate-800">
      <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
      <div
        className={`flex h-6 w-11 items-center rounded-full p-1 ${
          active ? "bg-green-500" : "bg-slate-300 dark:bg-slate-700"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white transition ${
            active ? "translate-x-5" : ""
          }`}
        />
      </div>
    </div>
  );
}

function Limit({
  label,
  value,
  spent,
  width,
}: {
  label: string;
  value: string;
  spent: string;
  width: string;
}) {
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
        <button className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Edit
        </button>
      </div>

      <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
        <div className={`h-2 rounded-full bg-green-500 ${width}`} />
      </div>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {spent}
      </p>
    </div>
  );
}

function LogoBox({ label, src }: { label: string; src?: StaticImageData }) {
  return (
    <div className="flex h-24 flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
      {src ? (
        <Image
          src={src}
          alt={`${label} logo`}
          className="mb-2 block inline-flex h-8 w-auto object-contain"
        />
      ) : (
        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {label.charAt(0)}
        </div>
      )}

      <span>{label}</span>
    </div>
  );
}

const transactions = [
  {
    id: 1,
    date: "May 20, 2026",
    merchant: "Pilot #459",
    location: "Carlisle, PA",
    gallons: "72.35",
    amount: "214.50",
    type: "Fuel",
  },
  {
    id: 2,
    date: "May 19, 2026",
    merchant: "Love's #241",
    location: "Columbus, OH",
    gallons: "68.21",
    amount: "198.75",
    type: "Fuel",
  },
  {
    id: 3,
    date: "May 18, 2026",
    merchant: "TA Travel Center",
    location: "St. Louis, MO",
    gallons: "55.12",
    amount: "161.30",
    type: "Fuel",
  },
  {
    id: 4,
    date: "May 17, 2026",
    merchant: "Sapp Bros #78",
    location: "Memphis, TN",
    gallons: "60.00",
    amount: "175.20",
    type: "Fuel",
  },
];

const locations = [
  {
    name: "Pilot Flying J #459",
    city: "Carlisle, PA",
    date: "May 20, 2026 • 9:24 AM",
  },
  {
    name: "Love's #241",
    city: "Columbus, OH",
    date: "May 19, 2026 • 7:15 PM",
  },
  {
    name: "TA Travel Center",
    city: "St. Louis, MO",
    date: "May 18, 2026 • 10:32 AM",
  },
];