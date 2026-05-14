import Sidebar from "@/app/components/layout/SideBar";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();

  if (!session.user?.email) {
    throw new Error("Unauthorized");
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      image: true,
      role: true,
    },
  });

  const sidebarUser = dbUser
    ? {
        name: `${dbUser.firstName ?? ""} ${dbUser.lastName ?? ""}`.trim(),
        email: dbUser.email,
        image: dbUser.image,
        role: dbUser.role,
      }
    : undefined;

 return (
  <div className="min-h-screen">
    <Sidebar user={sidebarUser} />

    <main className="md:pl-64">
      {children}
    </main>
  </div>
);
}