import NavBar from "./components/LandingNavbar";
import ipads from "../public/assets/homepage/ipads.png";
import Image from "next/image";
import GetStarted from "./components/getStarted";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Search, Truck, MapPin } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <NavBar />

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:px-12 lg:px-20">
        <div>
          <p className="mb-5 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-blue-700">
            Smart load access
          </p>

          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            Move freight faster.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
            SwiftShift helps brokers and carriers search, post, and manage loads
            with a cleaner freight workflow.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 py-3 font-medium text-white hover:bg-zinc-800"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 px-6 py-3 font-medium text-zinc-800 hover:bg-zinc-50"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 text-sm text-zinc-600">
            {["Load search", "Route preview", "Broker tools"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-600" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm">
          <Image
            src={ipads}
            alt="SwiftShift dashboard preview"
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="grid gap-4 rounded-3xl border border-zinc-200 bg-zinc-50 p-4 md:grid-cols-3">
          {[
            ["1,200+", "Active loads"],
            ["340+", "Carriers"],
            ["48", "States"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl bg-white p-6">
              <p className="text-3xl font-bold">{value}</p>
              <p className="mt-1 text-sm text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12 lg:px-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-4xl font-bold tracking-tight">
            Built for simple freight management.
          </h2>
          <p className="mt-4 text-zinc-600">
            Everything is focused on helping users find, review, and move loads
            faster.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Search,
              title: "Search loads",
              text: "Filter freight by origin, destination, equipment, rate, and distance.",
            },
            {
              icon: MapPin,
              title: "Preview routes",
              text: "See route context so carriers can understand the load faster.",
            },
            {
              icon: Truck,
              title: "Manage trips",
              text: "Track load activity from posted to booked and delivered.",
            },
          ].map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={21} />
                </div>

                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 leading-7 text-zinc-600">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Existing Get Started */}
      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-12 lg:px-20">
        <GetStarted />
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-12 lg:px-20">
        <div className="rounded-3xl bg-zinc-950 p-8 text-white md:p-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold">Start moving smarter.</h2>
              <p className="mt-2 text-zinc-300">
                Build a cleaner workflow for freight search and load management.
              </p>
            </div>

            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-zinc-950 hover:bg-zinc-100"
            >
              Create Account
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;