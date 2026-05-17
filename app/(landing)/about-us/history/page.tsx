import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Layers3,
  Route,
  Sparkles,
  Truck,
} from "lucide-react";

export default function SwiftShiftHistoryPage() {
  const timeline = [
    {
      label: "The idea",
      title: "Built from real trucking experience",
      description:
        "SwiftShift started from a simple problem: trucking tools felt scattered, outdated, and harder than they needed to be.",
      icon: Truck,
    },
    {
      label: "The mission",
      title: "Make freight workflows cleaner",
      description:
        "The goal became building one place where carriers, brokers, and dispatchers could manage loads, documents, tracking, and payments with less friction.",
      icon: Compass,
    },
    {
      label: "The platform",
      title: "A dashboard made for daily operations",
      description:
        "SwiftShift evolved into a modern load board and operations platform focused on speed, clarity, and real-world trucking workflows.",
      icon: Layers3,
    },
    {
      label: "The future",
      title: "More tools for growing carriers",
      description:
        "SwiftShift is expanding toward authority support, QuickPay, smarter tracking, and tools that help small fleets operate like larger companies.",
      icon: Sparkles,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-slate-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="font-black uppercase tracking-[0.3em] text-blue-400">
            Our Story
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Built to make trucking operations feel less scattered
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
            SwiftShift was created around a simple belief: carriers, brokers,
            and dispatchers deserve tools that feel modern, organized, and easy
            to use.
          </p>

          <Link
            href="/sign-up"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-blue-700 px-7 py-3.5 text-sm font-black text-white transition hover:bg-blue-800"
          >
            Get started <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-black uppercase tracking-[0.3em] text-blue-600">
              Timeline
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              The road that shaped SwiftShift
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-500">
              From a simple idea to a growing freight platform, SwiftShift is
              being built around the real problems trucking businesses face
              every day.
            </p>
          </div>

          <div className="relative mx-auto mt-20 max-w-5xl">
            <div className="absolute left-6 top-0 hidden h-full w-px bg-slate-200 md:block" />

            <div className="space-y-8">
              {timeline.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="relative md:pl-20">
                    <div className="absolute left-0 top-6 hidden h-12 w-12 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-700 shadow-sm md:flex">
                      <Icon size={22} />
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
                            {item.label}
                          </p>

                          <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                            {item.title}
                          </h3>
                        </div>

                        <CheckCircle2
                          size={28}
                          className="shrink-0 text-green-600"
                        />
                      </div>

                      <p className="mt-5 max-w-3xl leading-8 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-800 px-6 py-20 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-black uppercase tracking-[0.3em] text-blue-400">
              What’s next
            </p>

            <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
              The platform is still moving forward
            </h2>
          </div>

          <div className="max-w-xl">
            <p className="text-lg leading-8 text-slate-300">
              SwiftShift is growing into a full freight operations hub —
              combining load search, trip tracking, document management,
              QuickPay, and authority support into one clean workflow.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}