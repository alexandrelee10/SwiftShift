import { requireUser } from "@/lib/requireUser";

export default async function DocumentPage() {

    const session = await requireUser();

    if (!session.user?.email) {
        throw new Error("Unauthorized");
    }


    return (
        <div className="min-h-screen bg-slate-50 px-6 py-7 text-slate-800">
            <main className="mx-auto max-w-7xl space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Documents</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Search and book the best loads for your route.
                    </p>
                </div>

                
            </main>
        </div>
    )
}