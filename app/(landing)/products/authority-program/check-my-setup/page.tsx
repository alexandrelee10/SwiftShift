import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  CheckCircle,
  ClipboardCheck,
  FileText,
  Landmark,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";

export default function CheckMySetupPage() {
  const setupItems = [
    {
      title: "Business formed",
      description: "You have an LLC, corporation, or official business name.",
      icon: Building2,
    },
    {
      title: "EIN received",
      description: "You have your IRS EIN for taxes, banking, and filings.",
      icon: Landmark,
    },
    {
      title: "DOT number applied for",
      description: "Your company has a USDOT number through FMCSA.",
      icon: Truck,
    },
    {
      title: "MC number applied for",
      description: "You applied for motor carrier authority to haul freight.",
      icon: BadgeCheck,
    },
    {
      title: "BOC-3 filed",
      description: "Your process agent filing has been submitted.",
      icon: ClipboardCheck,
    },
    {
      title: "Insurance filed",
      description: "Your insurance company has submitted proof to FMCSA.",
      icon: ShieldCheck,
    },
    {
      title: "UCR registered",
      description: "You completed Unified Carrier Registration if required.",
      icon: FileText,
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-50">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-3xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <ClipboardCheck size={28} />
            </div>

            <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
              Authority Setup Check
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-tight text-zinc-900">
              Check if your carrier setup is ready.
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-500">
              Use this simple checklist to see what you already have done and
              what still needs to be completed before running under your own
              authority.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {setupItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon size={22} />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-zinc-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 leading-7 text-zinc-500">
                      {item.description}
                    </p>
                  </div>

                  <div className="ml-auto">
                    <CheckCircle size={22} className="text-green-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl bg-zinc-900 p-8 text-white sm:p-10">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-zinc-900">
              <AlertTriangle size={24} />
            </div>

            <div>
              <h2 className="text-3xl font-black">Important reminder</h2>

              <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
                Do not book or haul loads under your own company until your
                authority is active, your insurance is filed, and your
                compliance setup is complete.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products/authority-program/authority-for-carriers"
                  className="rounded-2xl bg-blue-600 px-6 py-3 text-center text-sm font-black text-white transition hover:bg-blue-700"
                >
                  Back to Carrier Authority
                </Link>

                <Link
                  href="/products/authority-program"
                  className="rounded-2xl border border-white/20 px-6 py-3 text-center text-sm font-black text-white transition hover:bg-white/10"
                >
                  Back to Authority Program
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}