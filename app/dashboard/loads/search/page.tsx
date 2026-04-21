import { requireUser } from "@/lib/requireUser";
import SearchFilter from "@/app/components/SearchFilters";

export default async function SearchPage() {
  const session = await requireUser();

  return (
    <div className="min-h-screen bg-zinc-100">
      <main className="flex-1">
        <div className="border-b border-zinc-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-zinc-900">
              Search Loads
            </h2>
            <p className="text-sm text-zinc-500">
              Welcome, {session.user?.name}
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <SearchFilter />
          </div>
        </div>
      </main>
    </div>
  );
}