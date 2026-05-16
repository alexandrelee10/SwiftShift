import Image from "next/image";
import Link from "next/link";
import LightLogo from "@/public/assets/main-logo/logoLight.svg";
import { ChevronDown } from "lucide-react";

export default function LandingNavbar() {
  const navDropdowns = [
    {
      label: "Products",
      items: [
        { name: "Load Board", href: "/products/load-board" },
        { name: "Authority Program", href: "/products/authority-program" },
        { name: "Tracking", href: "/products/tracking" },
        { name: "Documents", href: "/products/documents" },
      ],
    },
    {
      label: "Solutions",
      items: [
        { name: "For Carriers", href: "/solutions/carriers" },
        { name: "For Brokers", href: "/solutions/brokers" },
        { name: "For Dispatchers", href: "/solutions/dispatchers" },
        { name: "Owner Operators", href: "/solutions/owner-operators" },
      ],
    },
    {
      label: "Resources",
      items: [
        { name: "Safety & Compliance", href: "/resources/safety-compliance" },
        { name: "Broker Verification", href: "/resources/broker-verification" },
        { name: "Rate Guide", href: "/resources/rate-guide" },
        { name: "Help Center", href: "/resources/help-center" },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/">
          <Image
            src={LightLogo}
            alt="SwiftShift logo"
            width={215}
            height={56}
            priority
            className="h-auto w-[215px] object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 md:flex">
          {navDropdowns.map((nav) => (
            <div key={nav.label} className="group relative">
              <button
                type="button"
                className="flex items-center gap-1 transition hover:text-blue-700"
              >
                {nav.label}
                <ChevronDown
                  size={15}
                  className="transition group-hover:rotate-180"
                />
              </button>

              <div className="invisible absolute left-0 top-full z-50 mt-4 w-60 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                {nav.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-blue-700"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <Link
            href="/company/contact"
            className="transition hover:text-blue-700"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden text-sm font-semibold text-slate-700 md:block"
          >
            Login
          </Link>

          <Link
            href="/sign-up"
            className="rounded-full bg-blue-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}