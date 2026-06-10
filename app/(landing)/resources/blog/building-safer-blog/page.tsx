import {
  Calendar,
  Clock3,
  Eye,
  ShieldCheck,
  Truck,
  MapPinned,
  FileCheck,
} from "lucide-react";

export default function BlogArticlePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl">
          <span className="rounded-full bg-blue-600 px-4 py-2 text-xs font-black uppercase tracking-[0.2em]">
            Featured Article
          </span>

          <h1 className="mt-8 text-5xl font-black tracking-tight md:text-7xl">
            Building Safer Freight Operations With Better Visibility
          </h1>

          <p className="mt-8 text-xl leading-9 text-slate-300">
            How modern load boards can help drivers, brokers, and teams stay
            organized, informed, and compliant from pickup to delivery.
          </p>

          <div className="mt-10 flex flex-wrap gap-6 text-sm font-semibold text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              May 17, 2026
            </div>

            <div className="flex items-center gap-2">
              <Clock3 size={18} />
              6 min read
            </div>

            <div className="flex items-center gap-2">
              <Eye size={18} />
              Freight Operations
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE */}
      <article className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-[2rem] border border-slate-200 bg-blue-50 p-8">
          <h2 className="text-2xl font-black text-slate-950">
            Key Takeaways
          </h2>

          <ul className="mt-5 space-y-3 text-slate-600">
            <li>• Visibility reduces costly mistakes and missed updates.</li>
            <li>• Real-time tracking improves communication.</li>
            <li>• Digital documents simplify compliance.</li>
            <li>• Centralized load management improves safety.</li>
          </ul>
        </div>

        <div className="prose prose-lg mt-12 max-w-none">
          <p>
            Freight operations move quickly. Drivers are managing schedules,
            brokers are coordinating shipments, and operations teams are trying
            to keep everything organized. When information becomes scattered
            across phone calls, emails, text messages, and spreadsheets,
            mistakes become more likely.
          </p>

          <p>
            Visibility is one of the most important factors in building a safer
            and more efficient freight operation. The more accurately teams can
            see load status, documentation, and shipment progress, the easier it
            becomes to make informed decisions and avoid unnecessary risk.
          </p>

          <h2>Why visibility matters</h2>

          <p>
            Safety problems often begin with missing information. A broker may
            not know a shipment is delayed. A carrier may be waiting for
            paperwork. A dispatcher may not have updated location information.
            Small communication gaps can quickly create larger operational
            issues.
          </p>

          <p>
            Modern freight platforms help solve this problem by creating a
            single source of truth where load information can be viewed and
            updated in real time.
          </p>
        </div>

        {/* FEATURE CARDS */}

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 p-6">
            <MapPinned className="text-blue-600" size={30} />

            <h3 className="mt-4 text-xl font-black text-slate-950">
              Real-Time Tracking
            </h3>

            <p className="mt-3 leading-7 text-slate-500">
              Improve shipment visibility and keep stakeholders informed about
              location updates and delivery progress.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 p-6">
            <FileCheck className="text-blue-600" size={30} />

            <h3 className="mt-4 text-xl font-black text-slate-950">
              Digital Documentation
            </h3>

            <p className="mt-3 leading-7 text-slate-500">
              Centralize bills of lading, confirmations, and compliance
              documents to reduce paperwork issues.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 p-6">
            <ShieldCheck className="text-blue-600" size={30} />

            <h3 className="mt-4 text-xl font-black text-slate-950">
              Better Compliance
            </h3>

            <p className="mt-3 leading-7 text-slate-500">
              Maintain accurate records and improve operational accountability
              across your organization.
            </p>
          </div>
        </div>

        <div className="prose prose-lg mt-14 max-w-none">
          <h2>The role of modern load boards</h2>

          <p>
            Today's load boards are becoming much more than freight matching
            tools. Many platforms now include workflow management, status
            tracking, document storage, communication tools, and reporting
            capabilities.
          </p>

          <p>
            Instead of managing operations across several disconnected systems,
            carriers and brokers can keep everything organized in one place.
            This reduces confusion and improves response times when unexpected
            situations occur.
          </p>

          <h2>Looking ahead</h2>

          <p>
            As freight technology continues to evolve, visibility will become
            even more important. Teams that invest in better organization,
            communication, and transparency will be better positioned to reduce
            risk, improve customer service, and operate more efficiently.
          </p>

          <p>
            Safer freight operations do not happen by accident. They are built
            through better information, stronger processes, and technology that
            keeps everyone aligned from pickup to delivery.
          </p>
        </div>
      </article>

      {/* CTA */}

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-slate-950 p-10 text-white">
          <Truck size={40} className="text-blue-400" />

          <h2 className="mt-6 text-4xl font-black">
            Ready to streamline freight operations?
          </h2>

          <p className="mt-4 max-w-2xl text-slate-300">
            Explore how SwiftShift helps carriers, brokers, and operations
            teams stay organized with modern freight management tools.
          </p>

          <button className="mt-8 rounded-2xl bg-blue-600 px-6 py-3 font-black text-white transition hover:bg-blue-700">
            Learn More
          </button>
        </div>
      </section>
    </main>
  );
}