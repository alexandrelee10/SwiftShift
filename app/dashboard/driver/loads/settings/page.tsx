import { requireUser } from "@/lib/requireUser";
import prisma from "@/lib/prisma";
import {
  Bell,
  CircleHelp,
  Download,
  FileText,
  KeyRound,
  Lock,
  Mail,
  Moon,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Trash2,
} from "lucide-react";

import { updatePreferences, deleteAccount, saveSettings } from "./action";

import Link from "next/link";
import { SubmitButton } from "@/app/components/shared/SubmitButton";
import ProfilePhotoChanger from "@/app/components/driver/profile/ProfileImageUpload";
import { ThemeButton } from "@/app/components/driver/settings/SettingsTabs";
import { Switch } from "@/app/components/shared/Switch";

const tabs = [
  { label: "Account", value: "account" },
  { label: "Preferences", value: "preferences" },
  { label: "Notifications", value: "notifications" },
  { label: "Security", value: "security" },
  { label: "Integrations", value: "integrations" },
];

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; tab?: string }>;
}) {
  const params = await searchParams;
  const activeTab = params.tab || "account";

  const session = await requireUser();

  if (!session.user?.email) {
    throw new Error("Unauthorized");
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      userPreferences: true,
    },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  const preferences = await prisma.userPreference.findUnique({
    where: {
      userId: dbUser.id,
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900 dark:bg-[#0b1120] dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your account, preferences, notifications, and security.
          </p>
        </div>

        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-6 overflow-x-auto text-sm font-medium">
            {tabs.map((tab) => (
              <Link
                key={tab.value}
                href={`/dashboard/driver/loads/settings?tab=${tab.value}`}
                className={`whitespace-nowrap border-b-2 pb-3 transition ${
                  activeTab === tab.value
                    ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <section className="space-y-6">
            {params.success === "1" && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-300">
                Settings saved successfully.
              </div>
            )}

            {activeTab === "account" && (
              <Card>
                <SectionHeader
                  title="Profile Information"
                  desc="Update your personal information and how it appears on your account."
                />

                <form action={saveSettings}>
                  <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
                    <ProfilePhotoChanger
                      image={dbUser.image}
                      firstName={dbUser.firstName}
                      lastName={dbUser.lastName}
                      role={dbUser.role}
                    />
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <Input
                      name="firstName"
                      label="First Name"
                      defaultValue={dbUser.firstName}
                    />
                    <Input
                      name="lastName"
                      label="Last Name"
                      defaultValue={dbUser.lastName}
                    />
                    <Input
                      name="email"
                      label="Email"
                      defaultValue={dbUser.email}
                    />
                    <Input
                      name="phoneNum"
                      label="Phone Number"
                      defaultValue={dbUser.phoneNum || ""}
                    />
                  </div>

                  <div className="mt-6 flex justify-end">
                    <SubmitButton />
                  </div>
                </form>
              </Card>
            )}

            {activeTab === "preferences" && (
              <Card>
                <SectionHeader
                  title="Driver Preferences"
                  desc="Control how SwiftShift recommends loads and displays your account."
                />

                <form action={updatePreferences} className="mt-6 space-y-4">
                  <SelectRow
                    label="Home Base"
                    desc="Used for nearby load recommendations."
                    name="homeBase"
                    defaultValue="Miami, FL"
                    options={[
                      "Miami, FL",
                      "Orlando, FL",
                      "Tampa, FL",
                      "Atlanta, GA",
                      "Charlotte, NC",
                    ]}
                  />

                  <SelectRow
                    label="Preferred Equipment"
                    desc="Your default equipment type for load searches."
                    name="preferredEquipment"
                    defaultValue="Dry Van"
                    options={[
                      "Dry Van",
                      "Reefer",
                      "Flatbed",
                      "Power Only",
                      "Box Truck",
                    ]}
                  />

                  <SelectRow
                    label="Max Deadhead Miles"
                    desc="How far you are willing to drive empty."
                    name="maxDeadheadMiles"
                    defaultValue="100 miles"
                    options={[
                      "50 miles",
                      "100 miles",
                      "150 miles",
                      "200 miles",
                      "Any distance",
                    ]}
                  />

                  <SelectRow
                    label="Minimum Rate Per Mile"
                    desc="Hide loads below your preferred rate."
                    name="minimumRatePerMile"
                    defaultValue="$2.25"
                    options={["$1.75", "$2.00", "$2.25", "$2.50", "$3.00+"]}
                  />

                  <SelectRow
                    label="Default Load Sort"
                    desc="Choose how loads are sorted by default."
                    name="defaultLoadSort"
                    defaultValue="Highest Rate"
                    options={[
                      "Highest Rate",
                      "Closest Pickup",
                      "Soonest Pickup",
                      "Best Rate Per Mile",
                    ]}
                  />

                  <SelectRow
                    label="Time Zone"
                    desc="Set your local time zone."
                    name="timeZone"
                    defaultValue={preferences?.timeZone || "Eastern Time"}
                    options={[
                      "Eastern Time",
                      "Central Time",
                      "Mountain Time",
                      "Pacific Time",
                    ]}
                  />

                  <SelectRow
                    label="Date Format"
                    desc="Choose your preferred date format."
                    name="dateFormat"
                    defaultValue={preferences?.dateFormat || "MM/DD/YYYY"}
                    options={["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]}
                  />

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Save Preferences
                    </button>
                  </div>
                </form>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <SectionHeader
                  title="Notification Preferences"
                  desc="Choose how you want to be notified."
                />

                <div className="mt-6 space-y-4">
                  <ToggleActionRow
                    icon={<Bell size={18} />}
                    title="Load Updates"
                    desc="Get notified about load status changes."
                    active
                  />
                  <ToggleActionRow
                    icon={<Mail size={18} />}
                    title="Payment Notifications"
                    desc="Receive updates about payments and earnings."
                    active
                  />
                  <ToggleActionRow
                    icon={<FileText size={18} />}
                    title="Document Alerts"
                    desc="Get notified about important documents."
                    active
                  />
                  <ToggleActionRow
                    icon={<Mail size={18} />}
                    title="Marketing Emails"
                    desc="Receive news and offers."
                  />
                </div>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <SectionHeader
                  title="Security"
                  desc="Manage your password and account security."
                />

                <div className="mt-6 space-y-4">
                  <ActionRow
                    icon={<KeyRound size={18} />}
                    title="Password"
                    desc="Update your password regularly."
                    action="Change Password"
                    href="/dashboard/loads/settings/changePassword"
                  />

                  <ToggleActionRow
                    icon={<ShieldCheck size={18} />}
                    title="Two-Factor Authentication"
                    desc="Add an extra layer of security to your account."
                    active
                  />

                  <ActionRow
                    icon={<Lock size={18} />}
                    title="Active Sessions"
                    desc="Manage devices currently signed into your account."
                    action="Manage Sessions"
                  />
                </div>
              </Card>
            )}

            {activeTab === "integrations" && (
              <Card>
                <SectionHeader
                  title="Integrations"
                  desc="Connect SwiftShift with tools you already use."
                />

                <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                  <Integration label="ELD Provider" status="Connected" />
                  <Integration label="Google Calendar" status="Connect" />
                  <Integration label="IFTA Reporting" status="Connect" />
                  <Integration label="Dropbox" status="Connect" />
                </div>
              </Card>
            )}
          </section>

          <aside className="space-y-6">
            <Card>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Account Summary
              </h2>

              <div className="mt-5 space-y-4">
                <SummaryRow label="Account Type" value={dbUser.role} />
                <SummaryRow
                  label="Member Since"
                  value={formatDate(dbUser.createdAt)}
                />
                <SummaryRow label="Account Status" value="Active" badge />
                <SummaryRow label="Verification" value="Verified" badge />
              </div>
            </Card>

            <Card>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Quick Actions
              </h2>

              <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                <QuickAction
                  icon={<Download size={17} />}
                  label="Download My Data"
                  href="/api/user/export"
                />
                <QuickAction
                  icon={<Trash2 size={17} />}
                  label="Delete Account"
                  danger
                  action={deleteAccount}
                />
                <QuickAction
                  icon={<CircleHelp size={17} />}
                  label="Help Center"
                  href="/help"
                />
                <QuickAction
                  icon={<Mail size={17} />}
                  label="Contact Support"
                  href="mailto:support@swiftshift.com"
                />
              </div>
            </Card>

            <Card>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Appearance
              </h2>

              <div className="mt-5">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Theme
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Choose your preferred theme.
                </p>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <ThemeButton
                    icon={<Sun size={20} />}
                    label="Light"
                    theme="light"
                  />

                  <ThemeButton
                    icon={<Moon size={20} />}
                    label="Dark"
                    theme="dark"
                  />

                  <ThemeButton
                    icon={<SlidersHorizontal size={20} />}
                    label="System"
                    theme="system"
                  />
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {children}
    </div>
  );
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{desc}</p>
    </div>
  );
}

function Input({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <label>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
      />
    </label>
  );
}

function ActionRow({
  icon,
  title,
  desc,
  action,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  action: string;
  href?: string;
}) {
  const buttonClasses =
    "w-fit rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800";

  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 last:border-0 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
      <div className="flex gap-3">
        <div className="mt-1 text-slate-400 dark:text-slate-500">{icon}</div>
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {title}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
        </div>
      </div>

      {href ? (
        <Link href={href} className={buttonClasses}>
          {action}
        </Link>
      ) : (
        <button type="button" className={buttonClasses}>
          {action}
        </button>
      )}
    </div>
  );
}

function ToggleActionRow({
  icon,
  title,
  desc,
  active,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-0 dark:border-slate-800">
      <div className="flex gap-3">
        <div className="mt-1 text-slate-400 dark:text-slate-500">{icon}</div>
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {title}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
        </div>
      </div>

      <Switch defaultActive={active} />
    </div>
  );
}

function SummaryRow({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>

      {badge ? (
        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950/50 dark:text-green-300">
          {value}
        </span>
      ) : (
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {value}
        </p>
      )}
    </div>
  );
}

function QuickAction({
  icon,
  label,
  danger,
  action,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  action?: () => Promise<void>;
  href?: string;
}) {
  const content = (
    <div
      className={`flex w-full items-center justify-between py-4 transition ${
        danger
          ? "text-red-600 dark:text-red-400"
          : "text-slate-700 dark:text-slate-200"
      }`}
    >
      <div className="flex items-center gap-3 text-sm font-medium">
        {icon}
        {label}
      </div>
    </div>
  );

  if (href)
    return (
      <a href={href} className="block">
        {content}
      </a>
    );

  if (action) {
    return (
      <form action={action}>
        <button type="submit" className="w-full text-left">
          {content}
        </button>
      </form>
    );
  }

  return <div>{content}</div>;
}

function Integration({ label, status }: { label: string; status: string }) {
  const connected = status === "Connected";

  return (
    <button className="flex w-full items-center justify-between py-4 text-left">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </p>

      <span
        className={`text-xs font-medium ${
          connected
            ? "text-green-600 dark:text-green-400"
            : "text-blue-600 dark:text-blue-400"
        }`}
      >
        {status}
      </span>
    </button>
  );
}

function SelectRow({
  label,
  desc,
  name,
  defaultValue,
  options,
}: {
  label: string;
  desc: string;
  name: string;
  defaultValue: string;
  options: string[];
}) {
  return (
    <div className="grid gap-3 border-b border-slate-100 pb-4 last:border-0 md:grid-cols-[1fr_260px] md:items-center dark:border-slate-800">
      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {label}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
      </div>

      <select
        name={name}
        defaultValue={defaultValue}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}