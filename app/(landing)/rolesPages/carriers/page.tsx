import BackButton from "@/app/components/shared/BackButton";
import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  ClipboardCheck,
  Route,
  ShieldCheck,
  Truck,
  Users,
  TrendingUp,
  FileText,
} from "lucide-react";

export default function WhatIsACarrierPage() {
  const benefits = [
    {
      title: "Find Freight Faster",
      description:
        "Access available loads without spending hours calling brokers or searching multiple load boards.",
      icon: Route,
    },
    {
      title: "Manage Operations",
      description:
        "Track loads, documents, dispatch activity, and delivery status from one platform.",
      icon: ClipboardCheck,
    },
    {
      title: "Increase Revenue",
      description:
        "Reduce deadhead miles and keep trucks moving with consistent opportunities.",
      icon: BadgeDollarSign,
    },
    {
      title: "Stay Compliant",
      description:
        "Keep important documents organized and accessible whenever you need them.",
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.15),transparent_30%)]" />

        <div className="relative mx-auto max-w-6xl px-6 py-8">
          <div className="mb-8">
            <BackButton />
          </div>

          <div className="grid gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                <Truck size={28} />
              </div>

              <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-300">
                Carrier Guide
              </p>

              <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
                What does it mean to be a carrier?
              </h1>

              <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
                Carriers are the backbone of the freight industry. They own,
                operate, or manage the trucks responsible for transporting
                freight from pickup to delivery.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-black text-white transition hover:bg-blue-700"
                >
                  Join SwiftShift
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/products/authority-program/authority-for-carriers"
                  className="rounded-2xl border border-white/15 px-6 py-3 text-center font-black text-white transition hover:bg-white/10"
                >
                  Learn About Authority
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 backdrop-blur">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-200">
                Dumb Simple Version
              </p>

              <h3 className="mt-4 text-3xl font-black">
                A carrier gets paid to move freight.
              </h3>

              <p className="mt-4 leading-7 text-slate-300">
                If you own a truck, operate a fleet, or run under your own
                authority and physically transport freight, you are a carrier.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Pick up freight",
                  "Transport freight",
                  "Deliver freight",
                  "Get paid",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-green-400"
                    />
                    <span className="font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
            How It Works
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950">
            Where carriers fit into freight
          </h2>

          <div className="mt-8 rounded-3xl bg-blue-50 p-8 text-center">
            <p className="text-2xl font-black text-slate-950">
              Shipper → Broker → Carrier → Receiver
            </p>

            <p className="mt-4 max-w-3xl mx-auto leading-7 text-slate-600">
              Shippers need products moved. Brokers help connect loads with
              trucking companies. Carriers are the companies that physically
              transport the freight and complete the delivery.
            </p>
          </div>
        </div>
      </section>

      {/* RESPONSIBILITIES */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
            Responsibilities
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            What carriers do every day
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Find Loads",
              icon: Route,
            },
            {
              title: "Dispatch Trucks",
              icon: Truck,
            },
            {
              title: "Maintain Compliance",
              icon: ShieldCheck,
            },
            {
              title: "Deliver Freight",
              icon: CheckCircle2,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Icon size={28} className="text-blue-600" />

                <h3 className="mt-4 text-xl font-black text-slate-950">
                  {item.title}
                </h3>
              </div>
            );
          })}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
            Why SwiftShift
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            Benefits for carriers
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-slate-500">
            SwiftShift helps carriers simplify operations, find freight, and
            spend less time dealing with paperwork and scattered systems.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon size={24} />
                </div>

                <h3 className="mt-5 text-2xl font-black text-slate-950">
                  {benefit.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHY GROW */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-[2rem] bg-gradient-to-r from-blue-600 to-blue-700 p-10 text-white">
          <TrendingUp size={40} />

          <h2 className="mt-6 text-4xl font-black">
            Grow beyond just driving
          </h2>

          <p className="mt-4 max-w-3xl text-blue-100 leading-8">
            Many successful carriers start with a single truck and eventually
            build fleets, hire drivers, and expand their operations. SwiftShift
            provides the tools to support growth at every stage.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[2rem] bg-slate-950 p-10 text-white">
          <Users size={40} className="text-blue-400" />

          <h2 className="mt-6 text-4xl font-black">
            Ready to build your carrier business?
          </h2>

          <p className="mt-4 max-w-2xl text-slate-300">
            Whether you're an owner-operator or running a growing fleet,
            SwiftShift gives you the tools to manage freight, stay organized,
            and scale efficiently.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-black text-white transition hover:bg-blue-700"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/products/authority-program/authority-for-carriers"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-3 font-black text-white transition hover:bg-white/10"
            >
              Carrier Authority Guide
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}