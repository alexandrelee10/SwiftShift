"use client";

import { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  Truck,
  FileCheck,
  Clock,
  Lock,
  MessageCircle,
} from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is Swift Shift?",
      answer:
        "Swift Shift is a modern load board platform built to help drivers, brokers, and partners manage freight more clearly and efficiently.",
      icon: Truck,
    },
    {
      question: "How does Swift Shift promote safety?",
      answer:
        "We promote safety through clear expectations, compliance standards, communication, and responsible operating practices.",
      icon: ShieldCheck,
    },
    {
      question: "Does Swift Shift follow DOT and FMCSA standards?",
      answer:
        "Yes. Swift Shift is designed with transportation compliance in mind, including DOT regulations, FMCSA standards, hours of service, and driver qualification requirements.",
      icon: FileCheck,
    },
    {
      question: "How are loads managed on Swift Shift?",
      answer:
        "Brokers can post loads, drivers can search and book available loads, and both sides can track progress through the platform.",
      icon: Truck,
    },
    {
      question: "What should I do if I notice a safety concern?",
      answer:
        "Report it as soon as possible. Unsafe conditions, equipment issues, suspicious activity, or compliance concerns should never be ignored.",
      icon: MessageCircle,
    },
    {
      question: "Can drivers track booked loads?",
      answer:
        "Yes. Drivers can view booked, in-transit, and delivered loads from their dashboard.",
      icon: Clock,
    },
    {
      question: "How does Swift Shift protect user information?",
      answer:
        "Swift Shift values privacy and uses responsible data practices to help protect account, load, and business information.",
      icon: Lock,
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-50">
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.08),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                <HelpCircle size={24} />
              </div>

              <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-sm font-medium text-blue-700">
                Help Center
              </span>
            </div>

            <h1 className="text-5xl font-black tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
              Frequently Asked
              <span className="text-blue-600"> Questions</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-500 sm:text-xl">
              Clear answers about Swift Shift, load management, safety,
              compliance, and platform support.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Common Questions
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
            Everything You Need To Know
          </h2>

          <p className="mt-5 text-lg leading-8 text-zinc-500">
            Browse through common questions drivers, brokers, and partners may
            have about Swift Shift.
          </p>

          <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-zinc-900">
              Need more help?
            </p>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Contact support if your question is about your account, a load, or
              a compliance concern.
            </p>

            <button className="mt-5 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
              Contact Support
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center gap-5 px-6 py-5 text-left transition hover:bg-zinc-50"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon size={23} />
                  </div>

                  <span className="flex-1 text-lg font-bold text-zinc-900">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={22}
                    className={`shrink-0 text-zinc-400 transition ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-zinc-100 px-6 pb-6 pt-5 leading-7 text-zinc-500">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}