import { Scale, ShieldCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-50">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.08),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-6 flex items-center gap-3">
            </div>

            <h1 className="text-5xl font-black tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
              Terms of
              <span className="text-blue-600"> Service</span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-500 sm:text-xl">
              These Terms of Service govern access to and use of the Swift Shift
              platform, including all related services, applications, features,
              and technologies provided by Swift Shift.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-zinc-400">
              <span>Effective Date: May 18, 2026</span>
              <span>•</span>
              <span>Last Updated: May 18, 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
        <div className="rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
          {/* HEADER */}
          <div className="border-b border-zinc-200 px-8 py-8 sm:px-12">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <ShieldCheck size={28} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-zinc-900">
                  Swift Shift Terms & Conditions
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Please read these terms carefully before using the platform.
                </p>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="space-y-14 px-8 py-10 sm:px-12 sm:py-12">
            <section>
              <h3 className="text-2xl font-black text-zinc-900">
                1. Acceptance of Terms
              </h3>

              <div className="mt-5 space-y-5 text-[15px] leading-8 text-zinc-600">
                <p>
                  By accessing, browsing, registering for, or otherwise using
                  the Swift Shift platform (“Platform”), you acknowledge that
                  you have read, understood, and agreed to be bound by these
                  Terms of Service (“Terms”).
                </p>

                <p>
                  These Terms apply to all users of the Platform, including but
                  not limited to drivers, carriers, brokers, dispatchers,
                  administrators, contractors, visitors, and business partners.
                </p>

                <p>
                  If you do not agree to these Terms, you may not access or use
                  the Platform.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-black text-zinc-900">
                2. Platform Services
              </h3>

              <div className="mt-5 space-y-5 text-[15px] leading-8 text-zinc-600">
                <p>
                  Swift Shift provides digital freight and logistics-related
                  tools intended to facilitate communication, visibility, load
                  management, operational coordination, and business efficiency.
                </p>

                <p>
                  Features may include load posting, load searching, booking
                  tools, shipment visibility, account management, operational
                  analytics, compliance resources, notifications, and related
                  logistics technology services.
                </p>

                <p>
                  Swift Shift reserves the right to modify, suspend, restrict,
                  or discontinue any feature or service at any time without
                  prior notice.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-black text-zinc-900">
                3. User Eligibility & Accounts
              </h3>

              <div className="mt-5 space-y-5 text-[15px] leading-8 text-zinc-600">
                <p>
                  Users must provide accurate, complete, and current
                  registration information when creating an account.
                </p>

                <p>
                  You are solely responsible for maintaining the confidentiality
                  of your account credentials and for all activity that occurs
                  under your account.
                </p>

                <p>
                  Swift Shift reserves the right to suspend, restrict, or
                  terminate accounts that contain inaccurate information, violate
                  these Terms, create operational risk, or engage in suspicious
                  activity.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-black text-zinc-900">
                4. Compliance Responsibilities
              </h3>

              <div className="mt-5 space-y-5 text-[15px] leading-8 text-zinc-600">
                <p>
                  Users are responsible for complying with all applicable local,
                  state, federal, and international laws and regulations related
                  to transportation, freight operations, labor requirements,
                  insurance obligations, and commercial activities.
                </p>

                <p>
                  Drivers, carriers, and transportation providers are solely
                  responsible for maintaining proper operating authority,
                  licensing, registrations, permits, insurance coverage,
                  equipment standards, and driver qualification compliance.
                </p>

                <p>
                  Swift Shift does not guarantee regulatory compliance on behalf
                  of any user and assumes no responsibility for violations
                  resulting from user conduct or operational decisions.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-black text-zinc-900">
                5. Freight & Load Information
              </h3>

              <div className="mt-5 space-y-5 text-[15px] leading-8 text-zinc-600">
                <p>
                  Load details displayed through the Platform may be provided by
                  third parties, brokers, carriers, or other users.
                </p>

                <p>
                  While Swift Shift may provide organizational and operational
                  tools, users are responsible for independently verifying load
                  details, shipment requirements, pickup information, delivery
                  information, rates, distances, commodity details, and safety
                  considerations before accepting or transporting freight.
                </p>

                <p>
                  Swift Shift makes no guarantees regarding the accuracy,
                  completeness, availability, legality, or reliability of
                  third-party load information.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-black text-zinc-900">
                6. Prohibited Conduct
              </h3>

              <div className="mt-5 space-y-5 text-[15px] leading-8 text-zinc-600">
                <p>Users may not:</p>

                <ul className="space-y-3 pl-6">
                  <li className="list-disc">
                    Submit false, misleading, or fraudulent information.
                  </li>

                  <li className="list-disc">
                    Use the Platform for unlawful or unauthorized purposes.
                  </li>

                  <li className="list-disc">
                    Attempt to disrupt, damage, reverse engineer, or interfere
                    with the Platform or its systems.
                  </li>

                  <li className="list-disc">
                    Circumvent platform protections, access controls, or account
                    restrictions.
                  </li>

                  <li className="list-disc">
                    Engage in unsafe, abusive, discriminatory, or threatening
                    behavior toward other users.
                  </li>

                  <li className="list-disc">
                    Violate transportation safety regulations or industry
                    compliance requirements.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-black text-zinc-900">
                7. Intellectual Property
              </h3>

              <div className="mt-5 space-y-5 text-[15px] leading-8 text-zinc-600">
                <p>
                  All Platform content, branding, logos, software, interfaces,
                  designs, graphics, systems, and technologies are owned by or
                  licensed to Swift Shift and are protected under applicable
                  intellectual property laws.
                </p>

                <p>
                  Users may not reproduce, distribute, modify, copy, or exploit
                  any portion of the Platform without prior written permission
                  from Swift Shift.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-black text-zinc-900">
                8. Privacy & Data Usage
              </h3>

              <div className="mt-5 space-y-5 text-[15px] leading-8 text-zinc-600">
                <p>
                  By using the Platform, users acknowledge that certain account,
                  operational, device, and usage information may be collected,
                  processed, and stored for purposes including security,
                  analytics, support, fraud prevention, compliance monitoring,
                  and service improvement.
                </p>

                <p>
                  Swift Shift takes commercially reasonable measures to help
                  protect user information; however, no digital platform can
                  guarantee complete security.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-black text-zinc-900">
                9. Disclaimer of Warranties
              </h3>

              <div className="mt-5 space-y-5 text-[15px] leading-8 text-zinc-600">
                <p>
                  The Platform is provided on an “as is” and “as available”
                  basis without warranties of any kind, whether express or
                  implied.
                </p>

                <p>
                  Swift Shift does not guarantee uninterrupted availability,
                  error-free performance, load availability, shipment outcomes,
                  regulatory compliance, profitability, or operational results.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-black text-zinc-900">
                10. Limitation of Liability
              </h3>

              <div className="mt-5 space-y-5 text-[15px] leading-8 text-zinc-600">
                <p>
                  To the fullest extent permitted by law, Swift Shift shall not
                  be liable for any indirect, incidental, special,
                  consequential, punitive, or business-related damages arising
                  from or related to use of the Platform.
                </p>

                <p>
                  This includes, without limitation, damages related to freight
                  delays, missed deliveries, operational interruptions, lost
                  revenue, account access issues, compliance violations,
                  inaccurate information, or third-party conduct.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-black text-zinc-900">
                11. Termination
              </h3>

              <div className="mt-5 space-y-5 text-[15px] leading-8 text-zinc-600">
                <p>
                  Swift Shift reserves the right to suspend, restrict, or
                  terminate access to the Platform at its discretion, including
                  where user conduct creates legal, operational, compliance, or
                  security concerns.
                </p>

                <p>
                  Termination does not eliminate any obligations, liabilities,
                  or responsibilities that arose prior to termination.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-black text-zinc-900">
                12. Changes to Terms
              </h3>

              <div className="mt-5 space-y-5 text-[15px] leading-8 text-zinc-600">
                <p>
                  Swift Shift may revise or update these Terms from time to
                  time. Updated Terms become effective immediately upon posting
                  unless otherwise stated.
                </p>

                <p>
                  Continued use of the Platform after changes are posted
                  constitutes acceptance of the updated Terms.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-black text-zinc-900">
                13. Contact Information
              </h3>

              <div className="mt-5 space-y-5 text-[15px] leading-8 text-zinc-600">
                <p>
                  Questions regarding these Terms may be directed to the Swift
                  Shift support or compliance team.
                </p>

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                  <p className="font-semibold text-zinc-900">
                    Swift Shift Legal Department
                  </p>

                  <p className="mt-2">support@swiftshift.com</p>

                  <p>compliance@swiftshift.com</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}