"use client";

import Image from "next/image";
import logo from "@/public/assets/main-logo/swiftshift_logo.svg";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const [isOpen, setOpen] = useState(false);

  const navElements = [
    { name: "Load Board", href: "/loadboard" },
    { name: "Tracking", href: "/tracking" },
    { name: "Solutions", href: "/solutions" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-black shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 py-3">

        {/* TOP ROW */}
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Image src={logo} alt="Logo" height={80} />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navElements.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-md hover:text-blue-500 transition-colors"
              >
                {n.name}
              </Link>
            ))}

            {/* Login Button */}
            <Link href="/sign-in">
              <button className="bg-white text-black px-5 py-2 rounded-lg font-medium hover:bg-zinc-200 transition">
                Sign In
              </button>
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="mt-4 flex flex-col gap-4 md:hidden">
            {navElements.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="hover:text-blue-500"
              >
                {n.name}
              </Link>
            ))}

            {/* 🔥 Mobile Login Button */}
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="bg-white text-black px-4 py-2 rounded-lg font-medium text-center"
            >
              Sign In
            </Link>
          </div>
        )}

      </div>
    </nav>
  );
};

export default NavBar;