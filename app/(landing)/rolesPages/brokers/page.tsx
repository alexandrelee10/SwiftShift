import BackButton from "@/app/components/shared/BackButton";
import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  ClipboardCheck,
  Handshake,
  Route,
  ShieldCheck,
  TrendingUp,
  Users,
  Building2,
} from "lucide-react";

export default function WhatIsABrokerPage() {
  const benefits = [
    {
      title: "Post Loads Faster",
      description:
        "Create and manage loads from one platform instead of juggling spreadsheets, emails, and phone calls.",
      icon: ClipboardCheck,
    },
    {
      title: "Build Carrier Networks",
      description:
        "Connect with qualified carriers and maintain strong transportation partnerships.",
      icon: Handshake,
    },
    {
      title: "Increase Margins",
      description:
        "Move more freight efficiently while improving operational visibility and profitability.",
      icon: BadgeDollarSign,
    },
    {
      title: "Stay Organized",
      description:
        "Track load status, documents, communications, and deliveries from one dashboard.",
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.15),transparent_30%)]" />

        <div className="relative mx-auto max-w-6xl px-6 py-8">
          <div className="mb-8">
            <BackButton />
          </div>

          <div className="grid gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                <Handshake size={28} />
              </div>

              <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-300">
                Broker Guide
              </p>

              <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
                What does it mean to be a broker?
              </h1>

              <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
                Brokers connect shippers with carriers. They don't drive the
                truck — they coordinate freight movement, negotiate rates,
                build carrier relationships, and keep shipments moving.
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
                  href="/products/authority-program/authority-for-brokers"
                  className="rounded-2xl border border-white/15 px-6 py-3 text-center font-black text-white transition hover:bg-white/10"
                >
                  Learn About Broker Authority
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 backdrop-blur">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-200">
                Dumb Simple Version
              </p>

              <h3 className="mt-4 text-3xl font-black">
                A broker gets paid to arrange freight.
              </h3>

              <p className="mt-4 leading-7 text-slate-300">
                Brokers find freight, connect it with carriers, coordinate the
                shipment, and earn money on the difference between what the
                shipper pays and what the carrier is paid.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Find freight",
                  "Find carriers",
                  "Coordinate shipment",
                  "Earn a margin",
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
            Where brokers fit into freight
          </h2>

          <div className="mt-8 rounded-3xl bg-blue-50 p-8 text-center">
            <p className="text-2xl font-black text-slate-950">
              Shipper → Broker → Carrier → Receiver
            </p>

            <p className="mt-4 max-w-3xl mx-auto leading-7 text-slate-600">
              The broker sits in the middle of the transaction. Shippers need
              freight moved. Carriers have trucks available. Brokers connect
              the two and help ensure the shipment is completed successfully.
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
            What brokers do every day
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Find Shippers",
              icon: Building2,
            },
            {
              title: "Find Carriers",
              icon: Users,
            },
            {
              title: "Coordinate Loads",
              icon: Route,
            },
            {
              title: "Manage Documents",
              icon: ClipboardCheck,
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
            Benefits for brokers
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-slate-500">
            SwiftShift helps brokers manage freight efficiently while staying
            organized and maintaining visibility throughout the shipment
            lifecycle.
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
            Scale your brokerage operation
          </h2>

          <p className="mt-4 max-w-3xl text-blue-100 leading-8">
            Successful brokerages grow by building strong carrier networks,
            maintaining shipper relationships, and leveraging technology to
            move more freight efficiently.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[2rem] bg-slate-950 p-10 text-white">
          <Users size={40} className="text-blue-400" />

          <h2 className="mt-6 text-4xl font-black">
            Ready to build your brokerage?
          </h2>

          <p className="mt-4 max-w-2xl text-slate-300">
            Whether you're a new broker or growing an existing operation,
            SwiftShift gives you the tools to manage freight, organize
            operations, and grow your business.
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
              href="/products/authority-program/authority-for-brokers"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-3 font-black text-white transition hover:bg-white/10"
            >
              Broker Authority Guide
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}