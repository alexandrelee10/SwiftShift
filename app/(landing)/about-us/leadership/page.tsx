import Image from "next/image";

import TruckHero from "@/public/assets/landingPage/leadership/hero/hero.png";

import PresidentImg from "@/public/assets/landingPage/leadership/headshots/President.png"
import CEOImg from "@/public/assets/landingPage/leadership/headshots/Chief-Executive-Officer.png"
import CFOImg from "@/public/assets/landingPage/leadership/headshots/Chief-Financial-Officer.jpg"
import COOImg from "@/public/assets/landingPage/leadership/headshots/Chief-Operating-Officer.png"
import CPOImg from "@/public/assets/landingPage/leadership/headshots/Chief-People-Officer.png"
import CPTImg from "@/public/assets/landingPage/leadership/headshots/Chief-Product-Tech.png"
import FounderImg from "@/public/assets/landingPage/leadership/headshots/Founder.png"
import TTMImg from "@/public/assets/landingPage/leadership/headshots/Trucker-Tools-Marketing.png"

import {
    ShieldCheckIcon,
    Users2Icon,
    ChartLineIcon,
} from "lucide-react";

export default function LeadershipPage() {

    const leadershipTeam = [
        {
            name: "Alexandre Lee",
            position: "Founder",
            summary: "Founded SwiftShift with a vision to modernize freight operations through technology, automation, and smarter logistics solutions.",
            image: FounderImg

        },

        {
            name: "Marcus Bennett",
            position: "President",
            summary: "Leads company strategy and operational growth while driving long-term partnerships across the transportation industry.",
            image: PresidentImg
        },

        {
            name: "Daniel Brooks",
            position: "Chief Technology Officer",
            summary: "Oversees platform engineering, infrastructure, and product innovation focused on scalable logistics technology.",
            image: CPTImg
        },

        {
            name: "Sophia Carter",
            position: "Chief Executive Officer",
            summary: "Experienced executive focused on building high-performing teams and leading SwiftShift’s national expansion efforts.",
            image: CEOImg
        },

        {
            name: "Isabella Reyes",
            position: "Chief Operating Officer",
            summary: "Specializes in operations management, carrier workflows, and streamlining freight coordination at scale.",
            image: COOImg
        },

        {
            name: "Olivia Nguyen",
            position: "Chief Product Officer",
            summary: "Drives product strategy and user experience to ensure SwiftShift delivers modern tools for brokers and drivers.",
            image: CPOImg
        },

        {
            name: "Madison Turner",
            position: "Truckers & Tools Marketing Director",
            summary: "Leads marketing initiatives focused on driver engagement, brand growth, and transportation industry outreach.",
            image: TTMImg
        },

        {
            name: "Emma Richardson",
            position: "Chief Financial Officer",
            summary: "Oversees financial strategy, forecasting, and growth planning to support SwiftShift’s long-term sustainability.",
            image: CFOImg
        },
    ];
    return (
        <main className="min-h-screen bg-white">
            <div className="overflow-hidden">
                {/* Hero Section */}
                <section className="relative bg-slate-950 text-white overflow-hidden">
                    <div className="grid min-h-[700px] grid-cols-1 lg:grid-cols-2">

                        {/* LEFT */}
                        <div className="relative z-20 flex items-center px-6 py-20 lg:px-20">
                            <div className="max-w-2xl">
                                <p className="mb-6 text-sm font-semibold uppercase tracking-[0.25em] text-blue-500">
                                    About SwiftShift
                                </p>

                                <h2 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
                                    MEET THE
                                    <br />
                                    <span className="text-blue-500">LEADERSHIP</span>
                                </h2>

                                <p className="mt-8 text-lg leading-8 text-slate-300">
                                    The people driving SwiftShift forward. Our leadership team
                                    brings decades of experience in logistics, technology, and
                                    operations — united by a mission to move freight smarter,
                                    faster, and more reliably.
                                </p>

                                {/* FEATURE ROW */}
                                <div className="mt-14 flex flex-wrap items-center gap-10">

                                    {/* ITEM */}
                                    <div className="flex items-center gap-3">
                                        <ShieldCheckIcon
                                            size={24}
                                            strokeWidth={1.8}
                                            className="text-white"
                                        />

                                        <p className="text-sm font-medium text-white">
                                            Proven
                                            <br />
                                            Experience
                                        </p>
                                    </div>

                                    {/* ITEM */}
                                    <div className="flex items-center gap-3">
                                        <Users2Icon
                                            size={24}
                                            strokeWidth={1.8}
                                            className="text-white"
                                        />

                                        <p className="text-sm font-medium text-white">
                                            Customer
                                            <br />
                                            Focused
                                        </p>
                                    </div>

                                    {/* ITEM */}
                                    <div className="flex items-center gap-3">
                                        <ChartLineIcon
                                            size={24}
                                            strokeWidth={1.8}
                                            className="text-white"
                                        />

                                        <p className="text-sm font-medium text-white">
                                            Results
                                            <br />
                                            Driven
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT IMAGE */}
                        <div className="relative min-h-[500px] lg:min-h-full">
                            <div
                                className="absolute inset-0"
                                style={{
                                    clipPath:
                                        "polygon(14% 0%, 100% 0%, 100% 100%, 0% 100%)",
                                }}
                            >
                                <Image
                                    src={TruckHero}
                                    alt="Hero image for truck"
                                    fill
                                    priority
                                    className="object-cover"
                                />

                                {/* DARK OVERLAY */}
                                <div className="absolute inset-0 bg-black/35" />

                                {/* BLUE GRADIENT GLOW */}
                                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-slate-950/80" />
                            </div>
                        </div>
                    </div>

                    {/* ANGLED DIVIDER */}
                    <div className="absolute left-1/2 top-0 hidden h-full w-24 -translate-x-1/2 rotate-6 bg-slate-950 lg:block overflow-hidden" />
                </section>

                {/* Meet The Team Section */}
                <section className="bg-slate-50 px-6 py-24 lg:px-20">
                    {/* TOP TEXT */}
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                            Our Leadership Team
                        </p>

                        <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                            Experienced. Passionate. Committed.
                        </h2>

                        <p className="mt-6 text-lg leading-8 text-slate-600">
                            We&apos;re a team of innovators, operators, and problem-solvers
                            building the future of freight.
                        </p>
                    </div>

                    {/* GRID */}
                    <div className="mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                        {leadershipTeam.map((member) => (
                            <div
                                key={member.name}
                                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                {/* IMAGE */}
                                <div className="relative h-[320px] overflow-hidden">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition duration-500 group-hover:scale-105"
                                    />
                                </div>

                                {/* CONTENT */}
                                <div className="p-7">
                                    <h3 className="text-2xl font-bold tracking-tight text-slate-950">
                                        {member.name}
                                    </h3>

                                    <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
                                        {member.position}
                                    </p>

                                    <p className="mt-5 leading-7 text-slate-600">
                                        {member.summary}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}