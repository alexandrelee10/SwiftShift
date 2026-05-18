import {
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SendIcon,
} from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="bg-slate-950 px-6 py-24 text-white lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-500">
            Contact SwiftShift
          </p>

          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Let&apos;s move freight smarter.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
            Have questions about SwiftShift, partnerships, load board access, or
            support? Reach out and our team will get back to you.
          </p>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="px-6 py-20 lg:px-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT INFO */}
          <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl lg:p-10">
            <h2 className="text-3xl font-bold tracking-tight">
              Get in touch
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              Whether you&apos;re a driver, broker, or partner, we&apos;re here
              to help you get connected.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
                  <MailIcon size={22} className="text-blue-500" />
                </div>

                <div>
                  <p className="font-semibold">Email</p>
                  <p className="mt-1 text-sm text-slate-400">
                    support@swiftshift.com
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
                  <PhoneIcon size={22} className="text-blue-500" />
                </div>

                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="mt-1 text-sm text-slate-400">
                    (305) 555-0198
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
                  <MapPinIcon size={22} className="text-blue-500" />
                </div>

                <div>
                  <p className="font-semibold">Location</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Miami, Florida
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              Send us a message
            </h2>

            <form className="mt-8 space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    First name
                  </label>
                  <input
                    type="text"
                    placeholder="Alexandre"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Last name
                  </label>
                  <input
                    type="text"
                    placeholder="Lee"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  I&apos;m contacting about
                </label>
                <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">
                  <option>General question</option>
                  <option>Driver support</option>
                  <option>Broker support</option>
                  <option>Partnerships</option>
                  <option>Technical issue</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Message
                </label>
                <textarea
                  rows={6}
                  placeholder="Tell us how we can help..."
                  className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Send Message
                <SendIcon size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}