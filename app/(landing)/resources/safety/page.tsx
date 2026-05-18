import {
  ShieldCheck,
  BadgeCheck,
  TriangleAlert,
  Handshake,
  HardHat,
  Eye,
  Users,
  FileCheck,
} from "lucide-react";

export default function SafetyAndCompliancePage() {
  const commitments = [
    {
      title: "People First",
      description:
        "We prioritize the safety and well-being of drivers, brokers, and partners across every shipment.",
      icon: ShieldCheck,
    },
    {
      title: "Compliance Focused",
      description:
        "Operating within DOT, FMCSA, and industry regulations is built into everything we do.",
      icon: BadgeCheck,
    },
    {
      title: "Risk Aware",
      description:
        "We actively identify risks and build systems that reduce incidents before they happen.",
      icon: TriangleAlert,
    },
    {
      title: "Integrity Driven",
      description:
        "Swift Shift operates with transparency, accountability, and professionalism.",
      icon: Handshake,
    },
  ];

  const expectations = [
    {
      title: "Follow Safety Procedures",
      description:
        "Drivers and partners are expected to follow all established operational and safety guidelines.",
      icon: HardHat,
    },
    {
      title: "Stay Alert",
      description:
        "Remain aware of road conditions, equipment issues, and unsafe environments.",
      icon: Eye,
    },
    {
      title: "Work Together",
      description:
        "Communication between brokers, dispatchers, and drivers keeps everyone protected.",
      icon: Users,
    },
    {
      title: "Report Issues",
      description:
        "Incidents, hazards, and compliance concerns should be reported immediately.",
      icon: FileCheck,
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.08),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="max-w-4xl">

            <h1 className="text-5xl font-black tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
              Safety &
              <span className="text-blue-600"> Compliance</span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-500 sm:text-xl">
              At Swift Shift, safety is our priority and compliance is our
              standard. We are committed to protecting our team, our partners,
              and the communities we serve by operating with integrity,
              accountability, and care.
            </p>
          </div>
        </div>
      </section>

      {/* COMMITMENTS */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Our Commitment
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              Built Around Protection & Trust
            </h2>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {commitments.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-3xl border border-zinc-200 bg-white p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/40"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={26} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-zinc-900">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-zinc-500">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* EXPECTATIONS */}
      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-2 lg:px-8">
          {/* LEFT */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Expectations
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-900">
              Safety Starts With Everyone
            </h2>

            <div className="mt-10 space-y-6">
              {expectations.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex gap-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-5"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                      <Icon size={22} />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-zinc-900">
                        {item.title}
                      </h3>

                      <p className="mt-1 leading-7 text-zinc-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-[2rem] bg-zinc-900 p-10 text-white">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
              <ShieldCheck size={30} />
            </div>

            <h2 className="mt-8 text-3xl font-black">
              Our Compliance Standards
            </h2>

            <p className="mt-5 text-lg leading-8 text-zinc-300">
              Swift Shift complies with federal, state, and transportation
              industry regulations to ensure safe and reliable operations.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "DOT Regulations",
                "FMCSA Safety Standards",
                "Driver Qualification Requirements",
                "Hours of Service Compliance",
                "Equipment & Maintenance Standards",
                "Privacy & Data Protection",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                >
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />

                  <span className="font-medium text-zinc-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-blue-600 px-8 py-12 text-white sm:px-12">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
                Swift Shift Commitment
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight">
                Safety isn’t optional.
              </h2>

              <p className="mt-5 text-lg leading-8 text-blue-100">
                We believe strong compliance and operational safety create
                better experiences for drivers, brokers, and customers alike.
              </p>
            </div>

            <button className="rounded-2xl bg-white px-7 py-4 text-base font-bold text-blue-600 transition hover:bg-zinc-100">
              Contact Compliance Team
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}