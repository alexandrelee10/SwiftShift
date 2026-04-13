"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, LayoutGrid, Truck, ClipboardList, MapPinned, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import logo from "@/public/assets/main-logo/dark_swiftshift_logo.svg";

const DashboardNav = () => {
    const [isOpen, setOpen] = useState(false);

    const navElements = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
        { name: "Loads", href: "/dashboard/loads", icon: Truck },
        { name: "Bookings", href: "/dashboard/bookings", icon: ClipboardList },
        { name: "Trips", href: "/dashboard/trips", icon: MapPinned },
    ];

    return (
        <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/85 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10">
                <div className="flex h-20 items-center justify-between">
                    {/* Left */}
                    <div className="flex items-center gap-10">
                        <Link href="/dashboard" className="flex items-center shrink-0">
                            <Image
                                src={logo}
                                alt="SwiftShift"
                                width={280}
                                height={100}
                                className="h-auto"
                                priority
                            />
                        </Link>

                        <div className="hidden md:flex items-center gap-2">
                            {navElements.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                                    >
                                        <Icon size={16} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/dashboard/profile"
                            className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Profile
                        </Link>

                        <button
                            onClick={() => signOut({ callbackUrl: "/sign-in" })}
                            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                        >
                            Sign Out
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden inline-flex items-center justify-center rounded-xl border border-zinc-300 p-2 text-zinc-700"
                        onClick={() => setOpen(!isOpen)}
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="border-t border-zinc-200 py-4 md:hidden">
                        <div className="flex flex-col gap-2">
                            {navElements.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                                    >
                                        <Icon size={16} />
                                        {item.name}
                                    </Link>
                                );
                            })}

                            <Link
                                href="/dashboard/profile"
                                onClick={() => setOpen(false)}
                                className="rounded-xl px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                            >
                                Profile
                            </Link>

                            <button
                                onClick={() => signOut({ callbackUrl: "/sign-in" })}
                                className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default DashboardNav;