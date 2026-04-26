import { requireUser } from "@/lib/requireUser"

export default async function MyLoadsPage() {

    const session = requireUser();



    return (
        <div className="min-h-screen">
            <div>

            </div>
        </div>
    )
}