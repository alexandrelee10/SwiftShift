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
                  <h3 className="text-xl font-bold text-zinc-900 mb-4">
                    Market Snapshot
                  </h3>

                  <div className="space-y-4">
                    {[
                      { state: "FL", inbound: 3188, outbound: 571 },
                      { state: "GA", inbound: 2907, outbound: 809 },
                      { state: "CA", inbound: 2052, outbound: 1841 },
                      { state: "IL", inbound: 2039, outbound: 3921 },
                      { state: "TX", inbound: 2450, outbound: 2210 },
                    ].map((item) => (
                      <div key={item.state}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.state}</span>
                          <span>{item.inbound} / {item.outbound}</span>
                        </div>
                        <div className="h-2 bg-zinc-200 rounded-full">
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