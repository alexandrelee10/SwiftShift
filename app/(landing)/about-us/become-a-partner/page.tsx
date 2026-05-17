import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  Building2,
  CheckCircle2,
  Handshake,
  Megaphone,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";

export default function BecomePartnerPage() {
  const partnerTypes = [
    {
      title: "Broker partners",
      description:
        "Connect with carriers, post freight, and help move loads through a cleaner digital workflow.",
      icon: Building2,
    },
    {
      title: "Carrier partners",
      description:
        "Work with SwiftShift to access tools built around booking, tracking, documents, and faster operations.",
      icon: Truck,
    },
    {
      title: "Service partners",
      description:
        "Partner with us around factoring, insurance, compliance, fuel, maintenance, or carrier support.",
      icon: Handshake,
    },
  ];

  const benefits = [
    "Reach carriers, brokers, and dispatchers in one freight-focused platform",
    "Support small fleets and owner-operators with practical tools",
    "Build trust through cleaner workflows and better visibility",
    "Grow alongside a modern freight operations brand",
  ];

  const steps = [
    {
      title: "Tell us about your business",
      description:
        "Share what you offer, who you serve, and how your service supports trucking operations.",
    },
    {
      title: "We review the fit",
      description:
        "SwiftShift looks for partners that bring real value to carriers, brokers, or logistics teams.",
    },
    {
      title: "Launch together",
      description:
        "If it makes sense, we’ll explore ways to feature, integrate, or collaborate with your service.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-slate-950 px-6 py-24 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="font-black uppercase tracking-[0.3em] text-blue-400">
              Become a Partner
            </p>

            <h1 className="mt-5 text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Partner with SwiftShift to move freight smarter
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
              We’re building a freight operations platform for carriers,
              brokers, dispatchers, and small fleets. Partner with SwiftShift to
              bring useful services, tools, and support to the people keeping
              freight moving.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/company/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-700 px-7 py-3.5 text-sm font-black text-white transition hover:bg-blue-800"
              >
                Start partnership <ArrowRight size={18} />
              </Link>

              <a
                href="#partner-types"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-sm font-black text-white transition hover:bg-white/10"
              >
                Explore partner types
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <div className="grid gap-5">
              {[
                ["Carrier reach", "Support owner-operators and small fleets"],
                ["Broker tools", "Help freight teams move loads efficiently"],
                ["Service network", "Connect useful partners into the workflow"],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/10 bg-slate-950/60 p-6"
                >
                  <p className="text-xl font-black text-white">{title}</p>
                  <p className="mt-2 leading-7 text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="partner-types" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-black uppercase tracking-[0.3em] text-blue-600">
              Partner types
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              Built for the freight ecosystem
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-500">
              SwiftShift is designed to work with companies that help carriers,
              brokers, dispatchers, and logistics teams operate better.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {partnerTypes.map((partner) => {
              const Icon = partner.icon;

              return (
                <div
                  key={partner.title}
                  className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                    <Icon size={25} />
                  </div>

                  <h3 className="mt-6 text-2xl font-black text-slate-950">
                    {partner.title}
                  </h3>

                  <p className="mt-4 leading-8 text-slate-600">
                    {partner.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2">
          <div>
            <p className="font-black uppercase tracking-[0.3em] text-blue-400">
              Why partner
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              Bring value directly into the freight workflow
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              The best partnerships make life easier for the people doing the
              work. SwiftShift is focused on practical, useful connections that
              support real trucking operations.
            </p>
          </div>

          <div className="space-y-5">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <CheckCircle2
                  size={24}
                  className="mt-1 shrink-0 text-green-500"
                />

                <p className="text-lg font-bold leading-8 text-slate-200">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="font-black uppercase tracking-[0.3em] text-blue-600">
              Process
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              How partnership works
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
              >
                <p className="text-6xl font-black text-blue-100">
                  0{index + 1}
                </p>

                <h3 className="mt-6 text-2xl font-black text-slate-950">
                  {step.title}
                </h3>

                <p className="mt-4 leading-8 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 rounded-[2rem] bg-blue-700 p-10 text-white md:grid-cols-2 md:p-14">
          <div>
            <Handshake size={44} className="text-blue-100" />

            <h2 className="mt-6 text-4xl font-black tracking-tight md:text-5xl">
              Ready to build with SwiftShift?
            </h2>
          </div>

          <div>
            <p className="text-lg leading-8 text-blue-100">
              Tell us about your company, what you offer, and how you want to
              support carriers, brokers, dispatchers, or freight teams.
            </p>

            <Link
              href="/company/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-black text-blue-700 transition hover:bg-slate-100"
            >
              Contact partnerships <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}