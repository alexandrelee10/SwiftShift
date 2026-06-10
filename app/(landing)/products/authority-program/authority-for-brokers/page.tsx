import BackButton from "@/app/components/shared/BackButton";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Handshake,
  Landmark,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function BrokerAuthorityPage() {
  const steps = [
    {
      title: "Form your business",
      description:
        "Set up your LLC or company name so your brokerage has an official business identity.",
      icon: Building2,
    },
    {
      title: "Get your EIN",
      description:
        "Your EIN is used for taxes, banking, FMCSA paperwork, and business accounts.",
      icon: Landmark,
    },
    {
      title: "Apply for broker authority",
      description:
        "Submit your broker authority application through FMCSA so you can legally arrange freight.",
      icon: FileText,
    },
    {
      title: "File BOC-3",
      description:
        "Appoint process agents who can receive legal paperwork for your brokerage.",
      icon: ClipboardCheck,
    },
    {
      title: "Get your surety bond",
      description:
        "Freight brokers need a $75,000 surety bond or trust fund before authority becomes active.",
      icon: ShieldCheck,
    },
    {
      title: "Start building carrier relationships",
      description:
        "Once active, begin working with shippers, carriers, contracts, and load management tools.",
      icon: Handshake,
    },
  ];

  const simpleTerms = [
    {
      term: "Broker Authority",
      meaning: "Permission to arrange loads between shippers and carriers.",
    },
    {
      term: "Surety Bond",
      meaning:
        "A required financial guarantee that protects carriers and shippers.",
    },
    {
      term: "BOC-3",
      meaning: "A legal contact filing required before authority activates.",
    },
    {
      term: "Shipper",
      meaning: "The business that needs freight moved.",
    },
    {
      term: "Carrier",
      meaning: "The trucking company that physically moves the load.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.18),transparent_30%)]" />

        <div className="relative mx-auto max-w-6xl px-6 py-8">
          <BackButton />

          <div className="grid gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                <Users size={28} />
              </div>

              <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-300">
                Broker Authority
              </p>

              <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl">
                Start your freight brokerage the simple way.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Broker authority lets you arrange freight between shippers and
                carriers. SwiftShift breaks the process down in plain English so
                new brokers know what to file, what to pay for, and what needs
                to be active before moving freight.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products/authority-program/check-my-setup"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  Check My Setup
                  <ArrowRight size={18} />
                </Link>

                <a
                  href="#steps"
                  className="rounded-2xl border border-white/15 px-6 py-3 text-center text-sm font-black text-white transition hover:bg-white/10"
                >
                  View Steps
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-200">
                Dumb simple version
              </p>

              <p className="mt-4 text-2xl font-black leading-tight text-white">
                You are not driving the truck. You are connecting the customer
                with the trucking company and managing the load.
              </p>

              <div className="mt-6 space-y-3">
                {["Shipper", "Broker", "Carrier", "Load"].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white"
                  >
                    <CheckCircle2 size={18} className="text-green-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl bg-blue-600 p-8 text-white shadow-xl shadow-blue-100">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-100">
              Plain English
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight">
              What does broker authority mean?
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-lg leading-8 text-slate-600">
              Broker authority means your company is allowed to arrange freight
              transportation. You find customers who need loads moved, then hire
              approved carriers to move those loads. You make money by charging
              the shipper more than you pay the carrier.
            </p>
          </div>
        </div>
      </section>

      <section id="steps" className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
              The Process
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              The broker setup checklist
            </h2>
          </div>

          <p className="max-w-md leading-7 text-slate-500">
            Follow these steps before trying to move freight or work directly
            with shippers and carriers.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={24} />
                  </div>

                  <span className="text-4xl font-black text-slate-100">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-black text-slate-950">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
                Broker Terms
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                Words brokers need to know
              </h2>
            </div>

            <p className="max-w-md leading-7 text-slate-500">
              These are the basic terms you’ll see when setting up and running a
              freight brokerage.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {simpleTerms.map((item) => (
              <div
                key={item.term}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-blue-50/40"
              >
                <p className="font-black text-slate-950">{item.term}</p>
                <p className="mt-2 leading-7 text-slate-500">{item.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl">
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[0.2fr_1fr_0.35fr] lg:items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-slate-950">
              <BadgeCheck size={28} />
            </div>

            <div>
              <h2 className="text-3xl font-black">
                Don’t broker freight before your authority is active.
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                Make sure your broker authority, BOC-3, surety bond, and basic
                compliance setup are active before arranging freight. Moving too
                early can create legal, payment, and trust issues.
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