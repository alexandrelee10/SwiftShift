"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Search,
  Package,
  Map,
  Radio,
  MessageSquare,
  CreditCard,
  Settings,
} from "lucide-react";

const sidebarSections = [
  {
    title: "Main",
    links: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Search Loads", href: "/dashboard/loads/search", icon: Search },
    ],
  },
  {
    title: "Operations",
    links: [
      { name: "My Loads", href: "/loads", icon: Package },
      { name: "Tracking", href: "/tracking", icon: Map },
      { name: "Dispatch", href: "/dispatch", icon: Radio },
    ],
  },
  {
    title: "Account",
    links: [
      { name: "Messages", href: "/messages", icon: MessageSquare },
      { name: "Payments", href: "/payments", icon: CreditCard },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-900 text-white flex flex-col">
      {/* Logo / Title */}
      <div className="px-5 py-5 border-b border-white/10">
        <h2 className="text-lg font-bold tracking-wide">SwiftShift</h2>
      </div>

      {/* Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sidebarSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wide text-white/40">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition"
                >
                  <link.icon size={18} />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom section */}
      <div className="border-t border-white/10 p-4 text-xs text-white/50">
        © {new Date().getFullYear()} SwiftShift
      </div>
    </aside>
  );
}