import { requireUser } from "@/lib/requireUser";
import {
  LayoutDashboard,
  Search,
  Truck,
  Package,
  Map as MapIcon,
  Radio,
  MessageSquare,
  CreditCard,
  Settings as SettingsIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import SearchFilter from "@/app/components/SearchFilters";

type SidebarLink = {
  name: string;
  href: string;
  icon: LucideIcon;
};

type SidebarSection = {
  title: string;
  links: SidebarLink[];
};

export default async function SearchPage() {
  const session = await requireUser();

  const sidebarSections: SidebarSection[] = [
    {
      title: "Main",
      links: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Search Loads", href: "/loads/search", icon: Search },
        { name: "Search Trucks", href: "/trucks/search", icon: Truck },
      ],
    },
    {
      title: "Operations",
      links: [
        { name: "My Loads", href: "/loads/my-loads", icon: Package },
        { name: "My Trucks", href: "/trucks/my-trucks", icon: Truck },
        { name: "Dispatch", href: "/dispatch", icon: MapIcon },
        { name: "Tracking", href: "/tracking", icon: Radio },
      ],
    },
    {
      title: "Business",
      links: [
        { name: "Messages", href: "/messages", icon: MessageSquare },
        { name: "Payments", href: "/payments", icon: CreditCard },
        { name: "Settings", href: "/settings", icon: SettingsIcon },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-800 bg-zinc-950 text-white">
          <div className="border-b border-zinc-800 p-6">
            <h1 className="text-2xl font-bold tracking-tight">SwiftShift</h1>
            <p className="mt-1 text-sm text-zinc-400">Carrier Dashboard</p>
          </div>

          <nav className="py-4">
            {sidebarSections.map((section) => (
              <div key={section.title} className="mb-6">
                <p className="mb-2 px-4 text-xs font-semibold uppercase text-zinc-500">
                  {section.title}
                </p>

                <div className="space-y-1 px-3">
                  {section.links.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                      >
                        <Icon
                          size={18}
                          className="text-zinc-400 transition group-hover:text-white"
                        />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1">
          <div className="border-b border-zinc-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-zinc-900">Search Loads</h2>
              <p className="text-sm text-zinc-500">
                Welcome, {session.user?.name}
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <SearchFilter />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}