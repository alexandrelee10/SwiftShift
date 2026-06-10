import BackButton from "@/app/components/shared/BackButton";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Landmark,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";

export default function CarrierAuthorityPage() {
  const steps = [
    {
      title: "Form your business",
      description:
        "Set up your LLC or company name so your trucking business is official before applying for authority.",
      icon: Landmark,
    },
    {
      title: "Get your EIN",
      description:
        "Your EIN is like a Social Security number for your business. You’ll use it for taxes, banking, and FMCSA paperwork.",
      icon: FileText,
    },
    {
      title: "Apply for DOT and MC numbers",
      description:
        "Your DOT number identifies your carrier. Your MC number gives you permission to haul regulated freight for hire.",
      icon: Truck,
    },
    {
      title: "File BOC-3",
      description:
        "This appoints legal agents who can receive official paperwork for your company in each state.",
      icon: ClipboardCheck,
    },
    {
      title: "Get insurance",
      description:
        "You need active commercial trucking insurance before your authority becomes active.",
      icon: ShieldCheck,
    },
    {
      title: "Wait for activation",
      description:
        "Once everything is filed and approved, your authority becomes active and you can start booking loads.",
      icon: BadgeCheck,
    },
  ];

  const simpleTerms = [
    {
      term: "DOT Number",
      meaning: "Your trucking company’s ID number.",
    },
    {
      term: "MC Number",
      meaning: "Your permission slip to haul freight for money.",
    },
    {
      term: "BOC-3",
      meaning: "A legal contact form the government requires.",
    },
    {
      term: "Authority",
      meaning: "Permission to operate as your own trucking company.",
    },
    {
      term: "Insurance Filing",
      meaning: "Proof your trucking insurance is active.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_30%)]" />

        <div className="relative mx-auto max-w-6xl px-6 py-8">
          <BackButton />

          <div className="grid gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                <Truck size={28} />
              </div>

              <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-300">
                Carrier Authority
              </p>

              <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl">
                Get your trucking authority without the headache.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Starting your own carrier company sounds confusing, but it
                really comes down to a few basic steps. We break it down in
                plain English so you know what to do, what to file, and what
                comes next.
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
                The government needs to know your company, your truck, and your
                insurance before you can haul loads as your own carrier.
              </p>

              <div className="mt-6 space-y-3">
                {["Company", "DOT / MC", "BOC-3", "Insurance"].map((item) => (
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

      {/* SIMPLE EXPLANATION */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl bg-blue-600 p-8 text-white shadow-xl shadow-blue-100">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-100">
              Plain English
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight">
              What does “getting your authority” mean?
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-lg leading-8 text-slate-600">
              Getting your authority means you are no longer just a driver
              working under someone else. You become the carrier. That means
              you can book your own loads, run under your own company name, work
              with brokers, and build your own trucking business.
            </p>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section id="steps" className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
              The Process
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              The authority setup checklist
            </h2>
          </div>

          <p className="max-w-md leading-7 text-slate-500">
            Follow these in order so you don’t waste time or miss something
            important before trying to book freight.
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

      {/* TERMS */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
                Trucking Terms
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                Words that sound complicated but aren’t
              </h2>
            </div>

            <p className="max-w-md leading-7 text-slate-500">
              Here’s the “normal person” version of the words you’ll keep
              seeing when setting up authority.
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

      {/* WARNING */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl">
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[0.2fr_1fr_0.35fr] lg:items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-slate-950">
              <AlertTriangle size={28} />
            </div>

            <div>
              <h2 className="text-3xl font-black">
                Don’t start booking loads too early.
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                Before you run under your own company, make sure your authority,
                insurance, BOC-3, registration, and compliance setup are active.
                Running before everything is ready can cause fines, denied
                loads, or insurance problems.
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