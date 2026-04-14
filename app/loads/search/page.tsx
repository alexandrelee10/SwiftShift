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
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-zinc-950 text-white border-r border-zinc-800">
          <div className="p-6 border-b border-zinc-800">
            <h1 className="text-2xl font-bold tracking-tight">SwiftShift</h1>
            <p className="text-sm text-zinc-400 mt-1">Carrier Dashboard</p>
          </div>

          <nav className="py-4">
            {sidebarSections.map((section) => (
              <div key={section.title} className="mb-6">
                <p className="px-4 mb-2 text-xs font-semibold uppercase text-zinc-500">
                  {section.title}
                </p>

                <div className="space-y-1 px-3">
                  {section.links.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition group"
                      >
                        <Icon
                          size={18}
                          className="text-zinc-400 group-hover:text-white transition"
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

        <main className="flex-1">
          <div className="border-b border-zinc-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-zinc-900">Search</h2>
              <div className="text-sm text-zinc-500">
                Welcome, {session.user?.name}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
