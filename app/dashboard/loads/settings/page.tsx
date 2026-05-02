import { requireUser } from "@/lib/requireUser";
import prisma from "@/lib/prisma";
import {
    Bell,
    CalendarDays,
    ChevronRight,
    CircleHelp,
    Database,
    Download,
    FileText,
    Globe,
    KeyRound,
    Lock,
    Mail,
    Moon,
    ShieldCheck,
    SlidersHorizontal,
    Sun,
    Trash2,
    User,
} from "lucide-react";

import { updatePreferences, downloadUserData, deleteAccount } from "./action";

export default async function SettingsPage() {
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
            userId: dbUser.id
        }
    })

    return (
        <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* HEADER */}
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage your account, preferences, notifications, and security.
                    </p>
                </div>

                {/* TABS */}
                <div className="border-b border-slate-200">
                    <div className="flex gap-6 overflow-x-auto text-sm font-medium">
                        {["Account", "Preferences", "Notifications", "Security", "Integrations"].map(
                            (tab, index) => (
                                <button
                                    key={tab}
                                    className={`whitespace-nowrap border-b-2 pb-3 ${index === 0
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-slate-500 hover:text-slate-900"
                                        }`}
                                >
                                    {tab}
                                </button>
                            )
                        )}
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
                    {/* LEFT */}
                    <section className="space-y-6">
                        {/* PROFILE */}
                        <Card>
                            <SectionHeader
                                title="Profile Information"
                                desc="Update your personal information and how it appears on your account."
                            />

                            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-2xl font-semibold text-white">
                                    {dbUser.firstName?.[0]}
                                    {dbUser.lastName?.[0]}
                                </div>

                                <div>
                                    <p className="font-semibold">
                                        {dbUser.firstName} {dbUser.lastName}
                                    </p>
                                    <p className="text-sm text-slate-500">{dbUser.role}</p>
                                    <button className="mt-3 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                        Change Photo
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                <Input label="First Name" defaultValue={dbUser.firstName} />
                                <Input label="Last Name" defaultValue={dbUser.lastName} />
                                <Input label="Email" defaultValue={dbUser.email} />
                                <Input label="Phone Number" defaultValue={dbUser.phoneNum} />
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                    Save Changes
                                </button>
                            </div>
                        </Card>

                        {/* PREFERENCES */}
                        <Card>
                            <SectionHeader
                                title="Account Preferences"
                                desc="Manage your default account preferences."
                            />

                            <form action={updatePreferences} className="mt-6 space-y-4">
                                <SelectRow
                                    label="Language"
                                    desc="Choose your preferred language."
                                    name="language"
                                    defaultValue={preferences?.language|| "English (US)"}
                                    options={["English (US)", "Spanish", "French"]}
                                />

                                <SelectRow
                                    label="Time Zone"
                                    desc="Set your local time zone."
                                    name="timeZone"
                                    defaultValue={preferences?.timeZone || "Eastern Time"}
                                    options={["Eastern Time", "Central Time", "Mountain Time", "Pacific Time"]}
                                />

                                <SelectRow
                                    label="Date Format"
                                    desc="Choose your preferred date format."
                                    name="dateFormat"
                                    defaultValue={preferences?.dateFormat || "MM/DD/YYYY"}
                                    options={["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]}
                                />

                                <SelectRow
                                    label="Currency"
                                    desc="Select your preferred currency."
                                    name="currency"
                                    defaultValue={preferences?.currency || "USD"}
                                    options={["USD", "CAD", "EUR"]}
                                />

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        Save Preferences
                                    </button>
                                </div>
                            </form>
                        </Card>

                        {/* SECURITY */}
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

                        {/* NOTIFICATIONS */}
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
                    </section>

                    {/* RIGHT */}
                    <aside className="space-y-6">
                        <Card>
                            <h2 className="text-sm font-semibold">Account Summary</h2>

                            <div className="mt-5 space-y-4">
                                <SummaryRow label="Account Type" value={dbUser.role} />
                                <SummaryRow label="Member Since" value={formatDate(dbUser.createdAt)} />
                                <SummaryRow label="Account Status" value="Active" badge />
                                <SummaryRow label="Verification" value="Verified" badge />
                            </div>
                        </Card>

<Card>
  <h2 className="text-sm font-semibold">Quick Actions</h2>

  <div className="mt-4 divide-y divide-slate-100">
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
                            <h2 className="text-sm font-semibold">Appearance</h2>

                            <div className="mt-5">
                                <p className="text-sm font-medium text-slate-700">Theme</p>
                                <p className="text-sm text-slate-500">
                                    Choose your preferred theme.
                                </p>

                                <div className="mt-4 grid grid-cols-3 gap-3">
                                    <ThemeOption icon={<Sun size={20} />} label="Light" active />
                                    <ThemeOption icon={<Moon size={20} />} label="Dark" />
                                    <ThemeOption icon={<SlidersHorizontal size={20} />} label="System" />
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <h2 className="text-sm font-semibold">Integrations</h2>

                            <div className="mt-4 divide-y divide-slate-100">
                                <Integration label="ELD Provider" status="Connected" />
                                <Integration label="Google Calendar" status="Connect" />
                                <Integration label="IFTA Reporting" status="Connect" />
                                <Integration label="Dropbox" status="Connect" />
                            </div>
                        </Card>
                    </aside>
                </div>
            </div>
        </main>
    );
}

/* COMPONENTS */

function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {children}
        </div>
    );
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
    return (
        <div>
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{desc}</p>
        </div>
    );
}

function Input({
    label,
    defaultValue,
}: {
    label: string;
    defaultValue: string;
}) {
    return (
        <label>
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <input
                defaultValue={defaultValue}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
        </label>
    );
}

function PreferenceRow({
    icon,
    label,
    desc,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    desc: string;
    value: string;
}) {
    return (
        <div className="grid gap-3 border-b border-slate-100 pb-4 last:border-0 md:grid-cols-[1fr_260px] md:items-center">
            <div className="flex gap-3">
                <div className="mt-1 text-slate-400">{icon}</div>
                <div>
                    <p className="text-sm font-medium text-slate-900">{label}</p>
                    <p className="text-sm text-slate-500">{desc}</p>
                </div>
            </div>

            <button className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                {value}
                <ChevronRight size={16} className="text-slate-400" />
            </button>
        </div>
    );
}

function ActionRow({
    icon,
    title,
    desc,
    action,
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
    action: string;
}) {
    return (
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
                <div className="mt-1 text-slate-400">{icon}</div>
                <div>
                    <p className="text-sm font-medium text-slate-900">{title}</p>
                    <p className="text-sm text-slate-500">{desc}</p>
                </div>
            </div>

            <button className="w-fit rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                {action}
            </button>
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
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-0">
            <div className="flex gap-3">
                <div className="mt-1 text-slate-400">{icon}</div>
                <div>
                    <p className="text-sm font-medium text-slate-900">{title}</p>
                    <p className="text-sm text-slate-500">{desc}</p>
                </div>
            </div>

            <div
                className={`flex h-6 w-11 shrink-0 items-center rounded-full p-1 ${active ? "bg-blue-600" : "bg-slate-300"
                    }`}
            >
                <span
                    className={`h-4 w-4 rounded-full bg-white transition ${active ? "translate-x-5" : ""
                        }`}
                />
            </div>
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
            <p className="text-sm text-slate-500">{label}</p>

            {badge ? (
                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                    {value}
                </span>
            ) : (
                <p className="text-sm font-medium text-slate-900">{value}</p>
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
      className={`flex w-full items-center justify-between py-4 ${
        danger ? "text-red-600" : "text-slate-700"
      }`}
    >
      <div className="flex items-center gap-3 text-sm font-medium">
        {icon}
        {label}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

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

function ThemeOption({
    icon,
    label,
    active,
}: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
}) {
    return (
        <button
            className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-medium ${active
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
        >
            {icon}
            {label}
        </button>
    );
}

function Integration({
    label,
    status,
}: {
    label: string;
    status: string;
}) {
    const connected = status === "Connected";

    return (
        <button className="flex w-full items-center justify-between py-4 text-left">
            <p className="text-sm font-medium text-slate-700">{label}</p>

            <span
                className={`text-xs font-medium ${connected ? "text-green-600" : "text-blue-600"
                    }`}
            >
                {status}
            </span>
        </button>
    );
}

function formatDate(date: Date | string) {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
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
        <div className="grid gap-3 border-b border-slate-100 pb-4 last:border-0 md:grid-cols-[1fr_260px] md:items-center">
            <div>
                <p className="text-sm font-medium text-slate-900">{label}</p>
                <p className="text-sm text-slate-500">{desc}</p>
            </div>

            <select
                name={name}
                defaultValue={defaultValue}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
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