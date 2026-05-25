import { requireUser } from "@/lib/requireUser";

export default async function RequestLoads() {
    const session = await requireUser();

    
}