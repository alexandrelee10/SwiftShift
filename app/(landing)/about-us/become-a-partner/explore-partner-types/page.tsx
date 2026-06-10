import BackButton from "@/app/components/shared/BackButton";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Handshake,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function ExplorePartnerTypePage() {
  const partnerTypes = [
    {
      title: "Carrier",
      description:
        "You own or operate trucks and want to haul freight under your own authority.",
      icon: Truck,
      href: "/products/authority-program/authority-for-carriers",
      bestFor: ["Owner-operators", "Small fleets", "Drivers starting a company"],
      cta: "Explore Carrier Setup",
    },
    {
      title: "Broker",
      description:
        "You want to connect shippers with carriers and manage freight without owning trucks.",
      icon: Users,
      href: "/products/authority-program/authority-for-brokers",
      bestFor: ["Freight brokers", "Dispatch-minded operators", "Sales-focused teams"],
      cta: "Explore Broker Setup",
    },
  ];

  const quickCompare = [
    {
      label: "Main job",
      carrier: "Physically moves the freight",
      broker: "Arranges freight movement",
    },
    {
      label: "Needs trucks?",
      carrier: "Yes",
      broker: "No",
    },
    {
      label: "Needs insurance?",
      carrier: "Commercial trucking insurance",
      broker: "Surety bond or trust fund",
    },
    {
      label: "Makes money by",
      carrier: "Getting paid to haul loads",
      broker: "Keeping margin between shipper pay and carrier pay",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.18),transparent_30%)]" />

        <div className="relative mx-auto max-w-6xl px-6 py-8">
          <BackButton />

          <div className="grid gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                <Handshake size={28} />
              </div>

              <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-300">
                Explore Partner Type
              </p>

              <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl">
                Choose how you want to operate in freight.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Not everyone enters trucking the same way. Some people want to
                haul loads as carriers. Others want to arrange freight as
                brokers. Pick the path that matches your business model.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-200">
                Simple Difference
              </p>

              <p className="mt-4 text-2xl font-black leading-tight text-white">
                Carriers move the freight. Brokers find the freight and connect
                it to carriers.
              </p>

              <div className="mt-6 space-y-3">
                {["Carrier = trucks", "Broker = customers", "Both need authority"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white"
                    >
                      <CheckCircle2 size={18} className="text-green-300" />
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER TYPES */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
            Partner Paths
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            What type of partner are you?
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-slate-500">
            Choose the setup path that fits how you plan to make money in the
            freight industry.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {partnerTypes.map((partner) => {
            const Icon = partner.icon;

            return (
              <div
                key={partner.title}
                className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-3xl font-black text-slate-950">
                  {partner.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  {partner.description}
                </p>

                <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                    Best For
                  </p>

                  <div className="mt-4 space-y-3">
                    {partner.bestFor.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 text-sm font-bold text-slate-700"
                      >
                        <CheckCircle2 size={18} className="text-green-600" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={partner.href}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  {partner.cta}
                  <ArrowRight size={18} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMPARISON */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
              Quick Comparison
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              Carrier vs Broker
            </h2>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200">
            {quickCompare.map((row) => (
              <div
                key={row.label}
                className="grid gap-0 border-b border-slate-200 last:border-b-0 md:grid-cols-3"
              >
                <div className="bg-slate-50 p-5 font-black text-slate-950">
                  {row.label}
                </div>

                <div className="border-t border-slate-200 p-5 text-slate-600 md:border-l md:border-t-0">
                  <span className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-blue-600">
                    Carrier
                  </span>
                  {row.carrier}
                </div>

                <div className="border-t border-slate-200 p-5 text-slate-600 md:border-l md:border-t-0">
                  <span className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-green-600">
                    Broker
                  </span>
                  {row.broker}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl">
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[0.2fr_1fr_0.4fr] lg:items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <BadgeCheck size={28} />
            </div>

            <div>
              <h2 className="text-3xl font-black">
                Already know your path?
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                Check your setup and see what steps are complete before moving
                forward with your authority process.
              </p>
            </div>

            <Link
              href="/products/authority-program/check-my-setup"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-700"
            >
              Check My Setup
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}