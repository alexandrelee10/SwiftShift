import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardNav from "../components/Navigation/DashboardNav";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-zinc-100">
      <DashboardNav />

      <main className="max-w-7xl mx-auto px-6 py-8 md:px-10 lg:px-12">
        {/* Welcome Section */}
        <section className="rounded-3xl border border-zinc-200 bg-white/80 backdrop-blur-sm shadow-sm p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
                Dashboard
              </p>
              <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">
                Welcome back, {session.user?.name || "Driver"}
              </h1>
              <p className="mt-3 text-zinc-600">
                Signed in as <span className="font-medium text-zinc-800">{session.user?.email}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                <p className="text-sm text-zinc-500">Available Loads</p>
                <p className="mt-2 text-2xl font-bold text-zinc-900">24</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                <p className="text-sm text-zinc-500">My Bookings</p>
                <p className="mt-2 text-2xl font-bold text-zinc-900">3</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 col-span-2 sm:col-span-1">
                <p className="text-sm text-zinc-500">Active Trips</p>
                <p className="mt-2 text-2xl font-bold text-zinc-900">1</p>
              </div>
            </div>
          </div>
        </section>


      </main>
    </div>
  );
}