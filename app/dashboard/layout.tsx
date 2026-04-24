import Sidebar from "@/app/components/SideBar";
import { requireUser } from "@/lib/requireUser";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();

  return (
    <div className="min-h-screen bg-zinc-100 md:flex">
      <Sidebar user={session.user} />

      <main className="min-h-screen flex-1 bg-zinc-100">
        {children}
      </main>
    </div>
  );
}