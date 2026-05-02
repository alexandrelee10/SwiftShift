import StatusPage from "@/app/components/StatusPage";
import { requireUser } from "@/lib/requireUser";
import {
  AlertTriangle,
  Bell,
  ChevronRight,
  CreditCard,
  Droplet,
  Eye,
  Fuel,
  Lock,
  MapPin,
  Shield,
  TrendingUp,
} from "lucide-react";

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
        )
    }
  
    return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Fuel Card</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your fuel card, transactions, limits, and spending.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Available Balance" value="$1,245.75" desc="of $2,500.00 limit" />
          <StatCard title="This Month Spent" value="$1,254.25" desc="32 transactions" />
          <StatCard title="Savings This Month" value="$87.30" desc="vs. avg. price/gal" />
          <StatCard title="Gallons Purchased" value="412.60" desc="This month" />
        </section>

        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold">Fuel Card</h2>

              <div className="mt-4 w-full max-w-md rounded-2xl bg-slate-950 p-7 text-white shadow-lg">
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
                    <p className="mt-1 text-sm font-medium">{session.user.name}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-slate-400">Valid Thru</p>
                    <p className="mt-1 text-sm font-medium">04/27</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InfoLine label="Card Status" value="Active" badge />
                <InfoLine label="Card Number" value="•••• 5678" />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-blue-600 hover:bg-slate-50">
                  <Eye size={16} />
                  View PIN
                </button>

                <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50">
                  <AlertTriangle size={16} />
                  Report Lost/Stolen
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Spending Overview</h2>
                <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600">
                  This Month
                </button>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
                <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-[conic-gradient(#2563eb_0_82%,#22c55e_82%_90%,#f97316_90%_96%,#a855f7_96%_100%)]">
                  <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                    <p className="text-xs text-slate-500">Total Spent</p>
                    <p className="text-xl font-semibold">$1,254.25</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Breakdown color="bg-blue-600" label="Fuel" value="$1,087.18" percent="86.7%" />
                  <Breakdown color="bg-green-500" label="DEF" value="$98.42" percent="7.8%" />
                  <Breakdown color="bg-orange-500" label="Tires" value="$35.75" percent="2.8%" />
                  <Breakdown color="bg-purple-500" label="Other" value="$32.90" percent="2.7%" />
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <h2 className="text-sm font-semibold">Recent Transactions</h2>
                <button className="text-sm font-medium text-blue-600">View all</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
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
                      <tr key={tx.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-5 py-4 text-slate-600">{tx.date}</td>
                        <td className="px-5 py-4 font-medium">{tx.merchant}</td>
                        <td className="px-5 py-4 text-slate-600">{tx.location}</td>
                        <td className="px-5 py-4">{tx.gallons}</td>
                        <td className="px-5 py-4 font-medium">${tx.amount}</td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
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
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold">Card Controls</h2>

              <div className="mt-5 space-y-4">
                <ToggleRow label="Card is Active" active />
                <ToggleRow label="International Usage" />
                <ToggleRow label="ATM Withdrawals" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold">Spending Limit</h2>

              <Limit label="Monthly Limit" value="$2,500.00" spent="$1,254.25 spent (50%)" width="w-1/2" />
              <Limit label="Daily Limit" value="$750.00" spent="$214.50 spent (29%)" width="w-[29%]" />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold">Accepted At</h2>

              <div className="mt-5 grid grid-cols-2 gap-3 text-center text-sm font-semibold">
                <LogoBox label="Pilot" />
                <LogoBox label="Love's" />
                <LogoBox label="TA" />
                <LogoBox label="Sapp" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold">Recent Locations</h2>

              <div className="mt-4 space-y-4">
                {locations.map((location) => (
                  <div key={location.name} className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{location.name}</p>
                        <p className="text-sm text-slate-500">{location.city}</p>
                        <p className="text-xs text-slate-400">{location.date}</p>
                      </div>
                    </div>

                    <ChevronRight size={16} className="text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600">
                <Shield size={18} />
              </div>
              <div>
                <h2 className="font-semibold">Fuel Card Security</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Keep your PIN secure and report suspicious activity immediately.
                </p>
              </div>
            </div>

            <button className="w-fit rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-600">
              Report an Issue
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, desc }: { title: string; value: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
    </div>
  );
}

function InfoLine({ label, value, badge }: { label: string; value: string; badge?: boolean }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      {badge ? (
        <span className="mt-2 inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
          {value}
        </span>
      ) : (
        <p className="mt-2 text-sm font-medium">{value}</p>
      )}
    </div>
  );
}

function Breakdown({ color, label, value, percent }: { color: string; label: string; value: string; percent: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-sm">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <p className="font-medium">{label}</p>
      </div>
      <p>{value}</p>
      <p className="text-slate-500">{percent}</p>
    </div>
  );
}

function ToggleRow({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0">
      <p className="text-sm text-slate-600">{label}</p>
      <div className={`flex h-6 w-11 items-center rounded-full p-1 ${active ? "bg-green-500" : "bg-slate-300"}`}>
        <span className={`h-4 w-4 rounded-full bg-white transition ${active ? "translate-x-5" : ""}`} />
      </div>
    </div>
  );
}

function Limit({ label, value, spent, width }: { label: string; value: string; spent: string; width: string }) {
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-lg font-semibold">{value}</p>
        </div>
        <button className="text-sm font-medium text-blue-600">Edit</button>
      </div>

      <div className="mt-3 h-2 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full bg-green-500 ${width}`} />
      </div>

      <p className="mt-2 text-sm text-slate-500">{spent}</p>
    </div>
  );
}

function LogoBox({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
      {label}
    </div>
  );
}

const transactions = [
  { id: 1, date: "May 20, 2026", merchant: "Pilot #459", location: "Carlisle, PA", gallons: "72.35", amount: "214.50", type: "Fuel" },
  { id: 2, date: "May 19, 2026", merchant: "Love's #241", location: "Columbus, OH", gallons: "68.21", amount: "198.75", type: "Fuel" },
  { id: 3, date: "May 18, 2026", merchant: "TA Travel Center", location: "St. Louis, MO", gallons: "55.12", amount: "161.30", type: "Fuel" },
  { id: 4, date: "May 17, 2026", merchant: "Sapp Bros #78", location: "Memphis, TN", gallons: "60.00", amount: "175.20", type: "Fuel" },
];

const locations = [
  { name: "Pilot Flying J #459", city: "Carlisle, PA", date: "May 20, 2026 • 9:24 AM" },
  { name: "Love's #241", city: "Columbus, OH", date: "May 19, 2026 • 7:15 PM" },
  { name: "TA Travel Center", city: "St. Louis, MO", date: "May 18, 2026 • 10:32 AM" },
];