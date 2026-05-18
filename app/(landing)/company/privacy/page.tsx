import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-zinc-50">
      {/* HERO */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h1 className="text-5xl font-black tracking-tight text-zinc-900">
            Privacy Policy
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-500">
            This Privacy Policy explains how Swift Shift collects, uses, stores,
            and protects information when you use the platform and related
            services.
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-400">
            <span>Effective Date: May 18, 2026</span>
            <span>•</span>
            <span>Last Updated: May 18, 2026</span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="space-y-10 text-zinc-600">
            <div>
              <h2 className="text-2xl font-black text-zinc-900">
                1. Information We Collect
              </h2>

              <p className="mt-3 leading-7">
                Swift Shift may collect information such as your name, email
                address, phone number, company information, profile details,
                account activity, shipment information, and other data provided
                while using the platform.
              </p>

              <p className="mt-4 leading-7">
                We may also automatically collect technical information such as
                browser type, device information, IP address, usage activity,
                and platform interactions to improve performance and security.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black text-zinc-900">
                2. How We Use Information
              </h2>

              <p className="mt-3 leading-7">
                Swift Shift uses collected information to operate the platform,
                provide services, manage accounts, improve functionality,
                support load management, enhance security, and communicate with
                users.
              </p>

              <p className="mt-4 leading-7">
                Information may also be used for analytics, compliance,
                troubleshooting, fraud prevention, and improving the user
                experience.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black text-zinc-900">
                3. Account & Operational Data
              </h2>

              <p className="mt-3 leading-7">
                Information related to loads, bookings, shipments, operational
                activity, and account usage may be stored to help provide
                platform functionality and improve operational visibility.
              </p>

              <p className="mt-4 leading-7">
                Users are responsible for ensuring that information submitted to
                the platform is accurate and appropriate for business use.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black text-zinc-900">
                4. Sharing Information
              </h2>

              <p className="mt-3 leading-7">
                Swift Shift does not sell personal information. Information may
                be shared with trusted service providers, operational partners,
                compliance providers, or legal authorities when necessary to
                operate the platform, comply with the law, or protect platform
                security.
              </p>

              <p className="mt-4 leading-7">
                Certain information may also be visible to other authorized
                users depending on platform functionality and operational needs.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black text-zinc-900">
                5. Cookies & Tracking Technologies
              </h2>

              <p className="mt-3 leading-7">
                Swift Shift may use cookies and similar technologies to improve
                performance, remember user preferences, analyze traffic, and
                enhance the platform experience.
              </p>

              <p className="mt-4 leading-7">
                Users may manage browser cookie settings directly through their
                device or browser preferences.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black text-zinc-900">
                6. Data Security
              </h2>

              <p className="mt-3 leading-7">
                Swift Shift uses commercially reasonable safeguards designed to
                help protect user information and platform data from unauthorized
                access, misuse, or disclosure.
              </p>

              <p className="mt-4 leading-7">
                However, no digital platform or internet transmission can be
                guaranteed to be completely secure.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black text-zinc-900">
                7. Data Retention
              </h2>

              <p className="mt-3 leading-7">
                Information may be retained for operational, legal, compliance,
                security, and business purposes for as long as reasonably
                necessary.
              </p>

              <p className="mt-4 leading-7">
                Swift Shift may delete or anonymize information when it is no
                longer required for platform operations or legal obligations.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black text-zinc-900">
                8. User Responsibilities
              </h2>

              <p className="mt-3 leading-7">
                Users are responsible for maintaining the security of their
                account credentials and ensuring that submitted information does
                not violate applicable laws, regulations, or third-party rights.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black text-zinc-900">
                9. Third-Party Services
              </h2>

              <p className="mt-3 leading-7">
                Swift Shift may integrate with third-party tools, services, or
                providers. Swift Shift is not responsible for the privacy
                practices or content of third-party services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-black text-zinc-900">
                10. Policy Updates
              </h2>

              <p className="mt-3 leading-7">
                Swift Shift may update this Privacy Policy from time to time.
                Continued use of the platform after updates are posted means you
                accept the revised policy.
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-6">
              <h2 className="text-xl font-black text-zinc-900">
                Contact Information
              </h2>

              <p className="mt-3 leading-7">
                Questions regarding this Privacy Policy may be sent to:
              </p>

              <div className="mt-4 space-y-1 text-zinc-700">
                <p>support@swiftshift.com</p>
                <p>privacy@swiftshift.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}