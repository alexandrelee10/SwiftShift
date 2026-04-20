import Sidebar from "@/app/components/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<div className="flex min-h-screen">
  <Sidebar />

  <main className="flex-1 bg-zinc-100">
    {children}
  </main>
</div>
  );
}