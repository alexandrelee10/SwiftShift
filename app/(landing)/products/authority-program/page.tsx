import Image from "next/image"

import HeroImage from "@/public/assets/landingPage/authority/truck-drivers-shaking-hands.png"
import CopilotImage from "@/public/assets/landingPage/authority/CoPilotLogo.png"
import Link from "next/link"
export default function AuthorityProgramPage() {

    const copilotSection = [
        {
            title: "Access high-quality freight across one of North America’s largest load boards",
            description:
                "Search profitable loads, reduce deadhead miles, and save 50% on DAT One during your first 6 months.",
        },
        {
            title: "Keep cash flow moving with fast and flexible factoring",
            description:
                "Get paid in as little as 15 minutes with competitive rates starting as low as 1%, helping you stay focused on the road instead of waiting on invoices.",
        },
    ];
    return (
        <div>
            <main className="min-h-screen ">
                {/* Hero */}
                <section className="px-6 py-16 bg-slate-800">
                    <div className="mx-auto flex max-w-7xl flex-col items-center gap-14 lg:flex-row">
                        {/* Left image */}
                        <div className="flex-1">
                            <Image
                                src={HeroImage}
                                alt="Truck drivers shaking hands"
                                className="rounded-[2rem] object-cover shadow-2xl"
                                priority
                            />
                        </div>

                        {/* Right content */}
                        <div className="flex-1">
                            <div>
                                <h1 className="text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
                                    SwiftShift
                                </h1>

                                <h1 className="text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
                                    Authority Program
                                </h1>
                            </div>

                            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">
                                Starting your own trucking business is a major step — and
                                getting your authority shouldn’t slow you down. SwiftShift
                                helps simplify the process with guidance, support, and tools
                                built for carriers from day one.

                                <br />
                                <br />

                                From getting your operating authority to managing loads after
                                you’re active, SwiftShift stays with you through every stage
                                of the journey.
                            </p>

                            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                                <Link
                                    href="#"
                                    className="rounded-full bg-blue-600 px-7 py-3 text-center font-bold text-white transition hover:bg-blue-700"
                                >
                                    Authority For Carriers
                                </Link>

                                <Link
                                    href="#"
                                    className="rounded-full border border-white/20 px-7 py-3 text-center font-bold text-white transition hover:bg-white/10"
                                >
                                    Authority For Brokers
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

{/* Secondary section */}
<section className="border-t border-slate-200 bg-white px-6 py-24">
  <div className="mx-auto max-w-7xl">
    {/* Header */}
    <div className="mx-auto max-w-3xl text-center">
      <p className="font-bold uppercase tracking-[0.3em] text-blue-600">
        Coming Soon
      </p>

      <h2 className="mt-4 text-4xl font-black tracking-tight text-zinc-900 md:text-6xl">
        The copilot you didn’t know you needed
      </h2>

      <p className="mt-6 text-lg leading-8 text-slate-500">
        SwiftShift Authority Program is being built to help carriers
        launch faster, stay compliant, and manage their operation from
        one clean platform.
      </p>
    </div>

    {/* Content */}
    <div className="mt-20 grid items-center gap-14 lg:grid-cols-2">
      {/* Image */}
      <div>
        <Image
          src={CopilotImage}
          alt="SwiftShift Copilot"
          className="rounded-[2rem] border border-slate-200 shadow-2xl"
          priority
        />
      </div>

      {/* Features */}
      <div className="space-y-6">
        {[
          {
            title:
              "Access high-quality freight across one powerful load board",
            description:
              "Search loads nationwide, compare rates faster, and keep your trucks moving with confidence.",
          },
          {
            title: "Keep cash flow moving without the wait",
            description:
              "Get faster payouts, improve cash flow, and keep your operation running smoothly.",
          },
          {
            title: "Stay organized from dispatch to delivery",
            description:
              "Manage paperwork, compliance, and active trips from one clean dashboard.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
          >
            <div className="flex items-start gap-4">
              {/* Checkmark */}
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Text */}
              <div>
                <h3 className="text-xl font-black text-zinc-800">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
            </main>
        </div>
    )
}