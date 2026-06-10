"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import LightLogo from "@/public/assets/main-logo/logoLight.svg";

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navDropdowns = [
    {
      label: "Products",
      items: [
        { name: "Load Board", href: "/" },
        { name: "Authority Program", href: "/products/authority-program" },
        { name: "Product Reviews", href: "/products/product-review" },
        { name: "QuickPay", href: "/products/quickpay" },
      ],
    },
    {
      label: "About Us",
      items: [
        { name: "History", href: "/about-us/history" },
        { name: "Careers", href: "/about-us/careers" },
        { name: "Leadership", href: "/about-us/leadership" },
        { name: "Become a partner", href: "/about-us/become-a-partner" },
      ],
    },
    {
      label: "Resources",
      items: [
        { name: "Safety & Compliance", href: "/resources/safety" },
        { name: "FAQ", href: "/resources/faq" },
        { name: "Blog", href: "/resources/blog" },
        { name: "Help Center", href: "/resources/help-center" },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-999 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
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

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
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
            href="/contact"
            className="transition hover:text-blue-700"
          >
            Contact
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden text-sm font-semibold text-slate-700 lg:block"
          >
            Login
          </Link>

          <Link
            href="/sign-up"
            className="hidden rounded-full bg-blue-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800 lg:block"
          >
            Sign up
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-[9999] border-t border-slate-200 bg-white shadow-xl lg:hidden">
          <div className="max-h-[calc(100vh-88px)] overflow-y-auto px-6 py-6 pb-24">
            <div className="space-y-8">
              {navDropdowns.map((nav) => (
                <div key={nav.label}>
                  <h3 className="text-sm font-black uppercase tracking-wide text-slate-400">
                    {nav.label}
                  </h3>

                  <div className="mt-3 flex flex-col">
                    {nav.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-xl px-3 py-4 text-base font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-4 text-base font-semibold text-slate-700"
              >
                Contact
              </Link>

              <div className="flex flex-col gap-3 pt-4">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full border border-slate-200 px-5 py-3 text-center font-bold text-slate-700"
                >
                  Login
                </Link>

                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full bg-blue-700 px-5 py-3 text-center font-bold text-white"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}