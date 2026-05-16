import Image from "next/image"

import HeroImage from "@/app/components/landingPage/authority/truck-drivers-shaking-hands.png"
import Link from "next/link"
export default function AuthorityProgramPage() {

    return (
        <div>
            <main className="min-h-screen">
                {/* Header */}
                <section className="flex px-6 py-8 bg-slate-800 gap-10">
                    <div className="flex-1">
                        <Image
                            src={HeroImage}
                            alt="Truck drivers shaking hands"
                            className="rounded-2xl"
                        />
                    </div>
                    <div className="flex-1 ">
                        <div>
                            <h2 className="font-extrabold text-7xl text-white">SwiftShift</h2>
                            <h2 className="font-extrabold text-7xl text-white"> Authority Program</h2>
                        </div>
                        <div>
                            <p className="pt-10 font-semibold text-white text-lg">
                                Starting your own trucking business is a major step — and getting your authority shouldn’t slow you down.
                                SwiftShift helps simplify the process with guidance, support, and tools built for carriers from day one.
                                From getting your operating authority to managing loads after you’re active, SwiftShift stays with you through
                                every stage of the journey.
                            </p>
                        </div>
                        <div className="mt-8 flex items-center gap-6">
                            <Link
                                href="#"
                                className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                            >
                                Authority For Carriers
                            </Link>

                            <Link
                                href="#"
                                className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                            >
                                Authority For Brokers
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="flex">
                    <div>
                        <h2>Coming Soon!!</h2>
                        <h2>The copilot you didn't know you needed</h2>
                    </div>
                </section>
            </main>
        </div>
    )
}