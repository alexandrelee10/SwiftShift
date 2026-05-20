import Sidebar from "@/app/components/driver/layout/SideBar";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";

export default async function DriverDashboardLayout({
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

  if (!dbUser) {
    throw new Error("User not found");
  }

  console.log("DB USER ROLE IN DRIVER LAYOUT:", dbUser.role);

  if (dbUser.role !== "DRIVER") {
    redirect("/dashboard");
  }

  const sidebarUser = {
    name: `${dbUser.firstName ?? ""} ${dbUser.lastName ?? ""}`.trim(),
    email: dbUser.email,
    image: dbUser.image,
    role: dbUser.role,
  };

  return (
    <div className="min-h-screen">
      <Sidebar user={sidebarUser} />

      <main className="md:pl-64">{children}</main>
    </div>
  );
}