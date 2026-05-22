import { requireUser } from "@/lib/requireUser"

export default async function BrokerDashboardPage() {
    const session = await requireUser();

    return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="min-w-0 p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-slate-100">
              Welcome, {session.user?.name || "Driver"}!
            </h2>
            <p className="text-sm text-zinc-500 dark:text-slate-400">
              Here&apos;s what&apos;s happening with your loads today.
            </p>
          </div>

                </div>
            </main>
        </div>
    )
}