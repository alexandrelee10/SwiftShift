import Image from "next/image";
import Link from "next/link";
import DarkLogo from "@/public/assets/main-logo/logoDark.svg";

export default function LandingFooter() {
  return (
    <footer className="bg-slate-950 px-6 py-16 text-slate-400">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/">
              <Image
                src={DarkLogo}
                alt="SwiftShift logo"
                width={215}
                height={56}
                priority
                className="h-auto w-[215px] object-contain"
              />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              Modern freight management for carriers, brokers, and dispatchers.
              Manage loads, tracking, documents, and revenue from one clean
              dashboard.
            </p>

            <p className="mt-6 text-sm font-semibold text-slate-500">
              Trusted by carriers and owner-operators nationwide.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-white">
              About Us
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm">
              <Link href="/about-us/history" className="transition hover:text-white">
                History
              </Link>
              <Link href="/about-us/careers" className="transition hover:text-white">
                Careers
              </Link>
              <Link href="/about-us/leadership" className="transition hover:text-white">
                Leadership
              </Link>
              <Link href="/about-us/become-a-partner" className="transition hover:text-white">
                Become a partner
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-white">
              Product
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm">
              <Link href="/" className="transition hover:text-white">
                Load Board
              </Link>
              <Link href="/products/authority-program" className="transition hover:text-white">
                Authority Program
              </Link>
              <Link href="/products/product-review" className="transition hover:text-white">
                Product Reviews
              </Link>
              <Link href="/products/quickpay" className="transition hover:text-white">
                QuickPay
              </Link>
            </div>
          </div>



          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-white">
              Resources
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm">
              <Link href="/resources/safety" className="transition hover:text-white">
                Safety & Compliance
              </Link>
              <Link href="/resources/faq" className="transition hover:text-white">
                FAQ
              </Link>
              <Link href="/resources/blog" className="transition hover:text-white">
                Blog
              </Link>
              <Link href="/resources/help-center" className="transition hover:text-white">
                Help Center
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 py-6 text-sm md:flex-row">
          <p className="text-slate-500">
            © 2026 SwiftShift. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/company/terms" className="transition hover:text-white">
              Terms
            </Link>
            <Link href="/company/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="/contact" className="transition hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}