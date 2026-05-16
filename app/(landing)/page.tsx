import Link from "next/link";
import { ArrowRight, CreditCard, MapPinned, PackageSearch, ShieldCheck, Truck } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <section id="home" className="scroll-mt-24 bg-[#061b3a] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="mb-5 inline-flex rounded-full bg-blue-500/20 px-4 py-2 text-sm font-bold text-blue-200">
              Built for carriers, brokers, and dispatchers
            </p>

            <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Move freight smarter with SwiftShift
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Find loads, manage documents, track trips, and keep your trucking
              business moving from one clean dashboard.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-black text-slate-950 transition hover:bg-slate-100"
              >
                Get started <ArrowRight size={18} />
              </Link>

              <a
                href="#load-board"
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-black text-white transition hover:bg-white/10"
              >
                View load board
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <div className="rounded-[1.5rem] bg-white p-5 text-slate-950">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-500">
                    Live load board
                  </p>
                  <h3 className="text-2xl font-black">Available Loads</h3>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                  24 new
                </span>
              </div>

              {[
                ["Miami, FL", "Atlanta, GA", "$2,450", "Reefer"],
                ["Tampa, FL", "Charlotte, NC", "$1,980", "Dry Van"],
                ["Orlando, FL", "Dallas, TX", "$3,200", "Flatbed"],
              ].map((load) => (
                <div
                  key={load.join("-")}
                  className="mb-3 rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black">
                        {load[0]} → {load[1]}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{load[3]}</p>
                    </div>

                    <p className="text-lg font-black text-blue-700">
                      {load[2]}
                    </p>
                  </div>
                </div>
              ))}

              <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
                <p className="text-sm text-slate-400">Today’s booked revenue</p>
                <p className="mt-1 text-3xl font-black">$7,630</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="solutions"
        className="mx-auto grid max-w-7xl scroll-mt-24 gap-5 px-6 py-16 md:grid-cols-3"
      >
        {[
          {
            role: "Carrier",
            text: "Find better loads, manage trips, and keep documents organized.",
            icon: Truck,
          },
          {
            role: "Broker",
            text: "Post freight, manage booked loads, and connect with drivers.",
            icon: PackageSearch,
          },
          {
            role: "Dispatcher",
            text: "Track trucks, organize paperwork, and monitor performance.",
            icon: MapPinned,
          },
        ].map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.role}
              className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <Icon className="mb-6 text-blue-700" size={36} />
              <p className="text-sm font-black uppercase tracking-wide text-slate-500">
                I am a
              </p>
              <h3 className="mt-2 text-3xl font-black">{card.role}</h3>
              <p className="mt-4 leading-7 text-slate-600">{card.text}</p>

              <Link
                href="/sign-up"
                className="mt-6 inline-flex items-center gap-2 font-black text-blue-700"
              >
                Learn more <ArrowRight size={17} />
              </Link>
            </div>
          );
        })}
      </section>

      <section className="bg-slate-950 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
          {[
            ["10K+", "Loads managed"],
            ["98%", "On-time tracking goal"],
            ["24/7", "Dashboard access"],
          ].map(([num, label]) => (
            <div key={label} className="text-center">
              <p className="text-5xl font-black text-blue-400">{num}</p>
              <p className="mt-2 text-sm font-bold uppercase tracking-wide text-slate-400">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="load-board"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20"
      >
        <div className="max-w-2xl">
          <p className="font-black uppercase tracking-wide text-blue-700">
            End-to-end tools
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Everything your trucking workflow needs
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Load Board", "Search and book freight faster.", PackageSearch],
            ["Tracking", "Monitor active trips in one place.", MapPinned],
            ["Documents", "Keep BOLs and paperwork organized.", ShieldCheck],
            ["Earnings", "Track revenue, fuel, and payouts.", CreditCard],
          ].map(([title, text, Icon]) => {
            const LucideIcon = Icon as typeof Truck;

            return (
              <div
                key={title as string}
                className="rounded-3xl border border-slate-200 p-6"
              >
                <LucideIcon className="text-blue-700" size={30} />
                <h3 className="mt-5 text-xl font-black">{title as string}</h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {text as string}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-blue-700 px-6 py-20 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-4xl font-black tracking-tight">
              Ready to move your next load?
            </h2>
            <p className="mt-3 max-w-xl text-blue-100">
              Build your freight workflow with a clean load board, tracking,
              documents, and earnings dashboard.
            </p>
          </div>

          <Link
            href="/sign-up"
            className="rounded-full bg-white px-8 py-4 text-sm font-black text-blue-700 transition hover:bg-slate-100"
          >
            Create account
          </Link>
        </div>
      </section>
    </>
  );
}