"use client";

import Image from "next/image";
import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

import {
  Home,
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
      {
        name: "Dashboard",
        href: "/dashboard/driver",
        icon: Home,
      },
      {
        name: "Loads",
        href: "/dashboard/driver/loads/myloads",
        icon: Package,
        items: [
          {
            name: "Search Loads",
            href: "/dashboard/driver/loads/search",
          },
          {
            name: "My Loads",
            href: "/dashboard/driver/loads/myloads",
          },
          {
            name: "Requested Loads",
            href: "/dashboard/driver/loads/requestedLoads",
          },
          {
            name: "Approved Loads",
            href: "/dashboard/driver/loads/approvedLoads",
          },
        ],
      },
      {
        name: "Documents",
        href: "/dashboard/driver/loads/documents",
        icon: FilesIcon,
      },
      {
        name: "Earnings",
        href: "/dashboard/driver/loads/earnings",
        icon: Banknote,
      },
      {
        name: "Fuel Card",
        href: "/dashboard/driver/loads/fuelcards",
        icon: CreditCardIcon,
      },
      {
        name: "Settings",
        href: "/dashboard/driver/loads/settings",
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
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="sticky top-0 z-40 flex h-[70px] items-center border-b border-white/10 bg-slate-800 px-4 md:hidden">
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

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="ml-auto rounded-xl border border-white/10 bg-slate-700/50 p-2 text-white transition hover:bg-slate-700"
        >
          <Menu size={21} />
        </button>
      </div>

      {/* OVERLAY */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-full flex-col border-r border-white/10 bg-slate-800 text-white shadow-2xl transition-transform duration-300 md:w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* LOGO */}
        <div className="border-b border-white/10 px-4 py-5">
          <div className="relative flex items-center justify-center">
            <Image
              src={DarkLogo}
              alt="SwiftShift logo"
              width={220}
              height={58}
              priority
              className="h-auto w-[220px] object-contain"
            />

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-0 rounded-xl p-2 text-slate-400 transition hover:bg-slate-700 hover:text-white md:hidden"
            >
              <X size={23} />
            </button>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex flex-1 items-start justify-start overflow-y-auto px-4 py-6 md:px-3 md:py-3">
          <div className="flex w-full flex-col gap-1">
            {sidebarSections[0].links.map((link) => {
              const Icon = link.icon;
              const hasItems = "items" in link && link.items;

              return (
                <div key={link.name}>
                  {hasItems ? (
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown((prev) =>
                          prev === link.name ? null : link.name
                        )
                      }
                      className="
                        group
                        flex
                        w-full
                        items-center
                        justify-start
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        text-left
                        text-base
                        font-medium
                        text-slate-300
                        transition
                        hover:bg-slate-700
                        hover:text-white
                        md:text-sm
                      "
                    >
                      <Icon
                        size={19}
                        className="text-slate-400 group-hover:text-white"
                      />

                      <span className="flex-1 text-left">
                        {link.name}
                      </span>

                      <ChevronRight
                        size={16}
                        className={`transition ${
                          openDropdown === link.name
                            ? "rotate-90"
                            : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="
                        group
                        flex
                        items-center
                        justify-start
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        text-left
                        text-base
                        font-medium
                        text-slate-300
                        transition
                        hover:bg-slate-700
                        hover:text-white
                        md:text-sm
                      "
                    >
                      <Icon
                        size={19}
                        className="text-slate-400 group-hover:text-white"
                      />

                      <span>{link.name}</span>
                    </Link>
                  )}

                  {hasItems && openDropdown === link.name && (
                    <div className="mt-1 space-y-1 pl-10">
                      {link.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-700 hover:text-white"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* PROFILE */}
        <div className="relative border-t border-white/10 p-3">
          {isProfileOpen && (
            <div className="absolute bottom-20 left-3 right-3 rounded-2xl border border-white/10 bg-slate-700 p-2">
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full rounded-xl px-3 py-2 text-left text-red-300 hover:bg-red-500/10"
              >
                Sign out
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsProfileOpen((p) => !p)}
            className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-slate-700/50 p-3"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-600">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <User size={20} />
              )}
            </div>

            <div className="flex-1 text-left">
              <p className="truncate text-sm font-semibold">
                {user?.name || "User"}
              </p>

              <p className="truncate text-xs text-slate-400">
                {user?.role || user?.email}
              </p>
            </div>

            <ChevronRight
              size={16}
              className={isProfileOpen ? "rotate-90" : ""}
            />
          </button>
        </div>
      </aside>
    </>
  );
}