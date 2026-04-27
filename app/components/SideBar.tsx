"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Home,
  TruckIcon,
  Search,
  Package,
  Map,
  Radio,
  MessageSquare,
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
      { name: "Saved", href: "/dashboard/loads/tracking", icon: Map },
      { name: "Documents", href: "/dashboard/documents", icon: FilesIcon },
      { name: "Dispatch", href: "/dispatch", icon: Radio },
      { name: "Messages", href: "/messages", icon: MessageSquare },
      { name: "Payments", href: "/payments", icon: Banknote },
      { name: "Fuel Card", href: "/dashboard/fuelcards", icon: CreditCardIcon },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

type SidebarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function Sidebar({ user }: { user?: SidebarUser }) {
  const [isOpen, setIsOpen] = useState(false);
 

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <h2 className="text-lg font-bold text-slate-950">SwiftShift</h2>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-lg border border-slate-200 p-2 text-slate-900"
        >
          <Menu size={21} />
        </button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
          bg-slate-900 text-white transition-transform duration-300
          md:sticky md:top-0 md:z-0 md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
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

        {/* Links */}
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

        {/* Bottom user card */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/10">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
              <User size={22} className="text-white/80" />

              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#071529] bg-green-500" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-white/45">Driver</p>
            </div>

            <ChevronRight size={16} className="text-white/35" />
          </div>
        </div>
      </aside>
    </>
  );
}