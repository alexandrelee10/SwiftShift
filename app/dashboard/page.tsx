import { requireUser } from "@/lib/requireUser";
import MarketSnapshot from "@/app/components/MarketSnapshot";

export default async function DashboardPage() {
  const session = await requireUser();

  return (
    <div className="min-h-screen bg-zinc-100">
      <main className="min-w-0">
        {/* Top header */}
        <div className="border-b border-zinc-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-zinc-900">Dashboard</h2>
            <div className="text-sm text-zinc-500">
              Welcome, {session.user?.name}
            </div>
          </div>
        </div>

        {/* Page content */}
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

          {/* Main dashboard layout */}
          <div className="flex flex-col gap-6 xl:flex-row">
            {/* Left content */}
            <section className="min-w-0 flex-1 space-y-6">
              {/* Top cards */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-zinc-900">
                    SwiftShift Mobile
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Access your loads, manage routes, and stay updated from
                    anywhere.
                  </p>
                  <button className="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Get the App →
                  </button>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-zinc-900">
                    Help Center
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Contact support, troubleshoot platform issues, and browse
                    training resources.
                  </p>
                  <button className="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Help Center →
                  </button>
                </div>
              </div>

              {/* What's New */}
              <div className="min-h-[420px] rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
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
            <div className="w-full xl:w-[320px] xl:shrink-0">
              <MarketSnapshot />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}