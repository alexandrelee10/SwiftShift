import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  Banknote,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";

import atm from "@/public/assets/landingPage/quickpay/ATM.png";

export default function QuickPayPage() {
  const benefits = [
    {
      title: "Upfront pricing",
      description:
        "See clear payment details before you move forward, so there are no surprises later.",
      icon: BadgeDollarSign,
    },
    {
      title: "Fast payouts",
      description:
        "Submit your load documents and keep cash moving instead of waiting weeks to get paid.",
      icon: Clock3,
    },
    {
      title: "Simple document upload",
      description:
        "Upload your BOL, POD, and invoice details from one clean workflow.",
      icon: UploadCloud,
    },
    {
      title: "Carrier-first support",
      description:
        "Built to help owner-operators and small fleets stay organized after delivery.",
      icon: ShieldCheck,
    },
  ];

  const steps = [
    {
      title: "Haul the load",
      description: "Complete the delivery and collect your paperwork.",
      icon: FileText,
    },
    {
      title: "Upload documents",
      description: "Submit your BOL, POD, and invoice inside SwiftShift.",
      icon: UploadCloud,
    },
    {
      title: "Get paid faster",
      description: "Keep your operation moving with faster payment access.",
      icon: Banknote,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="font-black uppercase tracking-[0.3em] text-blue-600">
              QuickPay
            </p>

            <h1 className="mt-5 text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-7xl">
              Get paid faster after every load
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              QuickPay helps carriers submit documents, organize invoices, and
              keep cash moving without waiting weeks for payment.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-700 px-7 py-3.5 text-sm font-black text-white transition hover:bg-blue-800"
              >
                Get started <ArrowRight size={18} />
              </Link>

              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-7 py-3.5 text-sm font-black text-slate-900 transition hover:bg-slate-100"
              >
                See how it works
              </Link>
            </div>
          </div>

          <div className="relative">

            <div className="relative rounded-[2rem]  p-4">
              <Image
                src={atm}
                alt="QuickPay ATM illustration"
                priority
                className="rounded-[1.5rem] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefit cards */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 text-xl font-black text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-black uppercase tracking-[0.3em] text-blue-400">
              How it works
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              From delivered load to faster payment
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-8"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                      <Icon size={24} />
                    </div>

                    <p className="text-5xl font-black text-white/10">
                      0{index + 1}
                    </p>
                  </div>

                  <h3 className="mt-8 text-2xl font-black">{step.title}</h3>

                  <p className="mt-4 leading-7 text-slate-400">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="font-black uppercase tracking-[0.3em] text-blue-600">
              Built for carriers
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              Keep your money moving without the paperwork mess
            </h2>
          </div>

          <div className="space-y-5">
            {[
              "Upload BOLs and proof of delivery in one place",
              "Track invoice status without digging through emails",
              "Keep documents organized by load",
              "Reduce payment delays after delivery",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <CheckCircle2 className="mt-1 shrink-0 text-green-600" size={22} />

                <p className="font-bold leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-[2rem] bg-blue-700 p-10 text-white md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight md:text-5xl">
              Stop waiting weeks to get paid
            </h2>

            <p className="mt-3 max-w-xl text-blue-100">
              Start building a cleaner payment workflow for your trucking
              business.
            </p>
          </div>

          <Link
            href="/sign-up"
            className="rounded-full bg-white px-7 py-3.5 text-sm font-black text-blue-700 transition hover:bg-slate-100"
          >
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}