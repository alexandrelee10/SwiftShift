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

import DarkLogo from "@/public/assets/main-logo/logoDark.svg";

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
      {
        name: "Earnings",
        href: "/dashboard/loads/earnings",
        icon: Banknote,
      },
      {
        name: "Fuel Card",
        href: "/dashboard/loads/fuelcards",
        icon: CreditCardIcon,
      },
      {
        name: "Settings",
        href: "/dashboard/loads/settings",
        icon: Settings,
      },
    ],
  },
];

type SidebarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

export default function Sidebar({
  user,
}: {
  user?: SidebarUser;
}) {
  const [isOpen, setIsOpen] =
    useState(false);

  const [
    isProfileOpen,
    setIsProfileOpen,
  ] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-[70px] items-center border-b border-white/10 bg-slate-800 px-4 md:hidden">
        {/* Centered logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Image
            src={DarkLogo}
            alt="SwiftShift logo"
            width={215}
            height={56}
            priority
            className="h-auto w-[215px] object-contain"
          />
        </div>

        {/* Menu button */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="ml-auto rounded-xl border border-white/10 bg-slate-700/50 p-2 text-white transition hover:bg-slate-700"
        >
          <Menu size={21} />
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() =>
            setIsOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-full flex-col
          border-r border-white/10 bg-slate-800 text-white shadow-2xl
          transition-transform duration-300

          md:top-0 md:h-screen md:w-64 md:translate-x-0

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Header */}
        <div className="border-b border-white/10 px-4 py-5">
          <div className="relative flex items-center justify-center">
            {/* Centered logo */}
            <Image
              src={DarkLogo}
              alt="SwiftShift logo"
              width={220}
              height={58}
              priority
              className="h-auto w-[220px] object-contain"
            />

            {/* Close button */}
            <button
              type="button"
              onClick={() =>
                setIsOpen(false)
              }
              className="absolute right-0 rounded-xl p-2 text-slate-400 transition hover:bg-slate-700 hover:text-white md:hidden"
            >
              <X size={23} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-8 md:items-start md:justify-start md:px-3 md:py-3">
          <div className="flex w-full max-w-sm flex-col gap-3 md:max-w-none md:gap-1">
            {sidebarSections[0].links.map(
              (link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() =>
                      setIsOpen(false)
                    }
                    className="
                      group flex items-center justify-center gap-3
                      rounded-xl px-3 py-3
                      text-base font-medium text-slate-300
                      transition hover:bg-slate-700 hover:text-white

                      md:justify-start md:py-2.5 md:text-sm
                    "
                  >
                    <Icon
                      size={19}
                      className="text-slate-400 transition group-hover:text-white"
                    />

                    <span>
                      {link.name}
                    </span>
                  </Link>
                );
              }
            )}
          </div>
        </nav>

        {/* Bottom user card */}
        <div className="relative border-t border-white/10 p-3">
          {/* Popup */}
          {isProfileOpen && (
            <div className="absolute bottom-20 left-3 right-3 rounded-2xl border border-white/10 bg-slate-700 p-2 shadow-2xl">
              <button
                type="button"
                onClick={() =>
                  signOut({
                    callbackUrl:
                      "/sign-in",
                  })
                }
                className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
              >
                Sign out
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              setIsProfileOpen(
                (prev) => !prev
              )
            }
            className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-slate-700/50 p-3 text-left transition hover:bg-slate-700"
          >
            {/* Avatar */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-600 ring-1 ring-white/10">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={
                    user?.name ||
                    "User profile photo"
                  }
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <User
                  size={21}
                  className="text-slate-300"
                />
              )}

              <span className="absolute bottom-0 right-0 z-10 h-3 w-3 rounded-full border-2 border-slate-800 bg-green-500" />
            </div>

            {/* User info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name ||
                  "User"}
              </p>

              <p className="truncate text-xs text-slate-400">
                {user?.role ||
                  user?.email ||
                  "Driver"}
              </p>
            </div>

            <ChevronRight
              size={16}
              className={`text-slate-500 transition duration-200 ${
                isProfileOpen
                  ? "rotate-90"
                  : ""
              }`}
            />
          </button>
        </div>
      </aside>
    </>
  );
}