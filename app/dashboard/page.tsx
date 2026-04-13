import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/sign-in")
    }
    return (
        <div>
            <div>
                <div>
                    <h1>Welcome, {session.user?.name}</h1>
                    <p>{session.user?.email}</p>
                </div>
            </div>
        </div>
    )
}