"use client";

import Image from "next/image";
import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  Home,
  Search,
  Package,
  Settings,
  FilesIcon,
  CreditCardIcon,
  Banknote,
  Menu,
  X,
  ChevronRight,
  User,
} from "lucide-react";

const sidebarSections = [
  {
    links: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Find Loads", href: "/dashboard/loads/search", icon: Search },
      { name: "My Loads", href: "/dashboard/loads/myloads", icon: Package },
      {
        name: "Documents",
        href: "/dashboard/loads/documents",
        icon: FilesIcon,
      },
      { name: "Earnings", href: "/dashboard/loads/earnings", icon: Banknote },
      {
        name: "Fuel Card",
        href: "/dashboard/loads/fuelcards",
        icon: CreditCardIcon,
      },
      { name: "Settings", href: "/dashboard/loads/settings", icon: Settings },
    ],
  },
];

type SidebarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

export default function Sidebar({ user }: { user?: SidebarUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-40 flex h-[61px] items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
        <h2 className="text-lg font-bold text-slate-950">SwiftShift</h2>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-lg border border-slate-200 p-2 text-slate-900"
        >
          <Menu size={21} />
        </button>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-[61px] z-50 flex h-[calc(100vh-61px)] w-64 flex-col
        bg-slate-900 text-white transition-transform duration-300
          md:top-0 md:h-screen md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <h2 className="text-xl font-bold tracking-tight">SwiftShift</h2>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 md:hidden"
          >
            <X size={21} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <div className="space-y-1">
            {sidebarSections[0].links.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon size={19} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="relative border-t border-white/10 p-4">
          {isProfileOpen && (
            <div className="absolute bottom-20 left-4 right-4 rounded-xl border border-white/10 bg-slate-800 p-2 shadow-xl">
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/sign-in" })}
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-200 transition hover:bg-red-500/10 hover:text-red-100"
              >
                Sign out
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/10"
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user?.name || "User profile photo"}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <User size={22} className="text-white/80" />
              )}

              {/* <span className="absolute bottom-0 right-0 z-10 h-3 w-3 rounded-full border-2 border-slate-900 bg-green-500" /> */}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-white/45">{user?.role}</p>
            </div>

            <ChevronRight
              size={16}
              className={`text-white/35 transition ${
                isProfileOpen ? "rotate-90" : ""
              }`}
            />
          </button>
        </div>
      </aside>
    </>
  );
}
