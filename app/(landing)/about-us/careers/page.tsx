"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  Briefcase,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Compass,
  DollarSign,
  Headphones,
  HeartPulse,
  Megaphone,
  Search,
  ShieldCheck,
  Sparkles,
  TruckIcon,
  Users,
} from "lucide-react";

export default function CareersPage() {
  const [zipCode, setZipCode] = useState("");
  const [department, setDepartment] = useState("All");

  const roles = [
    {
      title: "Frontend Engineer",
      department: "Engineering",
      type: "Full-time",
      location: "Remote",
      zip: "33313",
      icon: Code2,
    },
    {
      title: "Backend Engineer",
      department: "Engineering",
      type: "Full-time",
      location: "Remote",
      zip: "33313",
      icon: Code2,
    },
    {
      title: "Full Stack Engineer",
      department: "Engineering",
      type: "Full-time",
      location: "Remote",
      zip: "33313",
      icon: Code2,
    },
    {
      title: "Software Engineer Intern",
      department: "Engineering",
      type: "Internship",
      location: "Remote",
      zip: "33313",
      icon: Code2,
    },
    {
      title: "QA Engineer",
      department: "Engineering",
      type: "Full-time",
      location: "Remote",
      zip: "33313",
      icon: Code2,
    },
    {
      title: "Product Designer",
      department: "Product",
      type: "Contract",
      location: "Remote",
      zip: "00000",
      icon: Sparkles,
    },
    {
      title: "UI/UX Designer",
      department: "Product",
      type: "Full-time",
      location: "Remote",
      zip: "00000",
      icon: Sparkles,
    },
    {
      title: "Product Manager",
      department: "Product",
      type: "Full-time",
      location: "Remote",
      zip: "00000",
      icon: Sparkles,
    },
    {
      title: "Logistics Operations Associate",
      department: "Operations",
      type: "Full-time",
      location: "Miami, FL",
      zip: "33101",
      icon: TruckIcon,
    },
    {
      title: "Dispatch Coordinator",
      department: "Operations",
      type: "Full-time",
      location: "Fort Lauderdale, FL",
      zip: "33301",
      icon: TruckIcon,
    },
    {
      title: "Load Planner",
      department: "Operations",
      type: "Full-time",
      location: "Remote",
      zip: "33313",
      icon: TruckIcon,
    },
    {
      title: "Fleet Operations Specialist",
      department: "Operations",
      type: "Full-time",
      location: "South Florida",
      zip: "33324",
      icon: TruckIcon,
    },
    {
      title: "Carrier Relations Coordinator",
      department: "Operations",
      type: "Full-time",
      location: "Remote",
      zip: "33313",
      icon: TruckIcon,
    },
    {
      title: "Carrier Support Specialist",
      department: "Support",
      type: "Full-time",
      location: "South Florida",
      zip: "33324",
      icon: Headphones,
    },
    {
      title: "Broker Support Specialist",
      department: "Support",
      type: "Full-time",
      location: "Remote",
      zip: "33313",
      icon: Headphones,
    },
    {
      title: "Customer Success Manager",
      department: "Support",
      type: "Full-time",
      location: "Remote",
      zip: "33313",
      icon: Headphones,
    },
    {
      title: "Driver Success Specialist",
      department: "Support",
      type: "Full-time",
      location: "South Florida",
      zip: "33324",
      icon: Headphones,
    },
    {
      title: "Account Executive",
      department: "Sales",
      type: "Full-time",
      location: "Remote",
      zip: "33313",
      icon: Briefcase,
    },
    {
      title: "Business Development Representative",
      department: "Sales",
      type: "Full-time",
      location: "Miami, FL",
      zip: "33101",
      icon: Briefcase,
    },
    {
      title: "Carrier Acquisition Specialist",
      department: "Sales",
      type: "Full-time",
      location: "Remote",
      zip: "33313",
      icon: Briefcase,
    },
    {
      title: "Broker Acquisition Specialist",
      department: "Sales",
      type: "Full-time",
      location: "Remote",
      zip: "33313",
      icon: Briefcase,
    },
    {
      title: "Growth Marketing Manager",
      department: "Marketing",
      type: "Full-time",
      location: "Remote",
      zip: "33313",
      icon: Megaphone,
    },
    {
      title: "Content Marketing Specialist",
      department: "Marketing",
      type: "Full-time",
      location: "Remote",
      zip: "33313",
      icon: Megaphone,
    },
    {
      title: "Social Media Manager",
      department: "Marketing",
      type: "Part-time",
      location: "Remote",
      zip: "33313",
      icon: Megaphone,
    },
    {
      title: "Compliance Specialist",
      department: "Compliance",
      type: "Full-time",
      location: "Remote",
      zip: "33313",
      icon: ShieldCheck,
    },
    {
      title: "Safety Coordinator",
      department: "Compliance",
      type: "Full-time",
      location: "South Florida",
      zip: "33324",
      icon: ShieldCheck,
    },
    {
      title: "Accounts Receivable Specialist",
      department: "Finance",
      type: "Full-time",
      location: "Remote",
      zip: "33313",
      icon: DollarSign,
    },
    {
      title: "Payroll Specialist",
      department: "Finance",
      type: "Full-time",
      location: "Remote",
      zip: "33313",
      icon: DollarSign,
    },
    {
      title: "Operations Manager",
      department: "Leadership",
      type: "Full-time",
      location: "South Florida",
      zip: "33324",
      icon: Users,
    },
    {
      title: "Director of Carrier Success",
      department: "Leadership",
      type: "Full-time",
      location: "Remote",
      zip: "33313",
      icon: Users,
    },
    {
      title: "VP of Operations",
      department: "Leadership",
      type: "Full-time",
      location: "Remote",
      zip: "33313",
      icon: Users,
    },
  ];

  const departments = [
    "All",
    "Engineering",
    "Product",
    "Operations",
    "Support",
    "Sales",
    "Marketing",
    "Compliance",
    "Finance",
    "Leadership",
  ];

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesDepartment =
        department === "All" || role.department === department;

      const matchesZip =
        zipCode.trim() === "" ||
        role.zip.includes(zipCode.trim()) ||
        role.location.toLowerCase().includes("remote");

      return matchesDepartment && matchesZip;
    });
  }, [zipCode, department]);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-slate-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="font-black uppercase tracking-[0.3em] text-blue-400">
            SwiftShift Careers
          </p>

          <h1 className="mt-5 max-w-5xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Help build the future of freight operations
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
            Join a freight-tech team building modern tools for carriers,
            brokers, dispatchers, and small fleets.
          </p>

          <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="grid gap-4 md:grid-cols-[1fr_240px_auto]">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Search by ZIP code"
                  className="h-14 w-full rounded-full border border-white/10 bg-slate-950 px-12 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="h-14 rounded-full border border-white/10 bg-slate-950 px-5 text-white outline-none focus:border-blue-500"
              >
                {departments.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <a
                href="#open-roles"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-blue-700 px-7 text-sm font-black text-white transition hover:bg-blue-800"
              >
                Search jobs <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="font-black uppercase tracking-[0.3em] text-blue-600">
              Why SwiftShift
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              Build software for real freight operators
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-500">
              We’re focused on practical tools that help trucking businesses
              manage loads, documents, tracking, payments, and operations.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Freight-first product",
                description:
                  "Build around the real problems carriers and dispatchers deal with daily.",
                icon: TruckIcon,
              },
              {
                title: "Modern technology",
                description:
                  "Work on dashboards, maps, payments, automation, and real-time workflows.",
                icon: Code2,
              },
              {
                title: "Clear mission",
                description:
                  "Make trucking operations feel less scattered and more manageable.",
                icon: Compass,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-6 text-2xl font-black text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-8 text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-black uppercase tracking-[0.3em] text-blue-400">
              Benefits
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              Work where impact is visible
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Remote-friendly", Compass],
              ["Growth focused", Sparkles],
              ["Competitive goals", BadgeDollarSign],
              ["Healthy pace", HeartPulse],
            ].map(([title, Icon]) => {
              const LucideIcon = Icon as typeof Compass;

              return (
                <div
                  key={title as string}
                  className="rounded-[2rem] border border-white/10 bg-white/5 p-7"
                >
                  <LucideIcon className="text-blue-400" size={30} />

                  <h3 className="mt-5 text-xl font-black">
                    {title as string}
                  </h3>

                  <div className="mt-5 space-y-3 text-sm font-semibold text-slate-400">
                    {["Flexible roles", "Supportive team", "Room to learn"].map(
                      (item) => (
                        <p key={item} className="flex gap-2">
                          <ShieldCheck
                            size={17}
                            className="mt-0.5 shrink-0 text-green-500"
                          />
                          {item}
                        </p>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="open-roles" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-black uppercase tracking-[0.3em] text-blue-600">
                Open roles
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
                Find your next role
              </h2>
            </div>

            <p className="max-w-xl text-lg leading-8 text-slate-500">
              Showing {filteredRoles.length} open role
              {filteredRoles.length === 1 ? "" : "s"} based on your search.
            </p>
          </div>

          <div className="mt-12 grid gap-5">
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => {
                const Icon = role.icon;
                const slug = role.title.toLowerCase().replaceAll(" ", "-");

                return (
                  <div
                    key={role.title}
                    className="flex flex-col gap-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-xl md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                        <Icon size={24} />
                      </div>

                      <div>
                        <h3 className="text-2xl font-black text-slate-950">
                          {role.title}
                        </h3>

                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          {role.department} • {role.type} • {role.location}
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          ZIP: {role.zip === "00000" ? "Remote" : role.zip}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/about-us/careers/apply/${slug}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-800"
                    >
                      Apply now <ArrowRight size={17} />
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center">
                <BriefcaseBusiness
                  className="mx-auto text-slate-400"
                  size={42}
                />

                <h3 className="mt-5 text-2xl font-black text-slate-950">
                  No roles found
                </h3>

                <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-500">
                  Try a different ZIP code or department. Remote roles may still
                  be available.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-[2rem] bg-blue-700 p-10 text-white md:flex-row md:items-center">
          <div>
            <CheckCircle2 size={40} className="text-blue-100" />

            <h2 className="mt-5 text-4xl font-black tracking-tight">
              Don’t see the right role?
            </h2>

            <p className="mt-3 max-w-xl text-blue-100">
              Reach out anyway. SwiftShift is always open to builders,
              operators, designers, and logistics-minded people.
            </p>
          </div>

          <Link
            href="/contact"
            className="rounded-full bg-white px-7 py-3.5 text-sm font-black text-blue-700 transition hover:bg-slate-100"
          >
            Contact us
          </Link>
        </div>
      </section>
    </main>
  );
}