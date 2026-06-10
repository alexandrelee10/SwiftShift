"use client";

import { useState } from "react";
import {
  HelpCircle,
  Search,
  ShieldCheck,
  Truck,
  UserCircle,
  CreditCard,
  MessageCircle,
  FileText,
  ChevronDown,
} from "lucide-react";

export default function HelpCenterPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const helpTopics = [
    {
      title: "Getting Started",
      description: "Learn how to create an account and set up your profile.",
      icon: UserCircle,
    },
    {
      title: "Loads & Bookings",
      description: "Understand how to search, book, and manage loads.",
      icon: Truck,
    },
    {
      title: "Safety & Compliance",
      description: "Review safety expectations and compliance information.",
      icon: ShieldCheck,
    },
    {
      title: "Billing & Payments",
      description: "Find help with rates, payments, and account billing.",
      icon: CreditCard,
    },
  ];

  const commonQuestions = [
    {
      question: "How do I create an account?",
      answer:
        "Click Sign Up from the homepage, complete the registration form, and verify your email address to activate your account.",
    },
    {
      question: "How do I book a load?",
      answer:
        "Browse available loads, select the load you want, and click Request Load. Once approved by the broker, the load will appear in your approved loads section.",
    },
    {
      question: "Where can I view my active loads?",
      answer:
        "Navigate to Dashboard → My Loads. Active and in-transit loads will be displayed there.",
    },
    {
      question: "How do I report a safety issue?",
      answer:
        "Open the Support section and submit a safety report with the details of the incident. A team member will review it promptly.",
    },
    {
      question: "How do I update my profile information?",
      answer:
        "Go to Settings → Profile and update your personal information, then click Save Changes.",
    },
    {
      question: "Do I need to hire dispatch?",
      answer:
        "No. Many owner-operators dispatch themselves using load boards. As your business grows, you can hire a dispatcher if you prefer help finding and managing loads.",
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* HERO */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <HelpCircle size={24} />
          </div>

          <h1 className="text-5xl font-black tracking-tight text-zinc-900">
            Help Center
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-500">
            Find answers, support articles, and guidance for using Swift Shift.
          </p>

          <div className="mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-left">
            <Search size={22} className="text-zinc-400" />
            <input
              type="text"
              placeholder="Search help articles..."
              className="w-full bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
            />
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Browse Topics
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-900">
            How can we help?
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {helpTopics.map((topic) => {
            const Icon = topic.icon;

            return (
              <div
                key={topic.title}
                className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon size={24} />
                </div>

                <h3 className="mt-5 text-xl font-black text-zinc-900">
                  {topic.title}
                </h3>

                <p className="mt-3 leading-7 text-zinc-500">
                  {topic.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMMON QUESTIONS */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Popular Questions
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-900">
              Common things people ask
            </h2>
          </div>

          <div className="divide-y divide-zinc-200">
            {commonQuestions.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={item.question} className="py-1">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="shrink-0 text-blue-600" />
                      <p className="font-semibold text-zinc-800">
                        {item.question}
                      </p>
                    </div>

                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-blue-600 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pb-5 pl-8 sm:pl-11">
                      <p className="max-w-3xl text-sm leading-6 text-zinc-500">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl bg-zinc-900 p-8 text-white sm:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
                <MessageCircle size={24} />
              </div>

              <h2 className="mt-5 text-3xl font-black">Still need help?</h2>

              <p className="mt-3 max-w-2xl leading-7 text-zinc-300">
                Contact Swift Shift support for help with your account, loads,
                safety concerns, or platform access.
              </p>
            </div>

            <button className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}