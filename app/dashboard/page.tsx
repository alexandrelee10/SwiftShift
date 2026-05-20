import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await requireUser();

  console.log("SESSION USER:", session.user);
  console.log("SESSION ROLE:", session.user.role);

  if (session.user.role === "DRIVER") {
    redirect("/dashboard/driver");
  }

  if (session.user.role === "BROKER") {
    redirect("/dashboard/broker");
  }

  redirect("/");
}