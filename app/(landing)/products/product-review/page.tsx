import Image from "next/image";
import TruckImage from "@/public/assets/landingPage/product-review/semi-truck.png";

export default function ProductReviewPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-20 text-white">
        {/* Background truck image */}
        <div className="absolute inset-0">
          <Image
            src={TruckImage}
            alt="SwiftShift truck"
            priority
            fill
            className="object-contain object-right"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-blue-400">
            Product Reviews
          </p>

          <div className="mt-6 max-w-4xl">
            <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Trusted by carriers,
              <br />
              brokers, and dispatchers
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-200">
              Real reviews from real users. See how SwiftShift helps trucking
              professionals save time, book more loads, and grow their
              businesses.
            </p>
          </div>

          {/* Stats card */}
          <div className="mt-12 grid gap-8 rounded-[2rem] border border-blue-500/40 bg-slate-950/70 p-8 shadow-2xl backdrop-blur md:grid-cols-4">
            <div className="border-white/10 md:border-r">
              <p className="text-5xl font-black text-white">4.8</p>
              <p className="mt-3 text-xl text-yellow-400">★★★★★</p>
              <p className="mt-2 text-sm text-slate-300">Out of 5</p>
            </div>

            <div className="border-white/10 md:border-r">
              <p className="text-5xl font-black text-white">2,450+</p>
              <p className="mt-3 text-sm text-slate-300">Verified Reviews</p>
            </div>

            <div className="space-y-3 border-white/10 md:border-r">
              {[
                ["5", "84%", "w-[84%]"],
                ["4", "12%", "w-[32%]"],
                ["3", "3%", "w-[12%]"],
                ["2", "1%", "w-[6%]"],
                ["1", "0%", "w-[2%]"],
              ].map(([stars, percent, width]) => (
                <div key={stars} className="flex items-center gap-3 text-sm">
                  <span className="w-5 text-slate-300">{stars}</span>
                  <span className="text-yellow-400">★</span>

                  <div className="h-2 flex-1 rounded-full bg-white/10">
                    <div className={`${width} h-2 rounded-full bg-blue-500`} />
                  </div>

                  <span className="w-10 text-right text-slate-300">
                    {percent}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-blue-500/40 text-blue-400">
                ✓
              </div>

              <p className="mt-4 max-w-40 text-sm leading-6 text-slate-300">
                All reviews are verified and from real users
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-black uppercase tracking-[0.3em] text-blue-600">
              Real Feedback
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-zinc-900 md:text-6xl">
              What users are saying
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
              Thousands of trucking professionals rely on SwiftShift to manage
              loads, tracking, documents, and operations.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "John D.",
                role: "Owner Operator",
                review:
                  "Best load board I’ve used. The interface is clean and finding profitable freight is way faster.",
              },
              {
                name: "Sarah R.",
                role: "Broker",
                review:
                  "Tracking and dispatch tools have made our workflow much smoother and easier to manage.",
              },
              {
                name: "Mike K.",
                role: "Dispatcher",
                review:
                  "The dashboard keeps everything organized in one place. My drivers love it.",
              },
            ].map((review) => (
              <div
                key={review.name}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <p className="text-yellow-500">★★★★★</p>

                <h3 className="mt-5 text-2xl font-black text-zinc-900">
                  {review.name}
                </h3>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {review.role}
                </p>

                <p className="mt-6 leading-8 text-slate-600">{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
