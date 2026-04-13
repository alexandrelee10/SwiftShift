import { requireUser } from "@/lib/requireUser";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await requireUser();

  const sidebarSections = [
    {
      title: "Main",
      links: [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Search Loads", href: "/loads/search" },
        { name: "Search Trucks", href: "/trucks/search" },
      ],
    },
    {
      title: "Operations",
      links: [
        { name: "My Loads", href: "/loads/my-loads" },
        { name: "My Trucks", href: "/trucks/my-trucks" },
        { name: "Dispatch", href: "/dispatch" },
        { name: "Tracking", href: "/tracking" },
      ],
    },
    {
      title: "Business",
      links: [
        { name: "Messages", href: "/messages" },
        { name: "Payments", href: "/payments" },
        { name: "Settings", href: "/settings" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-zinc-950 text-white border-r border-zinc-800">
          <div className="p-6 border-b border-zinc-800">
            <h1 className="text-2xl font-bold tracking-tight">
              SwiftShift
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Carrier Dashboard
            </p>
          </div>

          <nav className="py-4">
            {sidebarSections.map((section) => (
              <div key={section.title} className="mb-6">
                <p className="px-4 mb-2 text-xs font-semibold uppercase text-zinc-500">
                  {section.title}
                </p>

                <div className="space-y-1 px-3">
                  {section.links.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main area */}
        <main className="flex-1">
          <div className="border-b border-zinc-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-zinc-900">
                Dashboard
              </h2>
              <div className="text-sm text-zinc-500">
                Welcome, {session.user?.name}
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Quick action buttons */}
            <div className="mb-6 flex flex-wrap gap-3">
              <button className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50">
                Search Loads
              </button>
              <button className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50">
                Search Trucks
              </button>
            </div>

            {/* Main content + right rail */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
              {/* Left content */}
              <section className="space-y-6">
                {/* Top cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-2xl bg-white border border-zinc-200 p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-zinc-900">
                      SwiftShift Mobile
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 leading-6">
                      Access your loads, manage routes, and stay updated from anywhere.
                    </p>
                    <button className="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-700">
                      Get the App →
                    </button>
                  </div>

                  <div className="rounded-2xl bg-white border border-zinc-200 p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-zinc-900">
                      Help Center
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 leading-6">
                      Contact support, troubleshoot platform issues, and browse training resources.
                    </p>
                    <button className="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-700">
                      Help Center →
                    </button>
                  </div>
                </div>

                {/* What's New */}
                <div className="rounded-2xl bg-white border border-zinc-200 p-8 shadow-sm min-h-[420px]">
                  <h3 className="text-2xl font-semibold text-zinc-900">
                    What’s New
                  </h3>

                  <div className="mt-8 space-y-8">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">
                        New April 13th, 2026
                      </p>
                      <ul className="mt-3 space-y-3 text-zinc-700">
                        <li>• Carriers can now post trucks faster from mobile.</li>
                        <li>• Search filters now respond faster on smaller screens.</li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-lg font-semibold text-zinc-900">
                        Recent Platform Improvements
                      </p>
                      <ul className="mt-3 space-y-3 text-zinc-700">
                        <li>• Improved sorting inside load search results.</li>
                        <li>• Better visibility for load rate and company info.</li>
                        <li>• Cleaner dashboard spacing and improved readability.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Right rail */}
              <aside>
                <div className="rounded-2xl bg-white border border-zinc-200 p-5 shadow-sm sticky top-6">

                  {/* Title */}
                  <h3 className="text-xl font-bold text-zinc-900 mb-4">
                    Market Snapshot
                  </h3>

                  {/* Header row */}
                  <div className="grid grid-cols-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide border-b border-zinc-200 pb-2 mb-3">
                    <span>ST</span>
                    <span className="text-center">Loads In</span>
                    <span className="text-right">Loads Out</span>
                  </div>

                  {/* States */}
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {[
                      { state: "AK", inbound: 5, outbound: 7 },
                      { state: "AL", inbound: 1044, outbound: 528 },
                      { state: "AR", inbound: 724, outbound: 801 },
                      { state: "AZ", inbound: 291, outbound: 566 },
                      { state: "CA", inbound: 2052, outbound: 1841 },
                      { state: "CO", inbound: 845, outbound: 516 },
                      { state: "CT", inbound: 324, outbound: 197 },
                      { state: "DC", inbound: 25, outbound: 6 },
                      { state: "DE", inbound: 64, outbound: 90 },
                      { state: "FL", inbound: 3188, outbound: 571 },
                      { state: "GA", inbound: 2907, outbound: 809 },
                      { state: "IA", inbound: 681, outbound: 431 },
                      { state: "ID", inbound: 142, outbound: 198 },
                      { state: "IL", inbound: 2039, outbound: 3921 },
                      { state: "IN", inbound: 1476, outbound: 2543 },
                      { state: "KS", inbound: 879, outbound: 935 },
                      { state: "KY", inbound: 965, outbound: 1204 },
                      { state: "LA", inbound: 756, outbound: 688 },
                      { state: "MA", inbound: 512, outbound: 430 },
                      { state: "MD", inbound: 678, outbound: 590 },
                      { state: "ME", inbound: 89, outbound: 120 },
                      { state: "MI", inbound: 1345, outbound: 1780 },
                      { state: "MN", inbound: 890, outbound: 1102 },
                      { state: "MO", inbound: 1203, outbound: 1455 },
                      { state: "MS", inbound: 410, outbound: 390 },
                      { state: "MT", inbound: 76, outbound: 102 },
                      { state: "NC", inbound: 1750, outbound: 980 },
                      { state: "ND", inbound: 95, outbound: 140 },
                      { state: "NE", inbound: 430, outbound: 520 },
                      { state: "NH", inbound: 110, outbound: 95 },
                      { state: "NJ", inbound: 980, outbound: 870 },
                      { state: "NM", inbound: 210, outbound: 260 },
                      { state: "NV", inbound: 350, outbound: 480 },
                      { state: "NY", inbound: 1650, outbound: 1400 },
                      { state: "OH", inbound: 1890, outbound: 2100 },
                      { state: "OK", inbound: 620, outbound: 710 },
                      { state: "OR", inbound: 540, outbound: 620 },
                      { state: "PA", inbound: 1720, outbound: 1600 },
                      { state: "RI", inbound: 70, outbound: 65 },
                      { state: "SC", inbound: 880, outbound: 760 },
                      { state: "SD", inbound: 120, outbound: 150 },
                      { state: "TN", inbound: 1350, outbound: 1250 },
                      { state: "TX", inbound: 2450, outbound: 2210 },
                      { state: "UT", inbound: 390, outbound: 470 },
                      { state: "VA", inbound: 980, outbound: 910 },
                      { state: "VT", inbound: 60, outbound: 55 },
                      { state: "WA", inbound: 780, outbound: 860 },
                      { state: "WI", inbound: 920, outbound: 1040 },
                      { state: "WV", inbound: 210, outbound: 180 },
                      { state: "WY", inbound: 65, outbound: 80 },
                    ].map((item) => (
                      <div
                        key={item.state}
                        className="grid grid-cols-3 items-center rounded-lg px-2 py-2 hover:bg-zinc-50 transition"
                      >
                        {/* State */}
                        <span className="text-sm font-medium text-zinc-900">
                          {item.state}
                        </span>

                        {/* Loads In */}
                        <span className="text-sm text-center text-zinc-700">
                          {item.inbound}
                        </span>

                        {/* Loads Out */}
                        <span className="text-sm text-right text-zinc-700">
                          {item.outbound}
                        </span>

                        {/* Progress bar (full width row below) */}
                        <div className="col-span-3 mt-2 h-2 rounded-full bg-zinc-200 overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{
                              width: `${(item.inbound / (item.inbound + item.outbound)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}