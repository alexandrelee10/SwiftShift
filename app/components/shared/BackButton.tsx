"use client"

import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();

    return (
        <div>
            <button onClick={() => router.back()}>
                Back
            </button>
        </div>
    )
}