import Sidebar from "@/app/components/SideBar";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();
  if(!session.user?.email) {throw new Error("Unauthorized")}

  const dbUser = await prisma.user.findUnique({
    where: {
      email: session.user?.email,
    }
  })

  return (
    <div className="min-h-screen bg-zinc-100 md:flex">
      <Sidebar user={{
        name: `${dbUser?.firstName} ${dbUser?.lastName}`,
        email: `${dbUser?.email}`
      }} />

      <main className="min-h-screen flex-1 bg-zinc-100">
        {children}
      </main>
    </div>
  );
}